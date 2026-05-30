<!-- src/views/Dashboard.vue -->

<script setup>

/* =========================================================
   IMPORTAÇÕES
========================================================= */

import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'

import BarChart from '../components/BarChart.vue'
import ReportCard from '../components/ReportCard.vue'

import { useDashboard } from '../composables/useDashboard'

/* =========================================================
   DASHBOARD
========================================================= */

const {
  isLoading,
  hasError,
  totalEpis,
  emEstoque,
  itensCriticos,
  caValidos,
  caVencendo,
  caVencidos,
  caSemCadastro,
  conformidadePercentual,
  carregarDashboard
} = useDashboard()

/* =========================================================
   FILTRO
========================================================= */

const currentFilter = ref('today')

/* =========================================================
   DADOS AUXILIARES
========================================================= */

const solicitacoesContador = ref(4)

/* =========================================================
   PALETA
========================================================= */

const chartPalette = {
  blueDark: '#2B4A69',
  blue: '#0158B5',
  orange: '#F39C12',
  blueSoft: '#8FA9C4',
  slate: '#C7D2DD',
  success: '#2FA66A',
  danger: '#D95C4F'
}

/* =========================================================
   CARREGAR DASHBOARD
========================================================= */

onMounted(async () => {
  await carregarDashboard()
})

watch(currentFilter, async () => {
  await carregarDashboard()
})

/* =========================================================
   RESUMO
========================================================= */

const summaryData = computed(() => {

  const totalAcoes =
    totalEpis.value +
    itensCriticos.value

  const sufixoTempo =
    currentFilter.value === 'today'
      ? 'hoje'
      : currentFilter.value === 'week'
        ? 'esta semana'
        : 'este mês'

  return {
    value: `${totalAcoes} movimentações`,

    text:
      `${emEstoque.value} unidades em estoque ${sufixoTempo}. ` +
      `${itensCriticos.value} itens críticos e ` +
      `${solicitacoesContador.value} solicitações em atenção.`
  }

})

/* =========================================================
   COR CONFORMIDADE
========================================================= */

const conformityColor = computed(() => {

  if (conformidadePercentual.value >= 90) {
    return chartPalette.success
  }

  if (conformidadePercentual.value >= 75) {
    return chartPalette.orange
  }

  return chartPalette.danger

})

/* =========================================================
   KPI
========================================================= */

const kpis = computed(() => [

  {
    title: 'Total de EPIs cadastrados',
    subtitle: 'Base monitorada',
    value: totalEpis.value,
    icon: '🧰',
    backgroundColor: chartPalette.orange,
    trend: 'stable',
    trendValue: 'OK'
  },

  {
    title: 'EPIs em estoque',
    subtitle: 'Saldo disponível',
    value: emEstoque.value,
    icon: '📦',
    backgroundColor: chartPalette.blue,
    trend: 'stable',
    trendValue: 'Físico'
  },

  {
    title: 'Itens críticos',
    subtitle: 'Abaixo do mínimo',
    value: itensCriticos.value,
    icon: '⚠️',
    backgroundColor: chartPalette.blueDark,
    trend: itensCriticos.value > 0 ? 'down' : 'stable',
    trendValue: itensCriticos.value > 0 ? 'Atenção' : 'Zerado'
  },

  {
    title: 'CA válidos',
    subtitle: 'Conformes no período',
    value: caValidos.value,
    icon: '📋',
    backgroundColor: chartPalette.success,
    trend: 'stable',
    trendValue: `${caVencendo.value} vencendo`
  },

  {
    title: 'Conformidade',
    subtitle: 'Situação geral',
    value: `${conformidadePercentual.value}%`,
    icon: '✓',
    backgroundColor: conformityColor.value,
    trend: 'stable',
    trendValue: 'Geral'
  }

])

/* =========================================================
   ALERTAS
========================================================= */

