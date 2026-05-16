<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: '-'
  },
  icon: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },
  trendValue: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: '#f39c12'
  }
})
</script>

<template>
  <div class="report-card" :style="{ '--bg-color': backgroundColor }">
    <div class="card-header">
      <div class="card-info">
        <h3 class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="icon" class="card-icon">
        {{ icon }}
      </div>
    </div>
    
    <div class="card-content">
      <div class="value-container">
        <span class="value">{{ value }}</span>
        <div v-if="trendValue" :class="['trend', `trend-${trend}`]">
          <span v-if="trend === 'up'" class="trend-icon">↑</span>
          <span v-else-if="trend === 'down'" class="trend-icon">↓</span>
          <span v-else class="trend-icon">→</span>
          {{ trendValue }}
        </div>
      </div>
    </div>
    
    <slot></slot>
  </div>
</template>

<style scoped>
.report-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f5f5f5;
  border-left: 4px solid var(--bg-color, #f39c12);
  transition: all 0.3s ease;
}

.report-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  font-family: var(--font-primary);
}

.card-subtitle {
  font-size: 0.85rem;
  color: #999;
  margin: 4px 0 0 0;
  font-family: var(--font-primary);
}

.card-icon {
  font-size: 1.8rem;
  opacity: 0.7;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.value-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--bg-color, #f39c12);
  font-family: var(--font-primary);
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-primary);
}

.trend-up {
  color: #27ae60;
  background-color: #d5f4e6;
}

.trend-down {
  color: #e74c3c;
  background-color: #fadbd8;
}

.trend-stable {
  color: #3498db;
  background-color: #d6eaf8;
}

.trend-icon {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .report-card {
    padding: 16px;
  }

  .card-title {
    font-size: 0.9rem;
  }

  .value {
    font-size: 1.5rem;
  }
}
</style>