<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  datasets: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'bar'
  },
  height: {
    type: Number,
    default: 300
  },
  backgroundColor: {
    type: String,
    default: '#f39c12'
  },
  legendPosition: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const chartComponents = {
  bar: Bar,
  horizontalBar: Bar,
  line: Line,
  doughnut: Doughnut
}

const chartRef = ref(null)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

function updateViewportWidth() {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth)
})

const isNotebook = computed(() => viewportWidth.value <= 1440)
const isTablet = computed(() => viewportWidth.value <= 768)

const chartFontSizes = computed(() => {
  if (props.compact) {
    if (isTablet.value) {
      return { legend: 12, title: 15, tick: 11, tooltipTitle: 12, tooltipBody: 11, padding: 14 }
    }

    return { legend: 14, title: 17, tick: 13, tooltipTitle: 13, tooltipBody: 12, padding: 18 }
  }

  if (isTablet.value) {
    return { legend: 13, title: 16, tick: 12, tooltipTitle: 13, tooltipBody: 12, padding: 16 }
  }

  if (isNotebook.value) {
    return { legend: 16, title: 20, tick: 15, tooltipTitle: 15, tooltipBody: 14, padding: 22 }
  }

  return { legend: 15, title: 18, tick: 14, tooltipTitle: 14, tooltipBody: 13, padding: 20 }
})

const chartComponent = computed(() => chartComponents[props.type] || Bar)
const useHorizontalAxis = computed(() => props.type === 'horizontalBar')
const useDoughnut = computed(() => props.type === 'doughnut')
const useLine = computed(() => props.type === 'line')

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset) => {
    const baseColor = dataset.backgroundColor || props.backgroundColor

    return {
      ...dataset,
      backgroundColor: baseColor,
      borderColor: dataset.borderColor || baseColor,
      borderWidth: dataset.borderWidth ?? (useLine.value ? 3 : 0),
      borderRadius: useLine.value || useDoughnut.value ? 0 : 8,
      borderSkipped: useLine.value || useDoughnut.value ? undefined : false,
      fill: dataset.fill ?? useLine.value,
      tension: dataset.tension ?? (useLine.value ? 0.35 : 0),
      pointRadius: dataset.pointRadius ?? (useLine.value ? 4 : 0),
      pointHoverRadius: dataset.pointHoverRadius ?? (useLine.value ? 6 : 0),
      cutout: dataset.cutout ?? (useDoughnut.value ? '62%' : undefined),
      categoryPercentage: useHorizontalAxis.value ? 0.72 : undefined,
      barPercentage: useHorizontalAxis.value ? 0.78 : undefined
    }
  })
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: useHorizontalAxis.value ? 'y' : 'x',
  plugins: {
    legend: {
      display: true,
      position: props.legendPosition || (useDoughnut.value ? 'bottom' : 'top'),
      labels: {
        font: {
          family: 'var(--font-secondary)',
          size: chartFontSizes.value.legend,
          weight: '600'
        },
        color: '#526274',
        padding: chartFontSizes.value.padding,
        usePointStyle: true,
        pointStyle: useDoughnut.value ? 'circle' : 'rect'
      }
    },
    title: {
      display: true,
      text: props.title,
      font: {
        family: 'var(--font-secondary)',
        size: chartFontSizes.value.title,
        weight: '700'
      },
      padding: {
        bottom: chartFontSizes.value.padding + 6
      },
      color: '#2B4A69'
    },
    tooltip: {
      backgroundColor: 'rgba(43, 74, 105, 0.92)',
      titleFont: {
        size: chartFontSizes.value.tooltipTitle,
        family: 'var(--font-secondary)',
        weight: '700'
      },
      bodyFont: {
        size: chartFontSizes.value.tooltipBody,
        family: 'var(--font-secondary)'
      },
      padding: chartFontSizes.value.tick,
      cornerRadius: 6
    }
  },
  ...(useDoughnut.value
    ? {}
    : {
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: useLine.value,
              color: useLine.value ? '#E6ECF2' : undefined
            },
            ticks: {
              autoSkip: isTablet.value,
              maxRotation: isTablet.value ? 45 : 0,
              minRotation: isTablet.value ? 45 : 0,
              padding: 8,
              color: '#66788A',
              font: {
                size: chartFontSizes.value.tick,
                family: 'var(--font-secondary)',
                weight: '600'
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#E6ECF2',
              drawBorder: true
            },
            ticks: {
              padding: 8,
              color: '#66788A',
              font: {
                size: chartFontSizes.value.tick,
                family: 'var(--font-secondary)',
                weight: '600'
              }
            }
          }
        }
      })
}))
</script>

<template>
  <div class="chart-container" :style="{ height: height + 'px' }">
    <component
      :is="chartComponent"
      ref="chartRef"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.08);
  border: 1px solid #f5f5f5;
}

.chart-container:deep(canvas) {
  max-width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    padding: 14px;
    border-radius: 14px;
  }
}
</style>