const alerts = computed(() => {

  const lista = []

  if (itensCriticos.value > 0) {

    lista.push({
      title: 'Estoque crítico',
      description:
        `${itensCriticos.value} EPIs abaixo do mínimo.`,
      tone: 'danger',
      actionText: 'Revisar estoque',
      to: '/stock'
    })

  }

  if (solicitacoesContador.value > 0) {

    lista.push({
      title: 'Solicitações pendentes',
      description:
        `${solicitacoesContador.value} solicitações aguardando aprovação.`,
      tone: 'info',
      actionText: 'Analisar histórico',
      to: '/historic'
    })

  }

  if (caVencendo.value > 0 || caVencidos.value > 0) {

    lista.push({
      title: 'CA em atenção',
      description:
        `${caVencendo.value} vencendo e ${caVencidos.value} vencidos.`,
      tone: 'warning',
      actionText: 'Abrir relatórios',
      to: '/reports'
    })

  }

  return lista

})

/* =========================================================
   AÇÕES RÁPIDAS
========================================================= */

const quickActions = [

  {
    title: 'Registrar movimentação',
    description: 'Controlar entradas e saídas.',
    to: '/movement'
  },

  {
    title: 'Abrir relatórios',
    description: 'Consultar indicadores executivos.',
    to: '/reports'
  },

  {
    title: 'Revisar estoque',
    description: 'Atuar sobre itens críticos.',
    to: '/stock'
  },

  {
    title: 'Consultar histórico',
    description: 'Auditar movimentações recentes.',
    to: '/historic'
  }

]

/* =========================================================
   FEED
========================================================= */

const activityFeed = [

  {
    time: 'Agora',
    title: 'Entrega registrada',
    tag: 'Entrega',
    description:
      'Uma entrega de EPIs foi registrada.'
  },

  {
    time: '12 min',
    title: 'Alerta de estoque',
    tag: 'Atenção',
    description:
      'Itens abaixo do mínimo identificados.'
  },

  {
    time: '43 min',
    title: 'Relatório acessado',
    tag: 'Gestão',
    description:
      'Relatório consultado pela gestão.'
  }

]

/* =========================================================
   GRÁFICOS
========================================================= */

const stockLabels = [
  'Capacete',
  'Luva',
  'Máscara',
  'Colete',
  'Bota',
  'Óculos'
]

const stockAvailable = [
  120,
  250,
  380,
  95,
  160,
  85
]

const movementLabels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun'
]

const movementEntries = [
  22,
  28,
  31,
  26,
  34,
  29
]

const movementReturns = [
  8,
  11,
  9,
  14,
  12,
  10
]

/* =========================================================
   DADOS DOS GRÁFICOS
========================================================= */

const usageOverviewData = computed(() => [

  {
    label: 'Quantidade por tipo',

    data: stockAvailable,

    backgroundColor: [
      chartPalette.blueDark,
      chartPalette.blue,
      chartPalette.orange,
      chartPalette.blueSoft,
      chartPalette.slate,
      chartPalette.success
    ]
  }

])

const movementOverviewData = computed(() => [

  {
    label: 'Entregas',

    data: movementEntries,

    borderColor: chartPalette.blue,

    backgroundColor: 'rgba(1, 88, 181, 0.1)'
  },

  {
    label: 'Devoluções',

    data: movementReturns,

    borderColor: chartPalette.orange,

    backgroundColor: 'rgba(243, 156, 18, 0.1)'
  }

])

</script>

