<script>
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  data() {
    return {
      equipamentos: [],
      loading: true,
      error: null,
      searchTerm: '',
      selectedClassificacao: null,
      userRole: null, // guarda 'Administrador' ou 'Operador'
      userId: null, // id do usuário logado (para registrar a solicitação)
      showEditModal: false, // controla se o modal aparece
      equipamentoEmEdicao: null, // guarda os dados do epi que foi clicado
      activeDropdown: null,

      // Modal de solicitação de reposição (Operador)
      showRepoModal: false,
      repoEpi: null, // EPI alvo da solicitação
      repoForm: {
        quantidade: 1,
        justificativa: ''
      },
      savingRepo: false,

      toast: {
        show: false,
        message: '',
        type: 'success' // pode ser 'success' ou 'error'
      }
    }
  },
  async mounted() {
    await this.fetchUserRole() // descobre quem é o usuario
    await this.loadEquipamentos()
  },
  computed: {
    equipamentosFiltrados() {
      return this.equipamentos.filter(equipamento => {
        const matchSearch = equipamento.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           equipamento.descricao.toLowerCase().includes(this.searchTerm.toLowerCase())
        const matchClassificacao = !this.selectedClassificacao ||
                                  equipamento.classificacao === this.selectedClassificacao
        return matchSearch && matchClassificacao
      })
    }
  },
  methods: {
    // função para buscar os usuários e retornar se ele é operador ou administrador
    async fetchUserRole() {
      try{
        const { data: {user}} = await supabase.auth.getUser()
        if(user){
          this.userId = user.id

          const {data, error} = await supabase
            .from('usuario')
            .select('funcao')
            .eq('id', user.id)
            .maybeSingle()

          if(data) {
            this.userRole = data.funcao
          }
        }
      }catch (err){
        console.log("Erro ao buscar a função do usuário:", err)
      }
    },

    // função para carregar os equipamentos cadastrados no banco
    async loadEquipamentos() {
      this.loading = true // Garante o loading ao recarregar
      this.error = null
      try {

        const { data, error } = await supabase
          .from('view_estoque_epi')
          .select('*')
          .order('nome', { ascending: true })

        if (error) {
          console.error('Erro ao buscar equipamentos:', error)
          this.error = 'Erro ao carregar dados'
          return
        }

        // Mapear os dados com ID sequencial
        this.equipamentos = data.map((item, index) => ({
          id_real: item.epi_id || item.id, // UUID do banco
          id_visual: String(index + 1).padStart(2, '0'), // ID visual
          nome: item.nome,
          descricao: item.descricao,
          classificacao: item.classificacao,
          tamanho: item.tamanho,
          quantidade: item.quantidade_atual,
          estoque_minimo: item.estoque_minimo,
          validade: item.validade,
          certificado_autenticacao: item.certificado_autenticacao
        }))

      } catch (err) {
        console.error('Erro inesperado ao carregar equipamentos:', err)
        this.error = 'Erro ao carregar dados'
      } finally {
        this.loading = false
      }
    },

    openActions(equipamento) {
      this.equipamentoEmEdicao = { ...equipamento}
      this.showEditModal = true
    },

    // função para fechar o modal
    closeModal(){
      this.showEditModal = false
      this.equipamentoEmEdicao = null
    },

    // funcção para salvar as edições do EPI (KAUAN CRIAR DEPOIS)
    async salvarEdicao() {
      try {
        // Validação super rápida para não salvar EPI sem nome
        if (!this.equipamentoEmEdicao.nome) {
          this.showToast('O nome do equipamento é obrigatório!', 'error');
          return;
        }

        // --- lógica de update (editar epi) ---
        if (this.equipamentoEmEdicao.id_real) {
          const { error: errorEpi } = await supabase
            .from('epi')
            .update({
              nome: this.equipamentoEmEdicao.nome,
              descricao: this.equipamentoEmEdicao.descricao,
              certificado_autenticacao: this.equipamentoEmEdicao.certificado_autenticacao,
              classificacao: this.equipamentoEmEdicao.classificacao,
              tamanho: this.equipamentoEmEdicao.tamanho,
              validade: this.equipamentoEmEdicao.validade || null
            })
            .eq('id', this.equipamentoEmEdicao.id_real);

          if (errorEpi) throw errorEpi;

          const { error: errorEstoque } = await supabase
            .from('estoque')
            .update({
              quantidade_atual: this.equipamentoEmEdicao.quantidade,
              estoque_minimo: this.equipamentoEmEdicao.estoque_minimo
            })
            .eq('id_equipamento', this.equipamentoEmEdicao.id_real);

          if (errorEstoque) throw errorEstoque;
          
          this.showToast('Dados atualizados com sucesso!', 'success');

        }
        // --- lógica para inserir novo EPI ---
        else {
          const { data: novoEpi, error: errorEpi } = await supabase
            .from('epi')
            .insert({
              nome: this.equipamentoEmEdicao.nome,
              descricao: this.equipamentoEmEdicao.descricao,
              certificado_autenticacao: this.equipamentoEmEdicao.certificado_autenticacao,
              classificacao: this.equipamentoEmEdicao.classificacao,
              tamanho: this.equipamentoEmEdicao.tamanho,
              validade: this.equipamentoEmEdicao.validade || null,
              ativo: true
            })
            .select('id')
            .single();

          if (errorEpi) throw errorEpi;

          // com o ID novo em mãos, cria o estoque dele
          const { error: errorEstoque } = await supabase
            .from('estoque')
            .insert({
              id_equipamento: novoEpi.id,
              quantidade_atual: this.equipamentoEmEdicao.quantidade,
              estoque_minimo: this.equipamentoEmEdicao.estoque_minimo
            });

          if (errorEstoque) throw errorEstoque;

          this.showToast('Novo EPI cadastrado com sucesso!', 'success');
        }

        // fecha e recarrega
        this.closeModal();
        await this.loadEquipamentos();

      } catch (error) {
        console.error('Erro ao salvar:', error);
        this.showToast('Erro ao salvar no banco de dados.', 'error');
      }
    },

    resetFilters() {
      this.searchTerm = ''
      this.selectedClassificacao = null
    },

    qtyBadgeClass(qty, estoqueMinimo) {
      if (qty <= estoqueMinimo) return 'red'
      if (qty <= estoqueMinimo + 10) return 'orange'
      return 'green'
    },

    dateBadgeClass(dateStr) {
      if (!dateStr) return 'green'
      
      // Parsear a data considerando timezone UTC
      const parts = dateStr.split('-')
      if (parts.length !== 3) return 'green'
      
      const [year, month, day] = parts
      const valityDate = new Date(year, Number(month) - 1, Number(day))
      const today = new Date()
      
      // Normalizar ambas as datas para midnight em UTC para comparação consistente
      valityDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      
      // Calcular diferença em dias
      const diffMs = valityDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'red'      // Vencido
      if (diffDays <= 30) return 'orange' // Faltando até 30 dias
      return 'green'                      // Acima de 30 dias
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      const parts = dateStr.split('-')
      if (parts.length !== 3) return dateStr
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    },

    toggleDropdown(id) {
      // Se clicar no que já está aberto, ele fecha. Se clicar em outro, ele abre o novo.
      this.activeDropdown = this.activeDropdown === id ? null : id
    },

    abrirModalEdicao(equipamento) {
      this.activeDropdown = null // Fecha o menu
      this.equipamentoEmEdicao = { ...equipamento }
      this.showEditModal = true
    },

    async excluirEPI(equipamento) {
      this.activeDropdown = null // Fecha o menu
      
      const confirmacao = window.confirm(`Deseja realmente excluir o EPI "${equipamento.nome}"?`)
      if (!confirmacao) return

      try {
        const { error } = await supabase
          .from('epi')
          .update({ ativo: false })
          .eq('id', equipamento.id_real)

        if (error) throw error

        await this.loadEquipamentos()
        this.showToast('Equipamento excluído com sucesso!')
      } catch (error) {
        console.error(error)
        this.showToast('Erro ao excluir o equipamento.')
      }
    },

    // Abre o modal de solicitação de reposição para o EPI escolhido
    solicitarReposicao(equipamento) {
      this.activeDropdown = null // Fecha o menu
      this.repoEpi = equipamento
      this.repoForm = { quantidade: 1, justificativa: '' }
      this.showRepoModal = true
    },

    fecharModalReposicao() {
      this.showRepoModal = false
      this.repoEpi = null
    },

    // Registra a solicitação de reposição na tabela 'solicitacao' (status Pendente)
    async confirmarSolicitacao() {
      const quantidade = parseInt(this.repoForm.quantidade)

      if (!quantidade || quantidade < 1) {
        this.showToast('Informe uma quantidade válida (mínimo 1).', 'error')
        return
      }

      if (!this.userId) {
        this.showToast('Não foi possível identificar o usuário logado.', 'error')
        return
      }

      try {
        this.savingRepo = true

        const { error } = await supabase
          .from('solicitacao')
          .insert({
            id_equipamento: this.repoEpi.id_real,
            id_usuario: this.userId,
            quantidade_solicitada: quantidade,
            justificativa: this.repoForm.justificativa?.trim() || null,
            status: 'Pendente'
          })

        if (error) throw error

        this.showToast('Solicitação de reposição enviada ao Administrador!', 'success')
        this.fecharModalReposicao()
      } catch (error) {
        console.error('Erro ao solicitar reposição:', error)
        this.showToast('Erro ao enviar a solicitação de reposição.', 'error')
      } finally {
        this.savingRepo = false
      }
    },

    showToast(message, type = 'success') {
      this.toast.message = message
      this.toast.type = type
      this.toast.show = true
      
      // Esconde o aviso automaticamente após 3 segundos
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },

    abrirModalNovo() {
      this.activeDropdown = null;
      // Cria um objeto "vazio" sem ID
      this.equipamentoEmEdicao = {
        id_real: null,
        nome: '',
        descricao: '',
        certificado_autenticacao: '',
        classificacao: 'Reutilizável',
        tamanho: '',
        validade: '',
        quantidade: 0,
        estoque_minimo: 0
      };
      this.showEditModal = true;
    }
  }
}
</script>

