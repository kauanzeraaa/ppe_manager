<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

import BarChart from '../components/BarChart.vue'

// Configurações do supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Estados para o dashboard
const loading = ref(true)
const hasError = ref(false)

const kpi = ref({
  totalEpis: 0,
  estoqueTotal: 0,
  itensCriticos: 0,
  caVencidos: 0,
  caVencendo: 0,
  solicitacoesPendentes: 0
})

const activityFeed = ref([])
const chartEstoque = ref({ labels: [], data: [] })
const chartSolicitacoes = ref({ labels: ['Aprovadas', 'Pendentes', 'Reprovadas'], data: [0, 0, 0] })

// Declaração de corees
const palette = {
  primary: '#2B4A69',
  secondary: '#8FA9C4',
  accent: '#F39C12',
  success: '#2FA66A',
  danger: '#D95C4F',
  light: '#e2e8f0'
}

// Carrega os dados do dashboard ao montar o componente
onMounted(async () => {
  await carregarDashboard()
})

// Função principal para carregar todos os dados do dashboard
const carregarDashboard = async () => {
  try {
    loading.value = true
    hasError.value = false

    const hoje = new Date()
    const trintaDias = new Date(hoje)
    trintaDias.setDate(trintaDias.getDate() + 30)

    // busca epi e validades
    const { data: epis, error: errEpi } = await supabase.from('epi').select('id, validade')
    if (errEpi) throw errEpi

    kpi.value.totalEpis = epis.length

    let vencidos = 0
    let vencendo = 0
    epis.forEach(epi => {
      const dataValidade = new Date(epi.validade)
      if (dataValidade < hoje) vencidos++
      else if (dataValidade <= trintaDias) vencendo++
    })
    kpi.value.caVencidos = vencidos
    kpi.value.caVencendo = vencendo

    // estoque e itens críticos
    const { data: estoque, error: errEstoque } = await supabase
      .from('estoque')
      .select('quantidade_atual, estoque_minimo, epi!inner(nome)')
      .eq('epi.ativo', true)
    if (errEstoque) throw errEstoque

    let totalEmEstoque = 0
    let criticos = 0

    estoque.forEach(item => {
      // força a conversão para número, tratando casos de null ou undefined
      const qtdAtual = Number(item.quantidade_atual) || 0
      const qtdMinima = Number(item.estoque_minimo) || 0

      // soma para o total em estoque
      totalEmEstoque += qtdAtual

      // verifica os criticos
      if (qtdAtual < qtdMinima) criticos++
    })

    // 5 itens com mais volume para o gráfico
    const estoqueOrdenado = estoque.sort((a, b) => (Number(b.quantidade_atual) || 0) - (Number(a.quantidade_atual) || 0))

    kpi.value.estoqueTotal = totalEmEstoque
    kpi.value.itensCriticos = criticos
    chartEstoque.value.labels = estoqueOrdenado.slice(0, 5).map(e => e.epi?.nome || 'EPI sem nome')
    chartEstoque.value.data = estoqueOrdenado.slice(0, 5).map(e => Number(e.quantidade_atual) || 0)

    // solicitações para o gráfico de pizza e KPI de pendentes
    const { data: solicitacoes, error: errSol } = await supabase.from('solicitacao').select('status')
    if (errSol) throw errSol

    let aprovado = 0, pendente = 0, reprovado = 0
    solicitacoes.forEach(s => {
      if (s.status === 'Aprovado') aprovado++
      else if (s.status === 'Pendente') pendente++
      else if (s.status === 'Reprovado') reprovado++
    })

    kpi.value.solicitacoesPendentes = pendente
    chartSolicitacoes.value.data = [aprovado, pendente, reprovado]

    // feed de atividades - puxa as últimas movimentações, juntando com os nomes dos EPIs e usuários para exibir de forma amigável
    const { data: movs, error: errMov } = await supabase
      .from('movimentacao')
      .select('quantidade, tipo_movimentacao, create_at, epi(nome), usuario(nome)')
      .order('create_at', { ascending: false })
      .limit(6) // puxa as 6 últimas para preencher bem a lateral
    if (errMov) throw errMov

    activityFeed.value = movs

  } catch (error) {
    console.error("Erro ao montar dashboard:", error)
    hasError.value = true
  } finally {
    loading.value = false
  }
}