<template>

  <div class="page">

    <div
      class="error-banner"
      v-if="hasError"
    >
      ⚠️ Não foi possível carregar os dados do dashboard.
    </div>

    <!-- HEADER -->

    <header class="page-header">

      <div class="page-header-top">

        <div class="page-header-copy">

          <span class="badge">
            Dashboard
          </span>

          <h1 class="title">
            Dashboard Executivo de EPIs
          </h1>

          <p class="subtitle">
            Panorama gerencial de estoque,
            conformidade e alertas prioritários.
          </p>

        </div>

        <div class="page-header-tools">

          <nav class="time-filter-wrapper">

            <button
              :class="['filter-btn', { active: currentFilter === 'today' }]"
              @click="currentFilter = 'today'"
            >
              Hoje
            </button>

            <button
              :class="['filter-btn', { active: currentFilter === 'week' }]"
              @click="currentFilter = 'week'"
            >
              Semana
            </button>

            <button
              :class="['filter-btn', { active: currentFilter === 'month' }]"
              @click="currentFilter = 'month'"
            >
              Mês
            </button>

          </nav>

        </div>

      </div>

      <section class="summary-card">

        <div class="ca-strip">

          <span class="ca-pill">
            <strong>{{ caValidos }}</strong>
            <small>CA válidos</small>
          </span>

          <span class="ca-pill">
            <strong>{{ caVencendo }}</strong>
            <small>Vencendo</small>
          </span>

          <span class="ca-pill attention">
            <strong>{{ caVencidos + caSemCadastro }}</strong>
            <small>Irregulares</small>
          </span>

        </div>

        <!-- HERO -->

        <div class="hero-card">

          <span class="hero-label">Resumo do período</span>

          <div class="hero-inline">

            <strong class="hero-value">
              {{ summaryData.value }}
            </strong>

            <span class="hero-text">
              {{ summaryData.text }}
            </span>

          </div>

        </div>

      </section>

    </header>

    <!-- KPI -->

    <section class="metrics-grid">

      <ReportCard
        v-for="item in kpis"
        :key="item.title"
        :title="item.title"
        :subtitle="item.subtitle"
        :value="item.value"
        :icon="item.icon"
        :background-color="item.backgroundColor"
        :trend="item.trend"
        :trend-value="item.trendValue"
      />

    </section>

    <!-- ALERTAS E AÇÕES -->

    <div class="overview-grid">

      <!-- ALERTAS -->

      <section class="panel">

        <div class="panel-header">

          <span class="panel-kicker">
            Urgente
          </span>

          <h2 class="panel-title">
            Alertas do sistema
          </h2>

        </div>

        <div class="alerts-list">

          <article
            v-for="alert in alerts"
            :key="alert.title"
            :class="['alert-item', `alert-${alert.tone}`]"
          >

            <div class="alert-inner-layout">

              <div class="alert-text-block">

                <h3>{{ alert.title }}</h3>

                <p>
                  {{ alert.description }}
                </p>

              </div>

              <RouterLink
                :to="alert.to"
                class="alert-action-link"
              >
                {{ alert.actionText }}
              </RouterLink>

            </div>

          </article>

        </div>

      </section>

      <!-- AÇÕES -->

      <section class="panel">

        <div class="panel-header">

          <span class="panel-kicker">
            Atalhos
          </span>

          <h2 class="panel-title">
            Ações rápidas
          </h2>

        </div>

        <div class="actions-grid">

          <RouterLink
            v-for="action in quickActions"
            :key="action.title"
            :to="action.to"
            class="action-card"
          >

            <strong>
              {{ action.title }}
            </strong>

            <span>
              {{ action.description }}
            </span>

          </RouterLink>

        </div>

      </section>

    </div>

    <!-- GRÁFICOS -->

    <div class="analytics-grid">

      <div class="chart-block">

        <BarChart
          title="EPIs mais utilizados"
          type="doughnut"
          :labels="stockLabels"
          :datasets="usageOverviewData"
          :height="260"
        />

      </div>

      <div class="chart-block">

        <BarChart
          title="Movimentações por mês"
          type="line"
          :labels="movementLabels"
          :datasets="movementOverviewData"
          :height="260"
        />

      </div>

    </div>

    <!-- FEED -->

    <section class="panel activity-panel">

      <div class="panel-header">

        <span class="panel-kicker">
          Últimas ações
        </span>

        <h2 class="panel-title">
          Movimentações recentes
        </h2>

      </div>

      <div class="activity-list">

        <article
          v-for="item in activityFeed"
          :key="item.title"
          class="activity-item"
        >

          <div class="activity-time">
            {{ item.time }}
          </div>

          <div class="activity-content">

            <div class="activity-topline">

              <h3>
                {{ item.title }}
              </h3>

              <span class="activity-tag">
                {{ item.tag }}
              </span>

            </div>

            <p>
              {{ item.description }}
            </p>

          </div>

        </article>

      </div>

    </section>

  </div>

