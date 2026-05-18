<script setup>
import { computed, ref } from 'vue'
import BarChart from '../components/BarChart.vue'
import ReportCard from '../components/ReportCard.vue'
import {
  chartPalette,
  epiLabels,
  distributionData,
  caStatusLabels,
  caStatusData,
  movementLabels,
  movementConsumption,
  movementReplenishment,
  stockAvailable,
  stockCritical
} from '../data/reportData'
import { useReportPdf } from '../composables/useReportPdf'

const { reportContentRef, isGeneratingPdf, generateReportPdf } = useReportPdf()
const selectedPeriod = ref('month')
const selectedMovementType = ref('all')
const employeeFilter = ref('')
const epiFilter = ref('')
const sectorFilter = ref('')

const totalEPIs = computed(() => distributionData.reduce((a, b) => a + b, 0))
const emUso = computed(() => movementConsumption.reduce((a, b) => a + b, 0))
const disponiveis = computed(() => stockAvailable.reduce((a, b) => a + b, 0))
const totalConformes = computed(() => caStatusData[0] || 0)
const totalConformidade = computed(() => caStatusData.reduce((a, b) => a + b, 0))
const conformanceRate = computed(() =>
  totalConformidade.value ? `${Math.round((totalConformes.value / totalConformidade.value) * 100)}%` : '0%'
)
const caVencendo = computed(() => caStatusData[1] || 0)
const caVencidos = computed(() => caStatusData[2] || 0)
const caSemCadastro = computed(() => caStatusData[3] || 0)
const criticalItems = computed(() => stockCritical.filter((v, i) => stockAvailable[i] <= v).length)
const monthlyConsumption = computed(() => movementConsumption[movementConsumption.length - 1])

const periodLabel = computed(() => {
  if (selectedPeriod.value === 'today') return 'Hoje'
  if (selectedPeriod.value === 'week') return 'Últimos 7 dias'
  return 'Este mês'
})

const movementTypeLabel = computed(() => {
  if (selectedMovementType.value === 'entry') return 'Entradas'
  if (selectedMovementType.value === 'exit') return 'Saídas'
  return 'Todas as movimentações'
})

const distributionChartData = computed(() => [
  {
    label: 'Quantidade de EPIs',
    data: distributionData,
    backgroundColor: chartPalette.blueDark
  }
])

function clearFilters() {
  selectedPeriod.value = 'month'
  selectedMovementType.value = 'all'
  employeeFilter.value = ''
  epiFilter.value = ''
  sectorFilter.value = ''
}

async function handleGeneratePdf() {
  await generateReportPdf({
    title: 'Relatórios e Conformidade de EPIs',
    generatedAt: generatedAt.value
  })
}

const caChartData = computed(() => [
  {
    label: 'Situação do CA',
    data: caStatusData,
    backgroundColor: [
      chartPalette.blueDark,
      chartPalette.blue,
      chartPalette.orange,
      chartPalette.slate
    ]
  }
])

const movementChartData = computed(() => [
  {
    label: 'Consumo',
    data: movementConsumption,
    backgroundColor: 'rgba(1, 88, 181, 0.14)',
    borderColor: chartPalette.blue,
    fill: true
  },
  {
    label: 'Reabastecimento',
    data: movementReplenishment,
    backgroundColor: 'rgba(243, 156, 18, 0.12)',
    borderColor: chartPalette.orange,
    fill: true
  }
])

const stockChartData = computed(() => [
  {
    label: 'Disponível',
    data: stockAvailable,
    backgroundColor: chartPalette.blueDark
  },
  {
    label: 'Nível Crítico',
    data: stockCritical,
    backgroundColor: chartPalette.blueSoft
  }
])

const generatedAt = computed(() =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date())
)

  </script>

