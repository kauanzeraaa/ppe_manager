<script setup>
import { computed, ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Conexao com o supabase usando variáveis de ambiente para segurança e flexibilidade
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Estados principais
const loading = ref(true)
const hasError = ref(false)
const movimentacoes = ref([])
const epis = ref([]) // EPIs cadastrados (ativos) — base dos cards de conformidade

// Estados dos filtros
const filtroClassificacao = ref('todas')
const filtroUsuario = ref('')
const filtroSetor = ref('todos')
const filtroDataInicio = ref('')
const filtroDataFim = ref('')

// Aplica os filtros para a variável que realmente controla o que é mostrado na tabela e nos KPIs
const filtrosAtivos = ref({
  classificacao: 'todas',
  usuario: '',
  setor: 'todos',
  dataInicio: '',
  dataFim: ''
})

onMounted(async () => {
  await carregarMovimentacoes()
})

// Mapeia o tipo de receptor para a tabela e a coluna que representa o "setor"/origem
// Cada tipo guarda essa informação em uma coluna diferente: funcionário -> setor, aluno -> curso, visitante -> empresa
const CONFIG_RECEPTOR = {
  'Funcionário': { tabela: 'funcionario', colunaSetor: 'setor' },
  'Aluno': { tabela: 'aluno', colunaSetor: 'curso' },
  'Visitante': { tabela: 'visitante', colunaSetor: 'empresa' }
}

const carregarMovimentacoes = async () => {
  try {
    loading.value = true
    hasError.value = false

    // Busca as movimentações + os dados auxiliares em paralelo
    // O receptor é polimórfico: o nome vive em aluno/funcionario/visitante conforme o tipo_receptor
    // O responsável pela movimentação é o usuário (operador) que a registrou (id_usuario)
    const [movRes, epiRes, usuarioRes, alunoRes, funcRes, visitRes] = await Promise.all([
      supabase.from('movimentacao').select('*').order('create_at', { ascending: false }),
      supabase.from('epi').select('id, nome, classificacao, validade, certificado_autenticacao, ativo'),
      supabase.from('usuario').select('id, nome'),
      supabase.from('aluno').select('*'),
      supabase.from('funcionario').select('*'),
      supabase.from('visitante').select('*')
    ])

    const erro = movRes.error || epiRes.error || usuarioRes.error ||
                 alunoRes.error || funcRes.error || visitRes.error
    if (erro) throw erro

    // Guarda os EPIs ativos para alimentar os cards de conformidade (vencidos / a vencer)
    epis.value = (epiRes.data || []).filter(e => e.ativo !== false)

    // Índices por id para fazer o "join" no cliente sem custo de busca repetida
    const epiPorId = new Map((epiRes.data || []).map(e => [e.id, e]))
    const usuarioPorId = new Map((usuarioRes.data || []).map(u => [u.id, u]))
    const receptorPorTabela = {
      aluno: new Map((alunoRes.data || []).map(r => [r.id, r])),
      funcionario: new Map((funcRes.data || []).map(r => [r.id, r])),
      visitante: new Map((visitRes.data || []).map(r => [r.id, r]))
    }

    movimentacoes.value = (movRes.data || []).map(m => {
      const epi = epiPorId.get(m.id_equipamento) || {}
      const responsavel = usuarioPorId.get(m.id_usuario)

      const config = CONFIG_RECEPTOR[m.tipo_receptor]
      const receptor = (config && receptorPorTabela[config.tabela].get(m.id_receptor)) || {}
      const setor = config ? receptor[config.colunaSetor] : ''

      return {
        id: m.id,
        create_at: m.create_at,
        quantidade: m.quantidade,
        receptor: receptor.nome || 'Receptor Desconhecido',
        setor: setor || '',
        responsavel: responsavel?.nome || 'Não informado',
        epi: epi.nome || 'EPI Excluído',
        classificacao: epi.classificacao || null,
        validade: epi.validade || null,
        ca: epi.certificado_autenticacao || null
      }
    })
  } catch (error) {
    console.error("Erro ao carregar histórico:", error)
    hasError.value = true
  } finally {
    loading.value = false
  }
}

// Quando clica no botão, ele transfere o que foi digitado para o motor de busca
const aplicarFiltros = () => {
  filtrosAtivos.value = {
    classificacao: filtroClassificacao.value,
    usuario: filtroUsuario.value,
    setor: filtroSetor.value,
    dataInicio: filtroDataInicio.value,
    dataFim: filtroDataFim.value
  }
}

// Extrai setores únicos baseado no histórico
const setoresUnicos = computed(() => {
  return [...new Set(movimentacoes.value.map(m => m.setor).filter(Boolean))].sort()
})

// Garante que "Descartável" e "Reutilizável" sempre apareçam, mesmo sem dados ainda
const classificacoesUnicas = computed(() => {
  const dynamicClasses = [...new Set(movimentacoes.value.map(m => m.classificacao).filter(Boolean))]
  if (!dynamicClasses.includes('Reutilizável')) dynamicClasses.push('Reutilizável')
  if (!dynamicClasses.includes('Descartável')) dynamicClasses.push('Descartável')
  return dynamicClasses.sort()
})

// Função para checar validade
const getStatusValidade = (validadeDateStr) => {
  if (!validadeDateStr) return { label: 'Sem Validade', class: 'no-prazo' }
  
  const validade = new Date(validadeDateStr)
  if (isNaN(validade)) return { label: 'Sem Validade', class: 'no-prazo' } 

  validade.setHours(validade.getHours() + 12) 
  const hoje = new Date()
  
  const diffTime = validade.getTime() - hoje.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'Vencido', class: 'vencido' }
  if (diffDays <= 30) return { label: 'A Vencer', class: 'a-vencer' }
  return { label: 'No Prazo', class: 'no-prazo' }
}