</template>

<style scoped>

.page {
  width: 100%;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* =========================================================
   ERRO
========================================================= */

.error-banner {
  background-color: #fff4f2;
  border: 1px solid #f4c8c1;
  color: #d95c4f;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* =========================================================
   HEADER
========================================================= */

.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: -18px;
}

.page-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.page-header-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  padding: 2px 0;
}

.page-header-tools {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-shrink: 0;
}

.badge {
  background: rgba(243, 156, 18, 0.12);
  color: #e67e22;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  width: fit-content;
  text-transform: uppercase;
}

.title {
  margin: 0;
  color: #243444;
  font-size: clamp(2rem, 2.2vw, 2.7rem);
  line-height: 1.04;
  font-weight: 800;
  max-width: 760px;
}

.subtitle {
  color: #607086;
  margin: 0;
  font-size: 0.92rem;
  max-width: 620px;
  line-height: 1.55;
}

/* =========================================================
   RESUMO
========================================================= */

/* =========================================================
   RESUMO SUPERIOR
========================================================= */

.summary-card {
  background:
    linear-gradient(
      135deg,
      #ffffff,
      #fbfcfe
    );
  border-radius: 18px;
  padding: 14px 18px;
  border: 1px solid #e7edf3;
  box-shadow:
    0 6px 18px rgba(15, 23, 42, 0.05);
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

/* =========================================================
   FILTROS
========================================================= */

.time-filter-wrapper {
  display: flex;
  align-items: center;
  background-color: #eef2f6;
  padding: 4px;
  border-radius: 16px;
  box-sizing: border-box;
  min-width: 264px;
}

.filter-btn {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #607086;
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.filter-btn:hover {
  color: #243444;
}

.filter-btn.active {
  background: #ffffff;
  color: #243444;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* =========================================================
   CARDS CA
========================================================= */

.ca-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ca-pill {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  box-sizing: border-box;
  transition: 0.2s ease;
}

.ca-pill:hover {
  transform: translateY(-2px);
}

.ca-pill strong {
  font-size: 1.1rem;
  font-weight: 800;
  color: #243444;
  line-height: 1;
}

.ca-pill small {
  color: #607086;
  font-size: 0.66rem;
  line-height: 1.35;
}

.ca-pill.attention {
  background: linear-gradient(
    135deg,
    #fff8ec,
    #fffdf7
  );

  border-color: #f4d89a;
}

/* =========================================================
   HERO
========================================================= */

.hero-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 2px;
  color: #f39c12;
  display: block;
  margin-bottom: 4px;
}

.hero-value {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.05;
  margin: 0;
  color: #243444;
  white-space: nowrap;
}

.hero-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #607086;
  max-width: none;
}

.hero-inline {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 1200px) {

  .page-header {
    gap: 16px;
  }

  .page-header-top {
    flex-direction: column;
  }

  .page-header-tools {
    justify-content: flex-start;
  }

  .summary-card {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

}

@media (max-width: 768px) {

  .summary-card {
    padding: 16px;
  }

  .time-filter-wrapper {
    height: auto;
    min-width: 0;
    width: 100%;
  }

  .ca-pill {
    min-height: auto;
  }

  .hero-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

}
/* =========================================================
   KPI
========================================================= */

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-top: 0;
}

/* =========================================================
   GRIDS
========================================================= */

.overview-grid,
.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* =========================================================
   PANELS
========================================================= */

.panel,
.chart-block {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #eef1f4;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.panel-header {
  margin-bottom: 16px;
}

.panel-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  color: #f39c12;
  text-transform: uppercase;
}

