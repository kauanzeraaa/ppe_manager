<script>
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// O receptor é polimórfico: o nome vive em aluno/funcionario/visitante conforme o tipo_receptor.
const TABELAS_RECEPTOR = {
  'Funcionário': 'funcionario',
  'Aluno': 'aluno',
  'Visitante': 'visitante'
}

export default {
  data() {
    return {
      activeTab: 'entregas',
      loading: true,
      error: null,
      userRole: null, // 'Administrador' ou 'Operador'
      entregas: [],
      devolucoes: [],
      solicitacoes: [],
      toast: {
        show: false,
        message: '',
        type: 'success' // 'success' ou 'error'
      }
    }
  },

  computed: {
    isAdmin() {
      return this.userRole === 'Administrador'
    }
  },

  async mounted() {
    await this.fetchUserRole()
    await this.carregarHistorico()
  },

  methods: {
    // descobre se o usuário logado é Administrador ou Operador
    async fetchUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('usuario')
            .select('funcao')
            .eq('id', user.id)
            .maybeSingle()

          if (data) this.userRole = data.funcao
        }
      } catch (err) {
        console.error("Erro ao buscar a função do usuário:", err)
      }
    },

    // Carrega movimentações e solicitações, resolvendo os relacionamentos no cliente
    async carregarHistorico() {
      this.loading = true
      this.error = null
      try {
        const [movRes, solRes, epiRes, usuarioRes, alunoRes, funcRes, visitRes] = await Promise.all([
          supabase.from('movimentacao').select('*').order('create_at', { ascending: false }),
          supabase.from('solicitacao').select('*').order('create_at', { ascending: false }),
          supabase.from('epi').select('id, nome'),
          supabase.from('usuario').select('id, nome'),
          supabase.from('aluno').select('id, nome'),
          supabase.from('funcionario').select('id, nome'),
          supabase.from('visitante').select('id, nome')
        ])

        const erro = movRes.error || solRes.error || epiRes.error || usuarioRes.error ||
                     alunoRes.error || funcRes.error || visitRes.error
        if (erro) throw erro

        // Índices por id para o "join" no cliente
        const epiPorId = new Map((epiRes.data || []).map(e => [e.id, e]))
        const usuarioPorId = new Map((usuarioRes.data || []).map(u => [u.id, u]))
        const receptorPorTabela = {
          aluno: new Map((alunoRes.data || []).map(r => [r.id, r])),
          funcionario: new Map((funcRes.data || []).map(r => [r.id, r])),
          visitante: new Map((visitRes.data || []).map(r => [r.id, r]))
        }

        const nomeReceptor = (m) => {
          const tabela = TABELAS_RECEPTOR[m.tipo_receptor]
          const receptor = (tabela && receptorPorTabela[tabela].get(m.id_receptor)) || {}
          return receptor.nome || 'Não identificado'
        }

        const movimentacoes = movRes.data || []

        // Entregas e Devoluções saem da mesma tabela (separadas pelo tipo_movimentacao)
        this.entregas = movimentacoes
          .filter(m => m.tipo_movimentacao === 'Entrega')
          .map(m => ({
            id: m.id,
            equipamento: epiPorId.get(m.id_equipamento)?.nome || 'EPI Excluído',
            quantidade: m.quantidade,
            data: m.create_at,
            receptor: nomeReceptor(m)
          }))

        this.devolucoes = movimentacoes
          .filter(m => m.tipo_movimentacao === 'Devolução')
          .map(m => ({
            id: m.id,
            equipamento: epiPorId.get(m.id_equipamento)?.nome || 'EPI Excluído',
            quantidade: m.quantidade,
            data: m.create_at,
            remetente: nomeReceptor(m),
            observacao: m.observacao || '—'
          }))

        this.solicitacoes = (solRes.data || []).map(s => ({
          id: s.id,
          equipamento: epiPorId.get(s.id_equipamento)?.nome || 'EPI Excluído',
          quantidade: s.quantidade_solicitada,
          data: s.create_at,
          solicitante: usuarioPorId.get(s.id_usuario)?.nome || 'Não informado',
          status: s.status
        }))
      } catch (err) {
        console.error("Erro ao carregar histórico:", err)
        this.error = 'Erro ao carregar os dados. Verifique a conexão com o banco.'
      } finally {
        this.loading = false
      }
    },

    // Administrador aprova uma solicitação de reposição (apenas muda o status)
    async aceitarSolicitacao(item) {
      try {
        const { error } = await supabase
          .from('solicitacao')
          .update({ status: 'Aprovado', update_at: new Date().toISOString() })
          .eq('id', item.id)

        if (error) throw error

        item.status = 'Aprovado' // atualiza a tela sem recarregar tudo
        this.showToast('Solicitação aprovada com sucesso!', 'success')
      } catch (err) {
        console.error("Erro ao aprovar solicitação:", err)
        this.showToast('Não foi possível aprovar a solicitação.', 'error')
      }
    },

    selectTab(tab) {
      this.activeTab = tab
    },

    statusClass(status) {
      if (status === 'Aprovado') return 'aprovado'
      if (status === 'Reprovado') return 'reprovado'
      return 'pendente'
    },

    formatarData(dataStr) {
      if (!dataStr) return '--/--/----'
      const data = new Date(dataStr)
      if (isNaN(data)) return '--/--/----'
      return data.toLocaleDateString('pt-BR')
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type }
      setTimeout(() => { this.toast.show = false }, 4000)
    }
  }
}
</script>

