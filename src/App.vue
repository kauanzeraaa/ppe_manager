<script setup>
// Importa funções e hooks necessários do Vue e Vue Router
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Importa o componente 
import SideBar from './components/SideBar.vue'

// Variável para capturar a rota atual 
const route = useRoute();

// Array de rotas que devem exibir o componente SideBar 
const sidebarRoutes = [
  '/dashboard', 
  '/historic', 
  '/profile', 
  '/record',       
  '/request', 
  '/settings', 
  '/stock'
];

// Variável computada para determinar se o SideBar deve ser exibido com base na rota atual
const showSidebar = computed(() => sidebarRoutes.includes(route.path))
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--with-sidebar': showSidebar }">
    <SideBar v-if="showSidebar" />
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-shell--with-sidebar .app-content {
  padding: 40px 40px 40px 140px;
}

@media (max-width: 768px) {
  .app-shell--with-sidebar .app-content {
    padding: 24px 24px 24px 110px;
  }
}
</style>