<template>
  
  <div class="page" @click="activeDropdown = null">
    <span class="badge">Estoque</span>
    <h1 class="title">Equipamentos Cadastrados</h1>
    
    <div class="filters-container">
      <div class="search-box">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por nome ou descrição..."
          class="search-input"
        />
      </div>
      
      <div class="filter-buttons">
        <button 
          :class="['filter-btn', { active: selectedClassificacao === null }]"
          @click="selectedClassificacao = null"
        >
          Todos
        </button>
        <button 
          :class="['filter-btn', { active: selectedClassificacao === 'Reutilizável' }]"
          @click="selectedClassificacao = 'Reutilizável'"
        >
          Reutilizáveis
        </button>
        <button 
          :class="['filter-btn', { active: selectedClassificacao === 'Descartável' }]"
          @click="selectedClassificacao = 'Descartável'"
        >
          Descartáveis
        </button>
      </div>
    </div>

    <div class="admin-actions-bar" v-if="userRole === 'Administrador'">
      <button class="btn-primary" @click="abrirModalNovo">
        Registrar novo equipamento
      </button>
    </div>
    
    <table class="table">
        <thead class="header-table">
          <tr>
          <th>ID</th>
          <th>NOME/DESCRIÇÃO</th>
          <th>CLASSIFICAÇÃO</th>
          <th>TAMANHO</th>
          <th>QUANTIDADE</th>
          <th>VALIDADE</th>
          <th></th>
          </tr>
        </thead>
        <tbody class="content-table">
            <tr v-if="loading">
              <td colspan="7" style="text-align: center; padding: 20px; color: #777;">
                Carregando estoque...
              </td>
            </tr>

            <tr v-else-if="error">
              <td colspan="7" style="text-align: center; padding: 20px; color: #c0392b;">
                {{ error }}
              </td>
            </tr>

            <tr v-else-if="equipamentosFiltrados.length === 0">
              <td colspan="7" style="text-align: center; padding: 20px; color: #777;">
                Nenhum equipamento encontrado com os filtros atuais.
              </td>
            </tr>

            <tr v-else v-for="equipamento in equipamentosFiltrados" :key="equipamento.id_real">
              <td>{{ equipamento.id_visual }}</td>
              <td class="name-cell">
                <div class="product-name">{{ equipamento.nome }}</div>
                <div class="product-description">{{ equipamento.descricao }}</div>
              </td>
              <td>{{ equipamento.classificacao }}</td>
              <td>{{ equipamento.tamanho }}</td>
              <td>
                <span :class="['badge-qty', qtyBadgeClass(equipamento.quantidade, equipamento.estoque_minimo)]">
                  {{ equipamento.quantidade }}
                </span>
              </td>
              <td>
                <span :class="['badge-date', dateBadgeClass(equipamento.validade)]">
                  {{ formatDate(equipamento.validade) }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="actions-btn" @click.stop="toggleDropdown(equipamento.id_real)" aria-label="Ações">⋮</button>
                
                <div class="dropdown-menu" v-if="activeDropdown === equipamento.id_real">
                  
                  <button class="dropdown-item" @click="abrirModalEdicao(equipamento)">
                    Editar EPI
                  </button>
                  
                  <button class="dropdown-item danger" v-if="userRole === 'Administrador'" @click="excluirEPI(equipamento)">
                    Excluir
                  </button>

                  <button class="dropdown-item" v-if="userRole === 'Operador'" @click="solicitarReposicao(equipamento)">
                    Solicitar Reposição
                  </button>

                </div>
              </td>
            </tr>
        </tbody>
    </table>

    <div style="height: 60px; width: 100%; display: block; clear: both;"></div>
 
    <div class="modal-overlay" v-if="showEditModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ equipamentoEmEdicao.id_real ? 'Editar Equipamento' : 'Novo Equipamento' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body" v-if="equipamentoEmEdicao">
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Nome do Equipamento</label>
              <input type="text" v-model="equipamentoEmEdicao.nome" class="form-input" />
            </div>
            <div class="form-group">
              <label>C.A (Certificado)</label>
              <input type="text" v-model="equipamentoEmEdicao.certificado_autenticacao" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>Descrição Detalhada</label>
            <textarea v-model="equipamentoEmEdicao.descricao" class="form-input" rows="2"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>Classificação</label>
              <select v-model="equipamentoEmEdicao.classificacao" class="form-input">
                <option value="Reutilizável">Reutilizável</option>
                <option value="Descartável">Descartável</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tamanho</label>
              <input type="text" v-model="equipamentoEmEdicao.tamanho" class="form-input" />
            </div>
            <div class="form-group">
              <label>Validade</label>
              <input type="date" v-model="equipamentoEmEdicao.validade" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Qtd. Atual no Estoque</label>
              <input type="number" v-model="equipamentoEmEdicao.quantidade" class="form-input" min="0" />
            </div>
            <div class="form-group">
              <label>Estoque Mínimo (Alerta)</label>
              <input type="number" v-model="equipamentoEmEdicao.estoque_minimo" class="form-input" min="0" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn-primary" @click="salvarEdicao">Salvar Alterações</button>
        </div>
  
      </div>
    </div>

    <!-- Modal de Solicitação de Reposição (Operador) -->
    <div class="modal-overlay" v-if="showRepoModal" @click.self="fecharModalReposicao">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h2>Solicitar Reposição</h2>
          <button class="close-btn" @click="fecharModalReposicao">×</button>
        </div>

        <div class="modal-body" v-if="repoEpi">
          <p class="repo-epi-info">
            Equipamento: <strong>{{ repoEpi.nome }}</strong><br />
            <span class="repo-epi-sub">Estoque atual: {{ repoEpi.quantidade }} un.</span>
          </p>

          <div class="form-group">
            <label>Quantidade necessária para reposição</label>
            <input
              type="number"
              v-model="repoForm.quantidade"
              class="form-input"
              min="1"
              @keyup.enter="confirmarSolicitacao"
            />
          </div>

          <div class="form-group">
            <label>Justificativa (opcional)</label>
            <textarea
              v-model="repoForm.justificativa"
              class="form-input"
              rows="3"
              placeholder="Ex.: estoque abaixo do mínimo, alta demanda no setor..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="fecharModalReposicao">Cancelar</button>
          <button class="btn-primary" @click="confirmarSolicitacao" :disabled="savingRepo">
            {{ savingRepo ? 'Enviando...' : 'Enviar Solicitação' }}
          </button>
        </div>
      </div>
    </div>

    <div :class="['toast-notification', toast.type, { 'show': toast.show }]">
      {{ toast.message }}
    </div>

  </div>
</template>

<style scoped>

.content-table tr {
    height: 40px;
    background-image: linear-gradient(to right, transparent 0%, #cac7c7 3%, #cac7c7 98%, transparent 0%);
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 100% 1px;
} 

.content-table td {
    padding: 12px 15px;
    font-size: 14px;
    font-weight: 300;
    text-align: center;
}

.content-table td.name-cell {
  text-align: left;
}

.content-table tr:last-child td {
  border-bottom: none;
}

.name-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.product-name {
  font-weight: 400;
  color: #333;
  line-height: 1.2;
}

.product-description {
  margin-top: 4px;
  font-size: 12px;
  color: #777;
  line-height: 1.2;
}

.page {
  width: 101.2%;
  height: 100%;
  margin-top: -1rem;
  box-sizing: border-box;
}
.filters-container {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 90%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--font-secondary);
  transition: all 0.3s ease;
  background-color: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 10px 18px;
  border: 2px solid #e0e0e0;
  background-color: #fff;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  font-family: var(--font-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #f39c12;
  background-color: #fff;
  color: #f39c12;
}

.filter-btn.active {
  background-color: #f39c12;
  border-color: #f39c12;
  color: white;
  font-weight: 600;
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
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  margin-bottom: 10px;
}

.header-table {
    background-color: #f39c12;
    color: white;;
}

.header-table th:first-child {
  border-top-left-radius: 20px;
  width: 60px;
}

.header-table th:last-child {
  border-top-right-radius: 20px;
}

.header-table tr {
    height: 35px;
}
.header-table th {
    padding: 12px 15px;
    font-size: 13px;
    font-weight: 300;
    text-align: center;
    margin-left: 1rem;
}

.header-table th:nth-child(2) {
  text-align: left;
}

.actions-cell {
  width: 48px;
  padding: 0 8px;
}

.actions-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 6px;
  border-radius: 6px;
}

