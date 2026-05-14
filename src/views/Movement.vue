<script>
export default {
  data() {
    return {
      formulario: {
        tipoMovimentacao: "",
        equipamento: "",
        quantidade: "",
        responsavel: "",
        receptor: "",
        tipoReceptor: "",
        observacao: "",
        data: new Date().toISOString().slice(0, 16),
      },
      movimentacoes: [
        {
          id: "01",
          equipamento: "Capacete de Segurança",
          tipoMovimentacao: "Entrega",
          quantidade: 10,
          responsavel: "João Silva",
          receptor: "Maria Santos",
          tipoReceptor: "Funcionário",
          observacao: "Entrega conforme solicitado",
          data: "2026-05-10T14:30",
          status: "Entrega",
        },
        {
          id: "02",
          equipamento: "Luvas de Segurança",
          tipoMovimentacao: "Devolução",
          quantidade: 5,
          responsavel: "Carlos Oliveira",
          receptor: "Almoxarifado",
          tipoReceptor: "Setor",
          observacao: "Devolução de EPIs em bom estado",
          data: "2026-05-09T10:15",
          status: "Devolução",
        },
      ],
      equipamentosDisponiveis: [
        "Capacete de Segurança",
        "Óculos de Proteção",
        "Luvas de Segurança",
        "Colete Refletor",
        "Máscara Respiratória",
        "Botina de Segurança",
      ],
    };
  },
  methods: {
    registrarMovimentacao() {
      // Validação básica
      if (
        !this.formulario.tipoMovimentacao ||
        !this.formulario.equipamento ||
        !this.formulario.quantidade ||
        !this.formulario.responsavel ||
        !this.formulario.receptor ||
        !this.formulario.tipoReceptor
      ) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Adicionar nova movimentação à tabela
      const novaMovimentacao = {
        id: String(this.movimentacoes.length + 1).padStart(2, "0"),
        equipamento: this.formulario.equipamento,
        tipoMovimentacao: this.formulario.tipoMovimentacao,
        quantidade: parseInt(this.formulario.quantidade),
        responsavel: this.formulario.responsavel,
        receptor: this.formulario.receptor,
        tipoReceptor: this.formulario.tipoReceptor,
        observacao: this.formulario.observacao,
        data: this.formulario.data,
        status: this.formulario.tipoMovimentacao,
      };

      this.movimentacoes.unshift(novaMovimentacao);
      this.limparFormulario();
    },
    limparFormulario() {
      this.formulario = {
        tipoMovimentacao: "",
        equipamento: "",
        quantidade: "",
        responsavel: "",
        receptor: "",
        tipoReceptor: "",
        observacao: "",
        data: new Date().toISOString().slice(0, 16),
      };
    },
    getStatusBadgeClass(status) {
      return status === "Devolução" ? "green" : "orange";
    },
    formatarData(dataIso) {
      if (!dataIso) return "";
      const [data, hora] = dataIso.split("T");
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano} ${hora}`;
    },
    openActions(movimentacao) {
      console.log("Abrir ações para movimentação", movimentacao.id);
    },
  },
};
</script>

<template>
  <div class="page">
    <span class="badge">Movimentações</span>
    <h1 class="title">Movimentações de Estoque</h1>

    <!-- FORMULÁRIO -->
    <div class="form-container">
      <h2 class="form-title">Registrar Movimentação</h2>
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
              v-model="formulario.equipamento"
              class="form-input"
              required
            >
              <option value="">Selecione...</option>
              <option
                v-for="item in equipamentosDisponiveis"
                :key="item"
                :value="item"
              >
                {{ item }}
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
              v-model="formulario.responsavel"
              class="form-input"
              placeholder="Nome completo"
              required
            />
          </div>
          <div class="form-group">
            <label for="receptor">Receptor</label>
            <input
              type="text"
              id="receptor"
              v-model="formulario.receptor"
              class="form-input"
              placeholder="Nome ou setor"
              required
            />
          </div>
          <div class="form-group">
            <label for="tipoReceptor">Tipo do Receptor</label>
            <select
              id="tipoReceptor"
              v-model="formulario.tipoReceptor"
              class="form-input"
              required
            >
              <option value="">Selecione...</option>
              <option value="Funcionário">Funcionário</option>
              <option value="Setor">Setor</option>
              <option value="Terceiro">Terceiro</option>
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

    <!-- TABELA DE MOVIMENTAÇÕES -->
    <div class="table-container">
      <h2 class="table-title">Histórico de Movimentações</h2>
      <table class="table">
        <thead class="header-table">
          <tr>
            <th>ID</th>
            <th>EQUIPAMENTO</th>
            <th>TIPO DE MOVIMENTAÇÃO</th>
            <th>QUANTIDADE</th>
            <th>RESPONSÁVEL</th>
            <th>RECEPTOR</th>
            <th>TIPO DO RECEPTOR</th>
            <th>OBSERVAÇÃO</th>
            <th>DATA</th>
            <th>STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="content-table">
          <tr v-for="mov in movimentacoes" :key="mov.id">
            <td>{{ mov.id }}</td>
            <td class="equipment-cell">{{ mov.equipamento }}</td>
            <td>{{ mov.tipoMovimentacao }}</td>
            <td class="center">{{ mov.quantidade }}</td>
            <td>{{ mov.responsavel }}</td>
            <td>{{ mov.receptor }}</td>
            <td>{{ mov.tipoReceptor }}</td>
            <td class="observation-cell">{{ mov.observacao || "-" }}</td>
            <td class="center">{{ formatarData(mov.data) }}</td>
            <td>
              <span :class="['badge-status', getStatusBadgeClass(mov.status)]">
                {{ mov.status }}
              </span>
            </td>
            <td class="actions-cell">
              <button
                class="actions-btn"
                @click="openActions(mov)"
                aria-label="Ações"
              >
                ⋮
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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

/* FORMULÁRIO */
.form-container {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 1px 20px;
  margin-bottom: 40px;
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
  margin-bottom: 20px;
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

/* TABELA */
.table-container {
  margin-top: 40px;
}

.table-title {
  font-size: 1.4rem;
  font-weight: 500;
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
  overflow: hidden;
}

.header-table {
  background-color: #f39c12;
  color: white;
}

.header-table th:first-child {
  border-top-left-radius: 20px;
  width: 50px;
}

.header-table th:last-child {
  border-top-right-radius: 20px;
}

.header-table tr {
  height: 35px;
}

.header-table th {
  padding: 12px 15px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-table th:nth-child(2),
.header-table th:nth-child(5),
.header-table th:nth-child(6),
.header-table th:nth-child(8) {
  text-align: left;
}

.content-table tr {
  height: 45px;
  background-image: linear-gradient(
    to right,
    transparent 0%,
    #e0e0e0 3%,
    #e0e0e0 98%,
    transparent 0%
  );
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 100% 1px;
  transition: background-color 0.2s ease;
}

.content-table tr:hover {
  background-color: #f9f9f9;
}

.content-table td {
  padding: 12px 15px;
  font-size: 13px;
  font-weight: 400;
  color: #333;
  text-align: center;
}

.content-table td.equipment-cell,
.content-table td.observation-cell {
  text-align: left;
}

.content-table tr:last-child td {
  border-bottom: none;
}

.center {
  text-align: center;
}

.observation-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  min-width: 80px;
}

.badge-status.green {
  background-color: #e6f9ea;
  color: #2d8a40;
}

.badge-status.orange {
  background-color: #fff3e0;
  color: #b96900;
}

.actions-cell {
  width: 48px;
  padding: 0 8px;
  text-align: center;
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
  transition: all 0.2s ease;
}

.actions-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.actions-btn:focus {
  outline: 2px solid rgba(243, 156, 18, 0.25);
}

/* RESPONSIVIDADE */
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

  .table {
    font-size: 12px;
  }

  .content-table td {
    padding: 10px 8px;
  }

  .header-table th {
    padding: 10px 8px;
  }
}
</style>