<template>
    <div class="page">
        <span class="badge">Histórico</span>
        <h1 class="title">Verifique as Movimentações Passadas</h1>

        <div class="error-banner" v-if="error">{{ error }}</div>

        <div class="tabs-container">
          <div class="tabs-header">
            <button
              :class="['tab-button', { active: activeTab === 'entregas' }]"
              @click="selectTab('entregas')">
              Entregas
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'devolucoes' }]"
              @click="selectTab('devolucoes')">
              Devoluções
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'solicitacoes' }]"
              @click="selectTab('solicitacoes')">
              Solicitações
            </button>
          </div>

          <div class="tabs-content">
            <div v-if="loading" class="state-message">Carregando histórico...</div>

            <template v-else>
              <!-- ENTREGAS -->
              <div v-show="activeTab === 'entregas'" class="tab-pane">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Equipamento</th>
                      <th>Quantidade</th>
                      <th>Data</th>
                      <th>Receptor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in entregas" :key="item.id">
                      <td>{{ item.equipamento }}</td>
                      <td>{{ item.quantidade }}</td>
                      <td>{{ formatarData(item.data) }}</td>
                      <td>{{ item.receptor }}</td>
                    </tr>
                    <tr v-if="entregas.length === 0">
                      <td colspan="4" class="empty-state">Nenhuma entrega registrada.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- DEVOLUÇÕES -->
              <div v-show="activeTab === 'devolucoes'" class="tab-pane">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Equipamento</th>
                      <th>Quantidade</th>
                      <th>Data</th>
                      <th>Remetente</th>
                      <th>Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in devolucoes" :key="item.id">
                      <td>{{ item.equipamento }}</td>
                      <td>{{ item.quantidade }}</td>
                      <td>{{ formatarData(item.data) }}</td>
                      <td>{{ item.remetente }}</td>
                      <td>{{ item.observacao }}</td>
                    </tr>
                    <tr v-if="devolucoes.length === 0">
                      <td colspan="5" class="empty-state">Nenhuma devolução registrada.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- SOLICITAÇÕES -->
              <div v-show="activeTab === 'solicitacoes'" class="tab-pane">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Equipamento</th>
                      <th>Quantidade</th>
                      <th>Data</th>
                      <th>Solicitante</th>
                      <th>Status</th>
                      <th v-if="isAdmin">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in solicitacoes" :key="item.id">
                      <td>{{ item.equipamento }}</td>
                      <td>{{ item.quantidade }}</td>
                      <td>{{ formatarData(item.data) }}</td>
                      <td>{{ item.solicitante }}</td>
                      <td>
                        <span class="status-badge" :class="statusClass(item.status)">
                          {{ item.status }}
                        </span>
                      </td>
                      <td v-if="isAdmin">
                        <button
                          v-if="item.status === 'Pendente'"
                          class="btn-aceitar"
                          @click="aceitarSolicitacao(item)">
                          Aceitar
                        </button>
                        <span v-else class="text-muted">—</span>
                      </td>
                    </tr>
                    <tr v-if="solicitacoes.length === 0">
                      <td :colspan="isAdmin ? 6 : 5" class="empty-state">Nenhuma solicitação registrada.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>

        <!-- Toast de feedback -->
        <div v-if="toast.show" class="toast" :class="toast.type">
          {{ toast.message }}
        </div>
    </div>
</template>

<style scoped>
.page {
  width: 101.2%;
  height: 100%;
  margin-top: -1rem;
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

.error-banner {
  background: #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 16px;
}

.tabs-container {
  margin-top: 30px;
}

.tabs-header {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 0;
}

.tab-button {
  background: transparent;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #f39c12;
}

.tab-button.active {
  color: #f39c12;
  border-bottom-color: #f39c12;
}

.tabs-content {
  padding: 20px 0;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

.state-message {
  text-align: center;
  color: #64748b;
  padding: 40px;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.table thead {
  background-color: #f39c12;
  color: white;
}

.table th {
  padding: 12px 15px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.table td {
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 300;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  color: #444;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 30px !important;
}

/* Badges de status das solicitações */
.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  display: inline-block;
  min-width: 80px;
}
.status-badge.pendente { background-color: #FCF3CF; color: #D68910; }
.status-badge.aprovado { background-color: #D5F5E3; color: #27AE60; }
.status-badge.reprovado { background-color: #FADBD8; color: #C0392B; }

/* Botão Aceitar (somente Administrador) */
.btn-aceitar {
  background-color: #27AE60;
  color: white;
  border: none;
  padding: 7px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-aceitar:hover {
  background-color: #1E8449;
}

.text-muted { color: #aaa; }

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 22px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}
.toast.success { background-color: #27AE60; }
.toast.error { background-color: #C0392B; }
</style>