.actions-btn:hover {
  background: rgba(0,0,0,0.05);
}

.actions-btn:focus {
  outline: 2px solid rgba(243,156,18,0.25);
}

.badge-qty, .badge-date { 
  display: inline-block;
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  color: #1b1b1b;
  min-width: 34px;
  text-align: center;
}

/* Container do Botão */
.admin-actions-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  width: 100%;
}

.btn-primary {
  width: 100%;
  background-color: transparent;
  color: #f39c12;
  border: 2px solid #f39c12;
  padding: 16px 24px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #f39c12;
  color: white;
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(243, 156, 18, 0.25);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(243, 156, 18, 0.2);
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modal de reposição (menor) */
.modal-sm {
  max-width: 420px;
}

.repo-epi-info {
  margin: 0 0 18px 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}
.repo-epi-info strong {
  color: #333;
}
.repo-epi-sub {
  font-size: 13px;
  color: #888;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.form-group label {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.flex-1 { 
  flex: 1; 
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

textarea.form-input {
  resize: vertical;
}

.actions-cell {
  position: relative; /* O segredo para o dropdown não fugir */
}

.dropdown-menu {
  position: absolute;
  right: 40px; /* Joga o menu para a esquerda dos 3 pontinhos */
  top: 10px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 100;
  min-width: 150px;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f9f9f9;
  color: #f39c12;
}

.dropdown-item.danger:hover {
  background: #ffecec;
  color: #c0392b;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 9999;
  
  /* Estado inicial: escondido para baixo e transparente */
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Animação de "pulo" suave */
}

/* Quando a classe 'show' é ativada, ele sobe */
.toast-notification.show {
  transform: translateY(0);
  opacity: 1;
}

/* Cores de Sucesso e Erro */
.toast-notification.success {
  background-color: #2ecc71; /* Verde */
}

.toast-notification.error {
  background-color: #e74c3c; /* Vermelho */
}

.badge-qty.green { background: #e6f9ea; color: #2d8a40; }
.badge-qty.orange { background: #fff3e0; color: #b96900; }
.badge-qty.red { background: #ffecec; color: #c0392b; }

.badge-date.green { background: #eafaf0; color: #2d8a40; }
.badge-date.orange { background: #fff8ec; color: #b96900; }
.badge-date.red { background: #fff0f0; color: #c0392b; }

</style>
