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
  { label: 'Estoque', to: '/stock', icon: stockIcon, alt: 'Estoque', color: '#ffa117' },
  { label: 'Solicitações', to: '/request', icon: requestIcon, alt: 'Solicitações', color: '#F39C12' },
  { label: 'Registros', to: '/record', icon: recordIcon, alt: 'Registros', color: '#F39C12' },
  { label: 'Histórico', to: '/historic', icon: historicIcon, alt: 'Histórico', color: '#F39C12' },
]

const bottomItems = [
  { label: 'Configuração', to: '/settings', icon: settingsIcon, alt: 'Configuração', color: '#F39C12' },
  { label: 'Perfil', to: '/profile', icon: profileIcon, alt: 'Perfil', color: '#F39C12' },
]

function openMenu() {
  isActive.value = true
}

function closeMenu() {
  isActive.value = false
}

function isCurrentRoute(path) {
  return route.path === path
}
</script>

<template>
  <div class="navigation" :class="{ active: isActive }" @mouseenter="openMenu" @mouseleave="closeMenu">
    <div class="menuToggle"></div>
    <ul>
      <div class="container-link-top">
        <li v-for="item in topItems" :key="item.to" class="list" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }">
            <span class="icon"><img :src="item.icon" :alt="item.alt" /></span>
            <span class="text">{{ item.label }}</span>
          </router-link>
        </li>
      </div>
      
      <div class="container-link-bottom">
        <li v-for="item in bottomItems" :key="item.to" class="list" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }">
            <span class="icon"><img :src="item.icon" :alt="item.alt" /></span>
            <span class="text">{{ item.label }}</span>
          </router-link>
        </li>
      </div>
    </ul>
  </div>
</template>

<style>
.navigation {
  position: fixed;
  inset: 40px 0 40px 20px;
  background: #2B4A69;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 35px;
}

.navigation.active {
  width: 250px;
}

.menuToggle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0 23px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

.icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.navigation ul {
  display: flex;
  flex-direction: column;
  gap: 50px;
  height: 100%;
  width: 100%;
  margin-top: 8rem;
}

.navigation ul li {
  list-style: none;
  position: relative;
  width: 100%;
  height: 56px;
  border-radius: 10px;
  border: 8px solid transparent;
  transition: 0.5s;
}

.navigation ul li.active {
  transform: translateX(20px);
  background: #fff;
}

.navigation ul li::before {
  content: '';
  position: absolute;
  top: -28px;
  right: 28px;
  width: 20px;
  height: 20px;
  background: #2B4A69;
  border-bottom-right-radius: 20px;
  box-shadow: 6px 5px 0 5px #fff;
  transform: scale(0);
  transform-origin: bottom right;
  transition: 0.5s;
}

.navigation ul li.active::before {
  transform: scale(1);
}

.navigation ul li::after {
  content: '';
  position: absolute;
  bottom: -26px;
  right: 28px;
  width: 18px;
  height: 18px;
  background: #2B4A69;
  border-top-right-radius: 20px;
  box-shadow: 6px -5px 0 5px #fff;
  transform: scale(0);
  transform-origin: top right;
  transition: 0.5s;
}

.navigation ul li.active::after {
  transform: scale(1);
}

.navigation:not(.active) ul li::before,
.navigation:not(.active) ul li::after {
  right: 48px;
}

.navigation ul li a {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  text-align: center;
  text-decoration: none;
  z-index: 1000;
}

.navigation ul li a .icon {
  position: relative;
  display: block;
  min-width: 34px;
  height: 34px;
  border-radius: 9px;
  background-color: transparent;
  font-size: 1.75em;
  line-height: 38px;
  border: 6px solid transparent;
  transform: translateX(-9px);
  transition: 0.5s;
}

.navigation ul li.active a .icon {
  background: var(--clr);
  transform: translateX(0);
}

.navigation ul li a .icon::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--clr);
  filter: blur(8px);
  opacity: 0;
  transition: 0.5s;
}

.navigation ul li.active a .icon::before {
  opacity: 0.1;
}

.navigation ul li a .icon::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -36px;
  width: 11px;
  height: 11px;
  background: var(--clr);
  border: 6px solid #fff;
  border-radius: 50%;
}

.navigation ul li a .text {
  position: relative;
  padding: 0 15px;
  color: #fff;
  display: flex;
  align-items: center;
  height: 60px;
  opacity: 0;
  visibility: hidden;
  transition: 0.5s;
}

.navigation.active ul li a .text {
  visibility: visible;
  opacity: 1;
}

.navigation ul li.active a .text {
  color: #333;

}

.container-link-bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

</style>