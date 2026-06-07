<script>
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default {
  data() {
    return {
      formulario: {
        tipoMovimentacao: "",
        equipamentoId: "",
        quantidade: "",
        tipoReceptor: "",
        receptorId: "",
        observacao: "",
        data: new Date().toISOString().slice(0, 16),
      },
      equipamentosDisponiveis: [],
      receptoresDisponiveis: [],
      userId: null,
      userName: "",
      loading: false,
      toast: {
        show: false,
        message: "",
        type: "success", // 'success' ou 'error'
      },
    };
  },

  async mounted() {
    await this.fetchUsuarioLogado();
    await this.loadEpiDisponiveis();
  },

  methods: {
    // descobre quem é o usuário logado
    async fetchUsuarioLogado() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          this.userId = user.id;

          const { data } = await supabase
            .from("usuario")
            .select("nome")
            .eq("id", user.id)
            .maybeSingle();

          if (data) {
            this.userName = data.nome;
          }
        }
      } catch (err) {
        console.error("Erro ao buscar usuário logado:", err);
      }
    },

    // carrega EPIs usando a View
    async loadEpiDisponiveis() {
      try {
        const { data, error } = await supabase
          .from("view_estoque_epi")
          .select("id, nome, quantidade_atual")
          .order("nome", { ascending: true });

        if (error) throw error;
        this.equipamentosDisponiveis = data || [];
      } catch (err) {
        console.error("Erro ao carregar EPIs:", err);
        this.showToast("Erro ao carregar a lista de equipamentos.", "error");
      }
    },

    // busca os nomes baseados no tipo escolhido
    async buscarReceptores() {
      // limpa a seleção anterior
      this.formulario.receptorId = "";
      this.receptoresDisponiveis = [];

      if (!this.formulario.tipoReceptor) return;

      // descobre em qual tabela procurar
      let tabela = "";
      if (this.formulario.tipoReceptor === "Aluno") tabela = "aluno";
      else if (this.formulario.tipoReceptor === "Funcionário")
        tabela = "funcionario";
      else if (this.formulario.tipoReceptor === "Visitante")
        tabela = "visitante";

      try {
        const { data, error } = await supabase
          .from(tabela)
          .select("id, nome")
          .order("nome", { ascending: true });

        if (error) throw error;
        this.receptoresDisponiveis = data || [];
      } catch (err) {
        console.error(`Erro ao buscar ${tabela}:`, err);
        this.showToast(
          `Erro ao carregar a lista de ${this.formulario.tipoReceptor}s.`,
          "error",
        );
      }
    },

    // registra a Movimentação e abate o estoque
    async registrarMovimentacao() {
      if (
        !this.formulario.tipoMovimentacao ||
        !this.formulario.equipamentoId ||
        !this.formulario.quantidade ||
        !this.formulario.tipoReceptor ||
        !this.formulario.receptorId
      ) {
        this.showToast(
          "Por favor, preencha todos os campos obrigatórios",
          "error",
        );
        return;
      }

      const qtdMovimentada = parseInt(this.formulario.quantidade);
      const epiSelecionado = this.equipamentosDisponiveis.find(
        (e) => e.id === this.formulario.equipamentoId,
      );

      if (!epiSelecionado) return;

      try {
        this.loading = true;

        // impedir saída de estoque que não existe (ENTREGA)
        if (
          this.formulario.tipoMovimentacao === "Entrega" &&
          epiSelecionado.quantidade_atual < qtdMovimentada
        ) {
          this.showToast(
            `Saldo insuficiente no almoxarifado! O estoque atual deste EPI é de apenas ${epiSelecionado.quantidade_atual} unidades.`,
            "error",
          );
          return;
        }

        // (DEVOLUÇÃO)
        if (this.formulario.tipoMovimentacao === "Devolução") {
          // Busca todo o histórico de movimentações desse receptor para esse EPI específico
          const { data: historico, error: errorHist } = await supabase
            .from("movimentacao")
            .select("tipo_movimentacao, quantidade")
            .eq("id_equipamento", this.formulario.equipamentoId)
            .eq("id_receptor", this.formulario.receptorId);

          if (errorHist) throw errorHist;

          // calcula o saldo real que a pessoa tem em posse dela atualmente
          let saldoPessoa = 0;
          if (historico) {
            historico.forEach((mov) => {
              if (mov.tipo_movimentacao === "Entrega") {
                saldoPessoa += mov.quantidade; // o que ela pegou
              } else if (mov.tipo_movimentacao === "Devolução") {
                saldoPessoa -= mov.quantidade; // p que ela já devolveu antes
              }
            });
          }

          // se a pessoa está tentando devolver mais do que ela tem em mãos
          if (qtdMovimentada > saldoPessoa) {
            this.showToast(
              `Operação cancelada! Este receptor possui ${saldoPessoa} unidade(s) deste EPI em posse dele. Não é possível devolver ${qtdMovimentada}.`,
              "error",
            );
            return;
          }
        }

        // salvar a movimentação
        const { error: errorMov } = await supabase.from("movimentacao").insert({
          id_equipamento: this.formulario.equipamentoId,
          id_usuario: this.userId,
          tipo_movimentacao: this.formulario.tipoMovimentacao,
          quantidade: qtdMovimentada,
          tipo_receptor: this.formulario.tipoReceptor,
          id_receptor: this.formulario.receptorId,
          observacao: this.formulario.observacao || "Sem observação",
          create_at: new Date(this.formulario.data).toISOString(),
          update_at: new Date().toISOString(),
        });

        if (errorMov) throw errorMov;

        // atualizar a tabela estoque
        let novaQuantidade = epiSelecionado.quantidade_atual;
        if (this.formulario.tipoMovimentacao === "Entrega") {
          novaQuantidade -= qtdMovimentada;
        } else {
          novaQuantidade += qtdMovimentada;
        }

        const { error: errorEstoque } = await supabase
          .from("estoque")
          .update({ quantidade_atual: novaQuantidade })
          .eq("id_equipamento", this.formulario.equipamentoId);

        if (errorEstoque) throw errorEstoque;

        this.showToast(
          "Movimentação registrada e estoque atualizado com sucesso!",
          "success",
        );

        this.limparFormulario();
        await this.loadEpiDisponiveis();
      } catch (error) {
        console.error("Erro na operação:", error);
        this.showToast(
          "Erro ao salvar os dados. Verifique o console.",
          "error",
        );
      } finally {
        this.loading = false;
      }
    },

    // função para limpar o forms
    limparFormulario() {
      this.formulario = {
        tipoMovimentacao: "",
        equipamentoId: "",
        quantidade: "",
        receptor: "",
        tipoReceptor: "",
        observacao: "",
        data: new Date().toISOString().slice(0, 16),
      };
      this.receptoresDisponiveis = [];
    },

    // apresenta mensagem bonitinha na tela
    showToast(message, type = "success") {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;

      // esconde automaticamente após 3 segundos
      setTimeout(() => {
        this.toast.show = false;
      }, 5000);
    },
  },
};
</script>