// Motor de busca e filtro da tabela
const dadosFiltrados = computed(() => {
  const { classificacao, usuario, setor, dataInicio, dataFim } = filtrosAtivos.value

  return movimentacoes.value.filter(m => {
    const matchUsuario = usuario === '' || 
                         (m.receptor && m.receptor.toLowerCase().includes(usuario.toLowerCase()))
                         
    const matchClass = classificacao === 'todas' || 
                       (m.classificacao && m.classificacao.toLowerCase() === classificacao.toLowerCase())
                       
    const matchSetor = setor === 'todos' || m.setor === setor
    
    let matchData = true
    if (dataInicio && dataFim) {
      const dataMov = new Date(m.create_at).getTime()
      const start = new Date(dataInicio).getTime()
      const end = new Date(dataFim).getTime() + 86399000 // Fim do dia
      matchData = dataMov >= start && dataMov <= end
    }

    return matchUsuario && matchClass && matchSetor && matchData
  })
})

// Os cartões refletem a conformidade dos EPIs cadastrados (não das movimentações).
// Cada EPI é contado uma única vez; respeitam o filtro de classificação aplicado.
const kpis = computed(() => {
  const { classificacao } = filtrosAtivos.value
  let vencidos = 0
  let aVencer = 0

  epis.value.forEach(epi => {
    const matchClass = classificacao === 'todas' ||
                       (epi.classificacao && epi.classificacao.toLowerCase() === classificacao.toLowerCase())
    if (!matchClass) return

    const status = getStatusValidade(epi.validade)
    if (status.class === 'vencido') vencidos++
    if (status.class === 'a-vencer') aVencer++
  })

  return { vencidos, aVencer }
})

const getInicial = (nome) => {
  return nome ? nome.charAt(0).toUpperCase() : 'U'
}

const imprimir = () => {
  window.print()
}

