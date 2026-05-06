<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import homeIcon from '../assets/icons_sidebar/home.png'
import stockIcon from '../assets/icons_sidebar/stock.png'
import requestIcon from '../assets/icons_sidebar/request.png'
import recordIcon from '../assets/icons_sidebar/record.png'
import historicIcon from '../assets/icons_sidebar/historic.png'
import settingsIcon from '../assets/icons_sidebar/settings.png'
import profileIcon from '../assets/icons_sidebar/profile.png'

const route = useRoute()
const isActive = ref(false)

const topItems = [
  { label: 'Home', to: '/dashboard', icon: homeIcon, alt: 'Home', color: '#F39C12' },
  { label: 'Estoque', to: '/stock', icon: stockIcon, alt: 'Estoque', color: '#F39C12' },
  { label: 'Solicitações', to: '/request', icon: requestIcon, alt: 'Solicitações', color: '#F39C12' },
  { label: 'Registros', to: '/record', icon: recordIcon, alt: 'Registros', color: '#F39C12' },
  { label: 'Histórico', to: '/historic', icon: historicIcon, alt: 'Histórico', color: '#F39C12' },
]

const bottomItems = [
  { label: 'Configuração', to: '/settings', icon: settingsIcon, alt: 'Configuração', color: '#F39C12' },
  { label: 'Perfil', to: '/profile', icon: profileIcon, alt: 'Perfil', color: '#F39C12' },
]

function isCurrentRoute(path) {
  return route.path === path
}
</script>

<template>
  <div class="sidebar" :class="{ expanded: isActive }" @mouseenter="isActive = true" @mouseleave="isActive = false">
    <ul class="nav-menu">
      <div class="nav-group">
        <li v-for="item in topItems" :key="item.to" class="nav-item" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }" class="nav-link">
            <span class="nav-icon">
              <img :src="item.icon" :alt="item.alt" />
            </span>
            <span class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </div>

      <div class="nav-divider"></div>

      <div class="nav-group teste">
        <li v-for="item in bottomItems" :key="item.to" class="nav-item" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }" class="nav-link">
            <span class="nav-icon">
              <img :src="item.icon" :alt="item.alt" />
            </span>
            <span class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </div>
    </ul>
  </div>
</template>

<style scoped>
/* Sidebar container */
.sidebar {
  position: fixed;
  inset: 20px 0 20px 20px;
  width: 75px;
  background: #2b4a69;
  border-radius: 28px;
  overflow: hidden;
  transition: width 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.sidebar.expanded {
  width: 260px;
}

/* Menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 3rem 10px 1.5rem;
  margin: 0;
  list-style: none;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 10px 4px;
  flex-shrink: 0;
  margin-top: 80px;
}

/* Item */
.nav-item {
  list-style: none;
  position: relative;
  border-radius: 14px;
  transition: background 0.22s ease;
}

/* Bullet lateral do item ativo */
.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 22px;
  background: var(--clr, #F39C12);
  border-radius: 0 4px 4px 0;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item.active::before {
  transform: translateY(-50%) scaleY(1);
}

.nav-item:not(.active):hover {
  background: rgba(255, 255, 255, 0.07);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.11);
}

/* Link */
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  height: 52px;
  text-decoration: none;
  border-radius: 14px;
  cursor: pointer;
  outline: none;
}

/* Icon wrapper */
.nav-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.07);
  transition: background 0.22s ease, box-shadow 0.22s ease;
}

.nav-item:not(.active):hover .nav-icon {
  background: rgba(255, 255, 255, 0.14);
}

.nav-item.active .nav-icon {
  background: var(--clr);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--clr) 55%, transparent);
}

.nav-icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

/* Label */
.nav-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.12s ease, visibility 0s linear 0.12s;
}

.sidebar.expanded .nav-label {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s ease 0.26s, visibility 0s linear 0.26s;
}

.nav-item.active .nav-label {
  color: #fff;
  font-weight: 700;
}

.nav-item:not(.active):hover .nav-label {
  color: rgba(255, 255, 255, 0.88);
}
</style>