<template>
  <div class="page">
    <div class="page-header">
      <span class="badge">Movimentação</span>
      <h1 class="title">Movimentações de EPIs</h1>  
      <p class="subtitle">
        Registre as entregas e devoluções de EPIs para manter o controle do estoque atualizado.
      </p>
    </div>

    <div class="form-container">
      <form @submit.prevent="registrarMovimentacao" class="form">
        <div class="form-row">
          <div class="form-group">
            <label for="tipoMovimentacao">Tipo de Movimentação</label>
            <select
              id="tipoMovimentacao"
              v-model="formulario.tipoMovimentacao"
              class="form-input"
              required
            >
              <option value="">Selecione...</option>
              <option value="Entrega">Entrega</option>
              <option value="Devolução">Devolução</option>
            </select>
          </div>
          <div class="form-group">
            <label for="equipamento">Equipamento</label>
            <select
              id="equipamento"
              v-model="formulario.equipamentoId"
              class="form-input"
              required
            >
              <option value="">Selecione...</option>
              <option
                v-for="item in equipamentosDisponiveis"
                :key="item.id"
                :value="item.id"
              >
                {{ item.nome }} (Estoque: {{ item.quantidade_atual }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="quantidade">Quantidade</label>
            <input
              type="number"
              id="quantidade"
              v-model="formulario.quantidade"
              class="form-input"
              min="1"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="responsavel">Responsável pela Movimentação</label>
            <input
              type="text"
              id="responsavel"
              :value="userName || 'Carregando usuário...'"
              class="form-input"
              disabled
              style="background-color: #f5f5f5; cursor: not-allowed"
            />
          </div>

          <div class="form-group">
            <label for="tipoReceptor">Tipo do Receptor</label>
            <select
              id="tipoReceptor"
              v-model="formulario.tipoReceptor"
              @change="buscarReceptores"
              class="form-input"
              required
            >
              <option value="">Selecione...</option>
              <option value="Aluno">Aluno</option>
              <option value="Funcionário">Funcionário</option>
              <option value="Visitante">Visitante</option>
            </select>
          </div>

          <div class="form-group">
            <label for="receptor">Nome do Receptor</label>
            <select
              id="receptor"
              v-model="formulario.receptorId"
              class="form-input"
              :disabled="receptoresDisponiveis.length === 0"
              required
            >
              <option value="">
                {{
                  formulario.tipoReceptor
                    ? "Selecione o nome..."
                    : "Escolha o tipo primeiro"
                }}
              </option>
              <option
                v-for="pessoa in receptoresDisponiveis"
                :key="pessoa.id"
                :value="pessoa.id"
              >
                {{ pessoa.nome }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="observacao">Observação</label>
            <textarea
              id="observacao"
              v-model="formulario.observacao"
              class="form-input textarea"
              placeholder="Adicione observações sobre a movimentação (opcional)"
              rows="1"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="data">Data e Hora da Movimentação</label>
            <input
              type="datetime-local"
              id="data"
              v-model="formulario.data"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-buttons">
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              Registrar Movimentação
            </button>
            <button
              type="button"
              @click="limparFormulario"
              class="btn-secondary"
            >
              Limpar
            </button>
          </div>
        </div>
      </form>
    </div>

    <div :class="['toast-notification', toast.type, { show: toast.show }]">
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}

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
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin: 0;
  font-family: var(--font-primary);
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
}

/* Form */
.form-container {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 25px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 1.4rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  font-family: var(--font-primary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #2b4a69;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.textarea {
  padding: 8px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 12px;
  font-family: var(--font-secondary);
  transition: all 0.3s ease;
  background-color: #fff;
  color: #333;
}

.form-input:focus,
.textarea:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

.form-input::placeholder,
.textarea::placeholder {
  color: #999;
}

.textarea {
  resize: vertical;
  line-height: 1.2;
  height: auto;
  min-height: 32px;
  font-family: var(--font-secondary);
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
}

.form-actions {
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;
}

.btn-primary,
.btn-secondary {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background-color: #f39c12;
  color: white;
  flex: 1;
  padding: 10px 30px;
}

.btn-primary:hover {
  background-color: #e68900;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  flex: 1;
  border: 2px solid #e0e0e0;
  min-width: 100px;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
  border-color: #d0d0d0;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 9999;

  transform: translateY(100px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-notification.show {
  transform: translateY(0);
  opacity: 1;
}

.toast-notification.success {
  background-color: #2ecc71; /* Verde */
}

.toast-notification.error {
  background-color: #e74c3c; /* Vermelho */
}

/* responsividade */
@media (max-width: 1024px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-buttons {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
    font-size: 13px;
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