// Função para formatar datas 
const formatarData = (dataStr) => {
  if (!dataStr) return '--/--/----'
  const data = new Date(dataStr)
  if (isNaN(data)) return '--/--/----'
  return data.toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="page" id="area-relatorio" v-if="!loading">
    
    <header class="page-header">
      <span class="badge">Relatório</span>
      <h1 class="title">Relatórios e Conformidade</h1>
    </header>

    <div class="error-banner" v-if="hasError">
      Erro ao carregar os dados. Verifique a conexão com o banco.
    </div>

    <section class="report-filters no-print">
      <div class="filter-box">
        <label>Período:</label>
        <div class="date-inputs">
          <input type="date" v-model="filtroDataInicio" />
          <span>-</span>
          <input type="date" v-model="filtroDataFim" />
        </div>
      </div>

      <div class="filter-box">
        <label>Classificação</label>
        <select v-model="filtroClassificacao">
          <option value="todas">Todas</option>
          <option v-for="cls in classificacoesUnicas" :key="cls" :value="cls">{{ cls }}</option>
        </select>
      </div>

      <div class="filter-box">
        <label>Usuário</label>
        <div class="input-with-icon">
          <input type="text" v-model="filtroUsuario" placeholder="Buscar por usuário" />
        </div>
      </div>

      <div class="filter-box">
        <label>Setor / Origem</label>
        <select v-model="filtroSetor">
          <option value="todos">Todos</option>
          <option v-for="setor in setoresUnicos" :key="setor" :value="setor">{{ setor }}</option>
        </select>
      </div>

      <div class="filter-box action-box">
        <button class="btn-filtrar" @click="aplicarFiltros">Filtrar</button>
      </div>
    </section>

    <section class="kpi-cards">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="dot red"></span>
          <h3>EPIs Vencidos</h3>
        </div>
        <div class="kpi-body">
          <div class="kpi-number">{{ kpis.vencidos }}</div>
          <div class="kpi-icon red"><img src="../assets/alert.png" alt="" class="kpi-icon-img"></div>
        </div>
        <div class="kpi-footer">Necessário troca imediata</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="dot yellow"></span>
          <h3>A Vencer</h3>
        </div>
        <div class="kpi-body">
          <div class="kpi-number">{{ kpis.aVencer }}</div>
          <div class="kpi-icon yellow"><img src="../assets/warning.png" alt="" class="kpi-icon-img"></div>
        </div>
        <div class="kpi-footer">Itens necessitam de atenção (30 dias)</div>
      </div>

      <div class="action-right no-print">
        <button class="btn-pdf" @click="imprimir">
          Gerar PDF
        </button>
      </div>
    </section>

    <section class="table-section">
      <div class="table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th>Data de Entrega</th>
              <th>Usuário</th>
              <th>EPI</th>
              <th>Setor / Origem</th>
              <th>CA</th>
              <th>Validade</th>
              <th>Quantidade</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dadosFiltrados" :key="item.id">
              <td>{{ formatarData(item.create_at) }}</td>
              <td class="user-cell">
                <div class="avatar">{{ getInicial(item.receptor) }}</div>
                <span>{{ item.receptor }}</span>
              </td>
              <td>{{ item.epi }}</td>
              <td>{{ item.setor || '—' }}</td>
              <td>{{ item.ca || 'N/A' }}</td>
              <td>{{ formatarData(item.validade) }}</td>
              <td>{{ item.quantidade }} un</td>
              <td class="text-muted font-weight-bold">{{ item.responsavel }}</td>
            </tr>
            <tr v-if="dadosFiltrados.length === 0">
              <td colspan="8" class="empty-state">Nenhum registro encontrado com estes filtros.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>

  <div v-else class="loading-state">
    Carregando relatório de conformidade...
  </div>
</template>

<style scoped>
.page-header {
  flex: 0 0 auto !important;
}

.page {
  font-family: var(--font-secondary);
  display: flex;
  flex-direction: column;
  align-items: stretch !important;
  width: 100% !important;
  padding-bottom: 40px;
  color: #333;
  box-sizing: border-box;
}

.page section {
  height: auto;
  padding: 0;
}

.badge {
  display: inline-block;
  background: #f39d125c;
  color: #f39c12;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 6px;
  margin-bottom: 0;
}

.title {
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 20px;
  font-family: var(--font-primary);
  text-align: left;
}

/* Filtros Horizontais Corrigidos */
.report-filters {
  display: flex;
  flex-direction: row !important;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  width: 100%;
  margin-bottom: 32px;
}

.filter-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 120px;
  text-align: left;
}

.filter-box.action-box {
  flex: 0 0 auto;
}

.filter-box label {
  font-size: 13px;
  font-weight: 700;
  color: #333;
}