// Configurações dos gráficos
const chartDataEstoque = computed(() => [{
  label: 'Unidades Disponíveis',
  data: chartEstoque.value.data,
  backgroundColor: [palette.primary, palette.secondary, palette.accent, palette.success, palette.light]
}])

// Para o gráfico de solicitações, as cores são fixas para cada status
const chartDataSolicitacoes = computed(() => [{
  label: 'Total',
  data: chartSolicitacoes.value.data,
  backgroundColor: [palette.success, palette.accent, palette.danger]
}])

// Função para formatar datas de forma amigável no feed de atividades
const formatarDataAmigavel = (dataString) => {
  const diff = new Date() - new Date(dataString)
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min === 0 ? 1 : min} min atrás`
  const horas = Math.floor(min / 60)
  if (horas < 24) return `${horas}h atrás`
  return new Date(dataString).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="page" v-if="!loading">

    <div class="error-banner" v-if="hasError">
      <img src="../assets/warning.png" alt="" class="alert-icon" />
      Não foi possível carregar os dados. Verifique a conexão com o banco de dados.
    </div>

    <header class="page-header">
      <span class="badge">Dashboard</span>
      <h1 class="title">Visão Geral do Sistema</h1>
      <p class="subtitle">Acompanhe a saúde do estoque e conformidades normativas.</p>
    </header>

    <div class="alerts-container" v-if="kpi.itensCriticos > 0 || kpi.caVencidos > 0">
      <div class="alert-card critical" v-if="kpi.itensCriticos > 0">
        <div class="alert-icon">
          <img src="../assets/alert.png" alt="" class="alert-icon" />
        </div>
        <div class="alert-text">
          <strong>Atenção ao Estoque</strong>
          <span><b>{{ kpi.itensCriticos }} itens</b> no estoque atingiram o nível crítico e necessitam de avaliação de
            reposição imediata.</span>
        </div>
      </div>

      <div class="alert-card warning" v-if="kpi.caVencidos > 0">
        <div class="alert-icon">
          <img src="../assets/warning.png" alt="" class="alert-icon" />
        </div>
        <div class="alert-text">
          <strong>Certificados Irregulares</strong>
          <span><b>{{ kpi.caVencidos }} EPIs</b> estão com o CA vencido no sistema, bloqueando a conformidade
            normativa.</span>
        </div>
      </div>
    </div>

    <section class="kpi-grid">
      <article class="kpi-card">
        <div class="kpi-icon blue"><img src="../assets/verify.png" alt="" class="alert-icon" /></div>
        <div class="kpi-info">
          <small>EPIs Cadastrados</small>
          <strong>{{ kpi.totalEpis }}</strong>
        </div>
      </article>

      <article class="kpi-card">
        <div class="kpi-icon green"><img src="../assets/box.png" alt="" class="alert-icon" /></div>
        <div class="kpi-info">
          <small>Volume em Estoque</small>
          <strong>{{ kpi.estoqueTotal }}</strong>
        </div>
      </article>

      <article class="kpi-card">
        <div class="kpi-icon orange"><img src="../assets/clipboard.png" alt="" class="alert-icon" /></div>
        <div class="kpi-info">
          <small>CA Vencendo (30 dias)</small>
          <strong>{{ kpi.caVencendo }}</strong>
        </div>
      </article>

      <article class="kpi-card">
        <div class="kpi-icon slate"><img src="../assets/bell.png" alt="" class="alert-icon" /></div>
        <div class="kpi-info">
          <small>Solicitações Pendentes</small>
          <strong>{{ kpi.solicitacoesPendentes }}</strong>
        </div>
      </article>
    </section>

    <div class="main-grid">

      <div class="charts-column">
        <section class="panel chart-panel">
          <h2>Top 5 EPIs em Estoque</h2>
          <BarChart type="doughnut" :labels="chartEstoque.labels" :datasets="chartDataEstoque" :height="260" />
        </section>

        <section class="panel chart-panel">
          <h2>Status das Solicitações</h2>
          
          <BarChart
            v-if="chartSolicitacoes.data.reduce((a, b) => a + b, 0) > 0"
            type="pie"
            :labels="chartSolicitacoes.labels"
            :datasets="chartDataSolicitacoes"
            :height="260"
          />
          
          <div v-else class="empty-state">
            Nenhuma solicitação registrada no momento.
          </div>
        </section>
      </div>

      <div class="side-column">
        <section class="panel feed-panel">
          <div class="panel-header-simple">
            <h2>Últimas Atividades</h2>
            <RouterLink to="/historic" class="link-muted">Ver todas</RouterLink>
          </div>

          <div class="feed-list" v-if="activityFeed.length > 0">
            <div class="feed-item" v-for="(item, index) in activityFeed" :key="index">
              <div class="feed-bullet"></div>
              <div class="feed-content">
                <strong>{{ item.tipo_movimentacao }} ({{ item.quantidade }}x)</strong>
                <span>{{ item.epi?.nome || 'EPI Excluído' }} - Por: {{ item.usuario?.nome || 'Desconhecido' }}</span>
                <small>{{ formatarDataAmigavel(item.create_at) }}</small>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">Nenhuma movimentação registrada.</div>
        </section>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    Carregando indicadores do sistema...
  </div>
</template>

<style scoped>
/* base da tela */
.page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

/* Neutraliza a regra global "section { height: 100vh }" do global.css,
   que estava esticando cada painel/section para uma tela inteira */
.page section {
  height: auto;
}

.error-banner {
  background: #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.loading-state {
  text-align: center;
  color: #64748b;
  padding: 60px;
  font-weight: 500;
}

/* header - padrão igual às outras telas */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
}

.badge {
  display: inline-block;
  align-self: flex-start;
  background: #f39d125c;
  color: #f39c12;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 6px;
  margin-bottom: 0;
}

.title {
  margin: 0;
  font-size: 2rem;
  color: #333;
  font-weight: 300;
  font-family: var(--font-primary);
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
}

/* Alertas */
.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 6px solid transparent;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
}

.alert-card.critical {
  background: #fff1f2;
  border-left-color: #e11d48;
  color: #9f1239;
}

.alert-card.warning {
  background: #fffbeb;
  border-left-color: #d97706;
  color: #92400e;
}

.alert-icon {
  width: 30px;
}

.alert-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-text strong {
  font-size: 1.05rem;
  font-weight: 700;
  color: inherit;
}

.alert-text span {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Kpi grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  height: auto !important;
  margin-bottom: -20px;
  margin-top: -30px;
}

.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  height: fit-content;
}

.kpi-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.kpi-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}

.kpi-icon.blue {
  background: #eff6ff;
  color: #3b82f6;
}

.kpi-icon.green {
  background: #ecfdf5;
  color: #10b981;
}

.kpi-icon.orange {
  background: #fff7ed;
  color: #f97316;
}

.kpi-icon.slate {
  background: #f8fafc;
  color: #64748b;
}

.kpi-info {
  display: flex;
  flex-direction: column;
}

.kpi-info small {
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-info strong {
  color: #0f172a;
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.2;
}

/* main grid */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.charts-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Gráficos lado a lado */
.side-column {
  display: flex;
  flex-direction: column;
}

/* paineis */
.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

.panel h2 {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  color: #0f172a;
  font-weight: 600;
}

.panel-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-header-simple h2 {
  margin: 0;
}

.link-muted {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;
  gap: 4px;
}

.link-muted:hover {
  color: #f39c12;
}

/* timeline */
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
}

.feed-list::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #e2e8f0;
}

.feed-item {
  display: flex;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.feed-bullet {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #cbd5e1;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #e2e8f0;
  margin-top: 2px;
  flex-shrink: 0;
}

.feed-item:first-child .feed-bullet {
  background: #f39c12;
}

/* Destaque na ação mais recente */
.feed-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feed-content strong {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 600;
}

.feed-content span {
  font-size: 0.85rem;
  color: #475569;
}

.feed-content small {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  padding: 40px 0;
}

/* responsividade */
@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .charts-column {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-column {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .kpi-grid {
    grid-template-columns: 1fr;
    margin-bottom: 0;
    margin-top: -19px;
  }

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
}
</style>