<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-info">
        <span class="badge">Relatórios</span>
        <h1 class="title">Relatórios e Conformidade de EPIs</h1>
        <span class="version-note">Consulta para apoio à gestão e à tomada de decisão</span>
      </div>
    </div>

    <div ref="reportContentRef" class="report-content">
      <section class="filters-panel">
        <div class="filters-panel-header">
          <div>
            <h2 class="section-title">Filtros do relatório</h2>
          </div>
          <button type="button" class="clear-filters-btn" @click="clearFilters">
            Limpar
          </button>
        </div>

        <div class="filter-strip">
          <div class="filter-field compact select-field">
            <label>Período</label>
            <select v-model="selectedPeriod">
              <option value="today">Hoje</option>
              <option value="week">7 dias</option>
              <option value="month">Mês</option>
            </select>
          </div>
          <div class="filter-field compact select-field">
            <label>Movimentação</label>
            <select v-model="selectedMovementType">
              <option value="all">Todas</option>
              <option value="entry">Entradas</option>
              <option value="exit">Saídas</option>
            </select>
          </div>

          <div class="filter-field">
            <label>Funcionário</label>
            <input v-model="employeeFilter" type="text" placeholder="Nome" />
          </div>

          <div class="filter-field">
            <label>EPI</label>
            <input v-model="epiFilter" type="text" placeholder="Equipamento" />
          </div>

          <div class="filter-field">
            <label>Setor</label>
            <input v-model="sectorFilter" type="text" placeholder="Setor" />
          </div>
        </div>
      </section>

      <div class="ca-banner">
        <div class="ca-banner-copy">
          <strong>Controle de CA</strong>
          <span>
            {{ conformanceRate }} válidos, {{ caVencendo }} vencendo, {{ caVencidos }} vencidos e {{ caSemCadastro }} sem cadastro.
          </span>
        </div>
        <span class="ca-banner-badge">NR-6</span>
      </div>

      <div class="metrics-grid">
        <ReportCard
          title="Total de EPIs cadastrados"
          subtitle="Em estoque"
          :value="totalEPIs"
          icon="📦"
          backgroundColor="#f39c12"
          trend="up"
          trend-value="Base geral"
        />

        <ReportCard
          title="EPIs em uso"
          subtitle="Movimentados no período"
          :value="emUso"
          icon="👷"
          backgroundColor="#0158B5"
          trend="stable"
          trend-value="Saídas registradas"
        />

        <ReportCard
          title="EPIs disponíveis"
          subtitle="Saldo atual em estoque"
          :value="disponiveis"
          icon="🧰"
          backgroundColor="#2B4A69"
          trend="stable"
          trend-value="Saldo físico"
        />

        <ReportCard
          title="Itens críticos"
          subtitle="No limite ou abaixo"
          :value="criticalItems"
          icon="⚠️"
          backgroundColor="#0158B5"
          :trend="criticalItems > 0 ? 'down' : 'stable'"
          :trend-value="criticalItems > 0 ? criticalItems + ' itens' : 'Estável'"
        />
      </div>

      <div class="charts-section">
        <div class="chart-row">
          <div class="chart-item full-width">
            <BarChart
              title="EPIs mais utilizados por tipo"
              type="horizontalBar"
              :labels="epiLabels"
              :datasets="distributionChartData"
              :height="320"
              legend-position="bottom"
              compact
              backgroundColor="#2B4A69"
            />
          </div>
        </div>

        <div class="chart-row">
          <div class="chart-item">
            <BarChart
              title="Situação do CA"
              type="doughnut"
              :labels="caStatusLabels"
              :datasets="caChartData"
              :height="320"
              backgroundColor="#0158B5"
              legend-position="bottom"
            />
          </div>

          <div class="chart-item">
            <BarChart
              title="Movimentações por mês"
              type="line"
              :labels="movementLabels"
              :datasets="movementChartData"
              :height="320"
              backgroundColor="#0158B5"
              compact
            />
          </div>
        </div>

        <div class="chart-row">
          <div class="chart-item full-width">
            <BarChart
              title="Disponível vs nível crítico"
              type="horizontalBar"
              :labels="epiLabels"
              :datasets="stockChartData"
              :height="320"
              legend-position="bottom"
              compact
              backgroundColor="#2B4A69"
            />
          </div>
        </div>
      </div>

      <div class="summary-section">
        <h2 class="summary-title">Resumo de Conformidade por Tipo</h2>
        <p class="summary-subtitle">
          {{ periodLabel }} · {{ movementTypeLabel }} · CA {{ conformanceRate }}
        </p>
        <div class="summary-table-wrapper">
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
              <tr v-for="(label, index) in epiLabels" :key="index">
                <td>{{ label }}</td>
                <td>{{ distributionData[index] }}</td>
                <td>{{ Math.round(distributionData[index] * (totalConformes / totalConformidade)) }}</td>
                <td><span class="percentage">{{ conformanceRate }}</span></td>
                <td><span class="status status-ok">✓ Conforme</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="fab-export"
      :disabled="isGeneratingPdf"
      @click="handleGeneratePdf"
    >
      {{ isGeneratingPdf ? 'Preparando PDF...' : 'Gerar PDF' }}
    </button>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin-top: -0.5rem;
  padding-right: 0;
  padding-bottom: 48px;
  overflow-x: hidden;
  position: relative;
}

.report-content {
  min-width: 0;
}

.ca-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: #fff9ef;
  border: 1px solid #f5dfae;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.ca-banner-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ca-banner-copy strong {
  font-size: 0.9rem;
  color: #243444;
}

.ca-banner-copy span {
  font-size: 0.84rem;
  color: #607086;
}

.ca-banner-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f39c12;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
}

.filters-panel {
  background: #ffffff;
  border: 1px solid #edf1f5;
  border-radius: 14px;
  padding: 18px 20px 18px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  margin-bottom: 16px;
}

