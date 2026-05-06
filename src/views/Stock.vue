<script></script>

<template>
  <div class="page">
    <span class="badge">Estoque</span>
    <h1 class="title">Equipamentos Cadastrados</h1>
    <table class="table">
        <thead class="header-table">
            <tr>
            <th>ID</th>
            <th>NOME</th>
            <th>CLASSIFICAÇÃO</th>
            <th>TAMANHO</th>
            <th>QUANTIDADE</th>
            <th>VALIDADE</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>Capacete de Segurança</td>
            <td>50</td>
            <td>Armazém A</td>
            </tr>
            <tr>
            <td>Óculos de Proteção</td>
            <td>100</td>
            <td>Armazém B</td>
            </tr>
            <tr>
            <td>Luvas de Segurança</td>
            <td>200</td>
            <td>Armazém C</td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  margin-left: 0.89rem;
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

</style>
