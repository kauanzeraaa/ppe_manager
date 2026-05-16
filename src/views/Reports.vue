<script setup>
import { ref, computed } from 'vue'
import BarChart from '../components/BarChart.vue'
import ReportCard from '../components/ReportCard.vue'

// Dados de exemplo para gráficos
const distributionLabels = ['Capacete', 'Luva', 'Máscara', 'Colete', 'Bota', 'Óculos']
const distributionData = [45, 32, 58, 28, 41, 19]

const complianceLabels = ['Conforme', 'Não Conforme', 'Expirado', 'Pendente']
const complianceData = [78, 12, 5, 5]

const movementLabels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho']
const movementConsumption = [15, 22, 18, 25, 31, 28]
const movementReplenishment = [20, 15, 20, 18, 22, 25]

const stockLabels = ['Capacete', 'Luva', 'Máscara', 'Colete', 'Bota', 'Óculos']
const stockAvailable = [120, 250, 380, 95, 160, 85]
const stockCritical = [20, 50, 100, 30, 50, 25]

// Computadas para formatação de dados
const distributionChartData = computed(() => [
  {
    label: 'Quantidade de EPIs',
    data: distributionData,
    backgroundColor: '#f39c12'
  }
])

const complianceChartData = computed(() => [
  {
    label: 'Status de Conformidade',
    data: complianceData,
    backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6']
  }
])

const movementChartData = computed(() => [
  {
    label: 'Consumo',
    data: movementConsumption,
    backgroundColor: '#e74c3c'
  },
  {
    label: 'Reabastecimento',
    data: movementReplenishment,
    backgroundColor: '#27ae60'
  }
])

const stockChartData = computed(() => [
  {
    label: 'Disponível',
    data: stockAvailable,
    backgroundColor: '#27ae60'
  },
  {
    label: 'Nível Crítico',
    data: stockCritical,
    backgroundColor: '#e74c3c'
  }
])

// Métricas para cards
const totalEPIs = computed(() => distributionData.reduce((a, b) => a + b, 0))
const conformanceRate = computed(() => '92%')
const criticalItems = computed(() => stockCritical.filter((v, i) => stockAvailable[i] <= v).length)
const monthlyConsumption = computed(() => movementConsumption[movementConsumption.length - 1])

// Filtros
const selectedPeriod = ref('6months')
const periods = [
  { value: '1month', label: 'Último mês' },
  { value: '3months', label: 'Últimos 3 meses' },
  { value: '6months', label: 'Últimos 6 meses' },
  { value: '1year', label: 'Último ano' }
]
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <span class="badge">Relatórios</span>
        <h1 class="title">Relatórios e Conformidade de EPIs</h1>
      </div>
      
      <div class="filters">
        <select v-model="selectedPeriod" class="period-select">
          <option v-for="period in periods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Cards de Métricas Principais -->
    <div class="metrics-grid">
      <ReportCard
        title="Total de EPIs"
        subtitle="Em estoque"
        :value="totalEPIs"
        icon="📦"
        backgroundColor="#f39c12"
        trend="up"
        trend-value="+12% vs mês anterior"
      />
      
      <ReportCard
        title="Taxa de Conformidade"
        subtitle="Itens conformes"
        :value="conformanceRate"
        icon="✓"
        backgroundColor="#27ae60"
        trend="up"
        trend-value="+5% vs período anterior"
      />
      
      <ReportCard
        title="Itens Críticos"
        subtitle="Nível de estoque baixo"
        :value="criticalItems"
        icon="⚠️"
        backgroundColor="#e74c3c"
        :trend="criticalItems > 0 ? 'down' : 'stable'"
        :trend-value="criticalItems > 0 ? criticalItems + ' itens' : 'Estável'"
      />
      
      <ReportCard
        title="Consumo Mensal"
        subtitle="Movimentação média"
        :value="monthlyConsumption"
        icon="📊"
        backgroundColor="#3498db"
        trend="stable"
        trend-value="Consistente"
      />
    </div>

    <!-- Gráficos -->
    <div class="charts-section">
      <div class="chart-row">
        <div class="chart-item full-width">
          <BarChart
            title="Distribuição de EPIs por Tipo"
            :labels="distributionLabels"
            :datasets="distributionChartData"
            height="350"
            backgroundColor="#f39c12"
          />
        </div>
      </div>

      <div class="chart-row">
        <div class="chart-item">
          <BarChart
            title="Status de Conformidade"
            :labels="complianceLabels"
            :datasets="complianceChartData"
            height="300"
            backgroundColor="#27ae60"
          />
        </div>
        
        <div class="chart-item">
          <BarChart
            title="Movimentação de Estoque"
            :labels="movementLabels"
            :datasets="movementChartData"
            height="300"
            backgroundColor="#e74c3c"
          />
        </div>
      </div>

      <div class="chart-row">
        <div class="chart-item full-width">
          <BarChart
            title="Análise de Estoque: Disponível vs Nível Crítico"
            :labels="stockLabels"
            :datasets="stockChartData"
            height="350"
            backgroundColor="#27ae60"
          />
        </div>
      </div>
    </div>

    <!-- Tabela de Resumo -->
    <div class="summary-section">
      <h2 class="summary-title">Resumo de Conformidade por Tipo</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Tipo de EPI</th>
            <th>Total</th>
            <th>Conforme</th>
            <th>Taxa %</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(label, index) in distributionLabels" :key="index">
            <td>{{ label }}</td>
            <td>{{ distributionData[index] }}</td>
            <td>{{ Math.round(distributionData[index] * 0.92) }}</td>
            <td><span class="percentage">92%</span></td>
            <td><span class="status status-ok">✓ Conforme</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 101.2%;
  margin-top: -1rem;
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.badge {
  display: inline-block;
  background: #f39d125c;
  color: #f39c12;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.title {
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin: 0;
  font-family: var(--font-primary);
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
}

.period-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: var(--font-primary);
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.period-select:hover {
  border-color: #f39c12;
}

.period-select:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.1);
}

/* Grid de Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* Seção de Gráficos */
.charts-section {
  margin-bottom: 40px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-item {
  min-width: 0;
}

.chart-item.full-width {
  grid-column: 1 / -1;
}

/* Seção de Resumo */
.summary-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f5f5f5;
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  font-family: var(--font-primary);
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-primary);
}

.summary-table thead {
  background: #f9f9f9;
  border-bottom: 2px solid #f39c12;
}

.summary-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.summary-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.summary-table tbody tr:hover {
  background-color: #f9f9f9;
}

.percentage {
  font-weight: 600;
  color: #27ae60;
}

.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-ok {
  background: #d5f4e6;
  color: #27ae60;
}

/* Responsivo */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    grid-template-columns: 1fr;
  }

  .chart-item.full-width {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }

  .summary-table {
    font-size: 0.85rem;
  }

  .summary-table th,
  .summary-table td {
    padding: 8px;
  }
}
</style>