.filter-box input, .filter-box select {
  height: 42px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  background: white;
  color: #333;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  padding: 0 8px;
  height: 42px;
  width: 100%;
  box-sizing: border-box;
}
.date-inputs input {
  border: none;
  height: 100%;
  padding: 0;
  width: 100%;
  outline: none;
}
.date-inputs span { color: #888; }

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.input-with-icon input {
  padding-right: 36px;
}
.search-icon {
  position: absolute;
  right: 12px;
  color: #888;
  font-size: 14px;
}

.btn-filtrar {
  background-color: #34495E;
  color: white;
  border: none;
  height: 42px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
}
.btn-filtrar:hover { background-color: #2C3E50; }

/* Cards KPI */
.kpi-cards {
  display: flex;
  flex-direction: row !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
}

.kpi-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  width: 260px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  text-align: left;
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.kpi-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #222;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background-color: #C0392B; }
.dot.yellow { background-color: #F39C12; }

.kpi-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}
.kpi-number {
  font-size: 38px;
  font-weight: 700;
  line-height: 1;
  color: #222;
}
.kpi-icon { font-size: 24px; }
.kpi-footer { font-size: 12px; color: #666; }
.kpi-icon-img {
  width: 24px;
  height: 24px;
}

.action-right {
  margin-left: auto !important; 
  align-self: flex-end !important;
}
.btn-pdf {
  background-color: #F4F6F7;
  color: #333;
  border: 1px solid #E5E8E8;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-pdf:hover { background-color: #EAEDED; }

/* Tabela */
.table-section {
  width: 100%;
}

.table-container {
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  background: white;
  width: 100% !important;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
  font-size: 13px;
  white-space: normal;
}

.report-table th,
.report-table td {
  white-space: normal;
  word-break: break-word;
}

.report-table th {
  background-color: #F39C12;
  color: white;
  padding: 14px;
  font-weight: 600;
}

.report-table td {
  padding: 14px;
  border-bottom: 1px solid #F2F4F4;
  vertical-align: middle;
  color: #444;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #333;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E5E7E9;
  color: #7F8C8D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.text-muted { color: #64748b; font-size: 0.9rem; }
.font-weight-bold { font-weight: 600; }

.empty-state { text-align: center; color: #888; padding: 40px !important; }

/* ========================================================
   ESTILOS DE RESPONSIVIDADE (MOBILE E TABLET)
======================================================== */

/* Ajustes para Tablets (Telas médias) */
@media (max-width: 992px) {
  .report-filters {
    flex-wrap: wrap;
  }
  .filter-box {
    flex: 1 1 45%; /* Faz os filtros ocuparem metade da tela cada */
  }
  .kpi-cards {
    flex-wrap: wrap;
  }
}

/* Ajustes para Celulares (Telas pequenas) */
@media (max-width: 768px) {
  .badge {
    font-size: 0.9rem;
    padding: 4px 12px;
  }

  .title {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  /* 1. FILTROS: Empilha todos os campos de busca */
  .report-filters {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px;
  }
  
  .filter-box {
    width: 100%;
    flex: none;
  }

  .btn-filtrar {
    margin-top: 10px;
  }

  /* 2. CARDS KPI: Empilha os cartões e ajusta o botão de PDF */
  .kpi-cards {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 16px;
  }
  
  .kpi-card {
    width: 100%; /* Ocupa 100% da largura do celular */
    box-sizing: border-box;
  }

  .action-right {
    margin-left: 0 !important;
    align-self: stretch !important;
  }

  .btn-pdf {
    width: 100%;
    justify-content: center;
    padding: 14px; /* Aumenta a área de clique para o dedo */
    font-size: 15px;
  }

  /* 3. TABELA: Garante a rolagem horizontal suave */
  .table-container {
    -webkit-overflow-scrolling: touch; /* Rolagem mais fluida no iOS */
    border-radius: 8px;
  }
  
  .report-table {
    min-width: 1000px; /* Força a tabela a não se espremer, ativando o scroll */
  }
}

</style>

<style>

@media print {
  body * { visibility: hidden; }
  #area-relatorio, #area-relatorio * { visibility: visible; }
  #area-relatorio { position: absolute; left: 0; top: 0; width: 100%; }
  .no-print, .no-print * { display: none !important; }
  .table-container { box-shadow: none !important; overflow: visible !important; width: 100% !important; }
  .report-table {
    width: 100% !important;
    table-layout: fixed !important;
  }
  .report-table th,
  .report-table td {
    white-space: normal !important;
    word-break: break-word !important;
    padding: 10px !important;
  }
  .report-table th { background-color: #F39C12 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .avatar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>