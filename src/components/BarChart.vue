<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
  height: {
    type: Number,
    default: 300
  },
  backgroundColor: {
    type: String,
    default: '#f39c12'
  }
})

const chartRef = ref(null)
const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || props.backgroundColor,
    borderRadius: 8,
    borderSkipped: false
  }))
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: {
          family: 'var(--font-primary)',
          size: 12,
          weight: '500'
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'rect'
      }
    },
    title: {
      display: true,
      text: props.title,
      font: {
        family: 'var(--font-primary)',
        size: 14,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      },
      color: '#333'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 12,
        family: 'var(--font-primary)'
      },
      bodyFont: {
        size: 11,
        family: 'var(--font-primary)'
      },
      padding: 10,
      cornerRadius: 6
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11,
          family: 'var(--font-primary)'
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f0f0f0',
        drawBorder: true
      },
      ticks: {
        font: {
          size: 11,
          family: 'var(--font-primary)'
        }
      }
    }
  }
}))
</script>

<template>
  <div class="chart-container" :style="{ height: height + 'px' }">
    <Bar
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
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f5f5f5;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
  }
}
</style>