.panel-title {
  color: #243444;
  margin-top: 6px;
  font-size: 1rem;
}

.panel:hover {
  transform: translateY(-2px);
}

/* =========================================================
   ALERTAS
========================================================= */

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.alert-item {
  border-radius: 14px;
  padding: 16px;
}

.alert-danger {
  background-color: #fff4f2;
}

.alert-warning {
  background-color: #fff8ec;
}

.alert-info {
  background-color: #f4f8fc;
}

.alert-inner-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.alert-text-block h3 {
  margin: 0 0 6px 0;
  font-size: 0.92rem;
  color: #243444;
}

.alert-text-block p {
  margin: 0;
  color: #5b6b7b;
  line-height: 1.5;
  font-size: 0.82rem;
}

.alert-action-link {
  padding: 10px 14px;
  border-radius: 10px;
  background: #2b4a69;
  color: white;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

/* =========================================================
   AÇÕES
========================================================= */

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-card {
  background-color: #f8fafc;
  border: 1px solid #edf1f5;
  border-radius: 14px;
  padding: 18px;
  text-decoration: none;
  transition: 0.2s;
}

.action-card:hover {
  border-color: #f39c12;
  transform: translateY(-2px);
}

.action-card strong {
  display: block;
  margin-bottom: 6px;
  color: #243444;
  font-size: 0.9rem;
}

.action-card span {
  color: #66788a;
  font-size: 0.82rem;
  line-height: 1.5;
}

/* =========================================================
   GRÁFICOS
========================================================= */

.chart-block {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================================================
   FEED
========================================================= */

.activity-panel {
  position: relative;
  overflow: hidden;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

/* LINHA DA TIMELINE */

.activity-list::before {
  content: '';
  position: absolute;
  left: 78px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: #e7edf3;
}

/* ITEM */

.activity-item {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 24px;
  position: relative;
  padding: 24px 0;
}

/* BOLINHA */

.activity-item::before {
  content: '';
  position: absolute;
  left: 72px;
  top: 34px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f39c12;
  border: 4px solid #ffffff;
  box-shadow: 0 0 0 2px #e7edf3;
  z-index: 2;
}

/* HORÁRIO */

.activity-time {
  color: #f39c12;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding-top: 2px;
}

/* CONTEÚDO */

.activity-content {
  background: #fafbfd;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 18px 20px;
  transition: 0.2s ease;
}

.activity-content:hover {
  border-color: #d6e0ea;
  transform: translateY(-1px);
}

/* TOPO */

.activity-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.activity-topline h3 {
  margin: 0;
  font-size: 1rem;
  color: #243444;
  font-weight: 700;
}

/* TAG */

.activity-tag {
  background: rgba(43, 74, 105, 0.08);
  color: #2b4a69;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

/* TEXTO */

.activity-content p {
  margin: 0;
  color: #607086;
  line-height: 1.55;
  font-size: 0.88rem;
}

/* ITEM MAIS RECENTE */

.activity-item:first-child .activity-content {
  background: linear-gradient(
    135deg,
    rgba(243, 156, 18, 0.06),
    rgba(255,255,255,1)
  );

  border-color: rgba(243, 156, 18, 0.2);
}

.activity-item:first-child::before {
  background: #2fa66a;
}

/* RESPONSIVO */

@media (max-width: 768px) {

  .activity-list::before {
    left: 16px;
  }

  .activity-item {
    grid-template-columns: 1fr;
    padding-left: 40px;
  }

  .activity-item::before {
    left: 9px;
  }

  .activity-topline {
    flex-direction: column;
    align-items: flex-start;
  }

}
/* =========================================================
   RESPONSIVO
========================================================= */

@media (max-width: 1200px) {
  .overview-grid,
  .analytics-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 768px) {

  .activity-item {
    grid-template-columns: 1fr;
  }

  .alert-inner-layout {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

}
</style>
