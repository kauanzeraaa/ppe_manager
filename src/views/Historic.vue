<script>
export default {
  data() {
    return {
      activeTab: 'entregas',
      entregas: [
        { id: 1, equipamento: 'Capacete de Segurança', quantidade: 10, data: '2026-05-01', receptor: 'João Silva' },
        { id: 2, equipamento: 'Luvas de Segurança', quantidade: 20, data: '2026-05-02', receptor: 'Maria Santos' },
        { id: 3, equipamento: 'Óculos de Proteção', quantidade: 15, data: '2026-05-03', receptor: 'Pedro Costa' }
      ],
      devolucoes: [
        { id: 1, equipamento: 'Capacete de Segurança', quantidade: 5, data: '2026-04-28', remetente: 'João Silva', condicao: 'Bom' },
        { id: 2, equipamento: 'Colete Refletor', quantidade: 3, data: '2026-04-29', remetente: 'Ana Oliveira', condicao: 'Desgastado' },
        { id: 3, equipamento: 'Luvas de Segurança', quantidade: 8, data: '2026-04-30', remetente: 'Carlos Mendes', condicao: 'Bom' }
      ],
      solicitacoes: [
        { id: 1, equipamento: 'Botina de Segurança', quantidade: 25, data: '2026-05-05', solicitante: 'Departamento A', status: 'Pendente' },
        { id: 2, equipamento: 'Máscara Respiratória', quantidade: 30, data: '2026-05-04', solicitante: 'Departamento B', status: 'Aprovada' },
        { id: 3, equipamento: 'Arnês de Proteção', quantidade: 10, data: '2026-05-03', solicitante: 'Departamento C', status: 'Concluída' }
      ]
    }
  },
  methods: {
    selectTab(tab) {
      this.activeTab = tab
    }
  }
}
</script>

<template>
    <div class="page">
        <span class="badge">Histórico</span>
        <h1 class="title">Verifique as Movimentações Passadas</h1>
        
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
            <div v-show="activeTab === 'entregas'" class="tab-pane">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Equipamento</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Receptor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in entregas" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.equipamento }}</td>
                    <td>{{ item.quantidade }}</td>
                    <td>{{ item.data }}</td>
                    <td>{{ item.receptor }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-show="activeTab === 'devolucoes'" class="tab-pane">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Equipamento</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Remetente</th>
                    <th>Condição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in devolucoes" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.equipamento }}</td>
                    <td>{{ item.quantidade }}</td>
                    <td>{{ item.data }}</td>
                    <td>{{ item.remetente }}</td>
                    <td>{{ item.condicao }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-show="activeTab === 'solicitacoes'" class="tab-pane">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Equipamento</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Solicitante</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in solicitacoes" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.equipamento }}</td>
                    <td>{{ item.quantidade }}</td>
                    <td>{{ item.data }}</td>
                    <td>{{ item.solicitante }}</td>
                    <td>{{ item.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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

.table th:first-child {
  text-align: center;
  width: 60px;
}

.table td {
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 300;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.table tbody tr:last-child td {
  border-bottom: none;
}
</style>