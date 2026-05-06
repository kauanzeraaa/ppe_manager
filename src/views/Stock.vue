<script>
export default {
  data() {
    return {
      equipamentos: [
        { id: '01', nome: "Capacete de Segurança", descricao: "Proteção para impacto e queda de objetos.", classificacao: "Reutilizável", tamanho: "M", quantidade: 50, validade: "2027-05-15" },
        { id: '02', nome: "Óculos de Proteção", descricao: "Evita danos aos olhos durante o uso diário.", classificacao: "Reutilizável", tamanho: "Único", quantidade: 100, validade: "2026-12-31" },
        { id: '03', nome: "Luvas de Segurança", descricao: "Indicado para proteção das mãos em serviço.", classificacao: "Descartável", tamanho: "G", quantidade: 200, validade: "2026-08-20" },
        { id: '04', nome: "Colete Refletor", descricao: "Aumenta a visibilidade em ambientes operacionais.", classificacao: "Reutilizável", tamanho: "M", quantidade: 30, validade: "2028-03-10" },
        { id: '05', nome: "Máscara Respiratória", descricao: "Reduz a exposição a partículas e poeira.", classificacao: "Descartável", tamanho: "Único", quantidade: 10, validade: "2026-04-30" },
        { id: '06', nome: "Botina de Segurança", descricao: "Proteção reforçada para os pés no trabalho.", classificacao: "Reutilizável", tamanho: "42", quantidade: 40, validade: "2027-11-15" },
        { id: '07', nome: "Protetor Auricular", descricao: "Auxilia na redução da exposição a ruídos.", classificacao: "Descartável", tamanho: "Único", quantidade: 120, validade: "2026-05-25" },
        { id: '08', nome: "Avental Antichama", descricao: "Proteção adicional contra calor e fagulhas.", classificacao: "Reutilizável", tamanho: "G", quantidade: 25, validade: "2027-07-18" },
        { id: '09', nome: "Cinto de Segurança", descricao: "Indicado para trabalho em altura com retenção.", classificacao: "Reutilizável", tamanho: "P", quantidade: 9, validade: "2028-01-30" },
        { id: '10', nome: "Arnês de Proteção", descricao: "Oferece suporte e segurança em atividades elevadas.", classificacao: "Reutilizável", tamanho: "M", quantidade: 20, validade: "2027-09-12" }
      ]
    }
  }
  ,
  methods: {
    openActions(equipamento) {
      console.log('Abrir ações para', equipamento.id)
    },
    qtyBadgeClass(qty) {
      if (qty <= 10) return 'red';
      if (qty <= 50) return 'orange';
      return 'green';
    },
    dateBadgeClass(dateStr) {
      if (!dateStr) return 'green';
      const parts = dateStr.split('-');
      const d = new Date(parts[0], Number(parts[1]) - 1, parts[2]);
      const today = new Date();
      // normalize to midnight
      const diff = Math.ceil((d - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24));
      if (diff < 0) return 'red';
      if (diff <= 30) return 'orange';
      return 'green';
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
}
</script>

<template>
  <div class="page">
    <span class="badge">Estoque</span>
    <h1 class="title">Equipamentos Cadastrados</h1>
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
            <tr v-for="equipamento in equipamentos" :key="equipamento.id">
            <td>{{ equipamento.id }}</td>
            <td class="name-cell">
              <div class="product-name">{{ equipamento.nome }}</div>
              <div class="product-description">{{ equipamento.descricao }}</div>
            </td>
            <td>{{ equipamento.classificacao }}</td>
            <td>{{ equipamento.tamanho }}</td>
            <td>
              <span :class="['badge-qty', qtyBadgeClass(equipamento.quantidade)]">{{ equipamento.quantidade }}</span>
            </td>
            <td>
              <span :class="['badge-date', dateBadgeClass(equipamento.validade)]">{{ formatDate(equipamento.validade) }}</span>
            </td>
            <td class="actions-cell">
              <button class="actions-btn" @click="openActions(equipamento)" aria-label="Ações">⋮</button>
            </td>
            </tr>
        </tbody>
    </table>
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

.badge-qty.green { background: #e6f9ea; color: #2d8a40; }
.badge-qty.orange { background: #fff3e0; color: #b96900; }
.badge-qty.red { background: #ffecec; color: #c0392b; }

.badge-date.green { background: #eafaf0; color: #2d8a40; }
.badge-date.orange { background: #fff8ec; color: #b96900; }
.badge-date.red { background: #fff0f0; color: #c0392b; }

</style>