.filters-panel-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf1f5;
}

.section-title {
  margin: 0;
  font-size: 0.9rem;
  color: #243444;
  font-weight: 700;
}

.clear-filters-btn {
  border: 1px solid #d4e0ec;
  background: #f8fafc;
  color: #2b4a69;
  border-radius: 10px;
  padding: 7px 11px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 0;
}

.clear-filters-btn:hover {
  background: #eef5fb;
}

.filter-strip {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  width: 100%;
}

.filter-field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-start;
}

.filter-field.compact {
  width: 130px;
  flex: 0 0 130px;
}

.filter-field.select-field {
  width: 130px;
  flex-basis: 130px;
}

.filter-field:not(.compact):not(.select-field) {
  width: 100%;
  flex: 1 1 0;
  min-width: 170px;
}

.filter-field label {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #607086;
}

.filter-field input,
.filter-field select {
  width: 100%;
  border: 1px solid #dce5ee;
  border-radius: 11px;
  padding: 0 12px;
  height: 42px;
  min-height: 42px;
  box-sizing: border-box;
  font-size: 0.86rem;
  line-height: 1;
  color: #243444;
  background: #fff;
  font-family: var(--font-secondary);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
}

.page-header-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: 100%;
}

.badge {
  display: inline-block;
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 6px 14px;
  border-radius: 999px;
}

.title {
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  line-height: 1.15;
  font-weight: 300;
  color: #333;
  margin: 0;
  font-family: var(--font-primary);
}

.version-note {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(43, 74, 105, 0.08);
  color: #2b4a69;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: var(--font-secondary);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-item {
  min-width: 0;
  min-height: 340px;
}

.chart-item :deep(.chart-container) {
  height: 100%;
}

.chart-item.full-width {
  grid-column: 1 / -1;
  min-height: 360px;
}

.summary-section {
  background: linear-gradient(180deg, rgba(255, 243, 222, 0.3) 0%, rgba(255, 255, 255, 1) 40%), white;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
  border: 1px solid #ede4d5;
}

.summary-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #243444;
  margin: 0 0 24px 0;
  font-family: var(--font-primary);
}

.summary-subtitle {
  margin: -16px 0 18px;
  color: #607086;
  font-size: 0.9rem;
  font-family: var(--font-secondary);
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-secondary);
  background: rgba(255, 255, 255, 0.86);
  border-radius: 14px;
  overflow: hidden;
}

.summary-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.summary-table thead {
  background: linear-gradient(90deg, rgba(43, 74, 105, 0.08) 0%, rgba(243, 156, 18, 0.14) 100%);
  border-bottom: 2px solid #f39c12;
}

.summary-table th {
  padding: 14px 12px;
  text-align: left;
  font-weight: 600;
  color: #243444;
  font-size: 1.05rem;
}

.summary-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #ece4d8;
  font-size: 1rem;
  color: #516374;
}

.summary-table tbody tr:nth-child(even) {
  background: rgba(43, 74, 105, 0.03);
}

.summary-table tbody tr:hover {
  background-color: rgba(243, 156, 18, 0.08);
}

.percentage {
  font-weight: 600;
  color: #c57d05;
}

.status {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: var(--font-secondary);
}

.status-ok {
  background: #fff4df;
  color: #9b6500;
}

.fab-export {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1000;
  border: none;
  border-radius: 16px;
  background: var(--color-blue-dark);
  color: #fff;
  padding: 16px 28px;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-secondary);
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(43, 74, 105, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fab-export:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(43, 74, 105, 0.45);
}

.fab-export:disabled {
  opacity: 0.7;
  cursor: wait;
}

@media (max-width: 1440px) {
  .title {
    font-size: 2.2rem;
  }
}

@media (max-width: 1280px) {
  .title {
    font-size: 2rem;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chart-row {
    grid-template-columns: 1fr;
  }

  .filter-field.compact,
  .filter-field.select-field {
    width: 120px;
    flex-basis: 120px;
  }

  .filter-field:not(.compact):not(.select-field) {
    width: 100%;
    flex-basis: 0;
  }
}

@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .title {
    font-size: 1.8rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .fab-export {
    bottom: 24px;
    right: 24px;
    padding: 14px 24px;
    font-size: 0.95rem;
  }

  .filters-panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-strip {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.7rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .summary-section {
    padding: 20px 16px;
  }

  .filters-panel {
    padding: 14px;
  }

  .fab-export {
    bottom: 20px;
    right: 20px;
    padding: 14px 20px;
    font-size: 0.9rem;
    border-radius: 14px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.6rem;
  }

  .badge {
    font-size: 0.85rem;
  }

  .fab-export {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: calc(100% - 32px);
    justify-content: center;
  }
}
</style>
