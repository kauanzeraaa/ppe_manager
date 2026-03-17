<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from './components/SideBar.vue'

const route = useRoute()

const sidebarRoutes = ['/dashboard', '/historic', '/profile', '/record', '/request', '/settings', '/stock']

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