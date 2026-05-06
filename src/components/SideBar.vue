<script setup>
// Importa função e hook necessários do Vue e Vue Router
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// Importa os ícones para o sidebar
import homeIcon from '../assets/icons_sidebar/home.png'
import stockIcon from '../assets/icons_sidebar/stock.png'
import requestIcon from '../assets/icons_sidebar/request.png'
import recordIcon from '../assets/icons_sidebar/record.png'
import historicIcon from '../assets/icons_sidebar/historic.png'
import settingsIcon from '../assets/icons_sidebar/settings.png'
import profileIcon from '../assets/icons_sidebar/profile.png'

// Variáveis para capturar a roda atual e estado do menu
const route = useRoute()
const isActive = ref(false)

// Array de opções do menu superior
const topItems = [
  { label: 'Home', to: '/dashboard', icon: homeIcon, alt: 'Home', color: '#F39C12' },
  { label: 'Estoque', to: '/stock', icon: stockIcon, alt: 'Estoque', color: '#ffa117' },
  { label: 'Solicitações', to: '/request', icon: requestIcon, alt: 'Solicitações', color: '#F39C12' },
  { label: 'Registros', to: '/record', icon: recordIcon, alt: 'Registros', color: '#F39C12' },
  { label: 'Histórico', to: '/historic', icon: historicIcon, alt: 'Histórico', color: '#F39C12' },
]

// Array de opções do menu inferior
const bottomItems = [
  { label: 'Configuração', to: '/settings', icon: settingsIcon, alt: 'Configuração', color: '#F39C12' },
  { label: 'Perfil', to: '/profile', icon: profileIcon, alt: 'Perfil', color: '#F39C12' },
]

// Função que muda o estado do menu para ativo
function openMenu() {
  isActive.value = true
}

// Função que muda o estado do menu para inativo
function closeMenu() {
  isActive.value = false
}

// Função que verifica se a rota atual é igual à rota do item do menu
function isCurrentRoute(path) {
  return route.path === path
}
</script>

<template>
  <div class="navigation" :class="{ active: isActive }" @mouseenter="openMenu" @mouseleave="closeMenu">
    <ul class="nav-menu">
      <div class="container-link-top">
        <li v-for="item in topItems" :key="item.to" class="list" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }" class="nav-link">
            <span class="nav-icon"><img :src="item.icon" :alt="item.alt" /></span>
            <span class="nav-text">{{ item.label }}</span>
          </router-link>    
        </li>
      </div>
      
      <div class="container-link-bottom">
        <li v-for="item in bottomItems" :key="item.to" class="list" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }" class="nav-link">
            <span class="nav-icon"><img :src="item.icon" :alt="item.alt" /></span>
            <span class="nav-text">{{ item.label }}</span>
          </router-link>
        </li>
      </div>
    </ul>
  </div>
</template>

<style>
/* Container principal da sidebar */
.navigation {
  position: fixed;
  inset: 20px 0 20px 20px;
  background: #2B4A69;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 35px;
}

/* Estado expandido da sidebar */
.navigation.active {
  width: 250px;
}

/* Estrutura do menu de navegacao */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 2%;
  height: 100%;
  width: 100%;
  margin-top: 7rem;
}

.container-link-bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Item de menu */
.list {
  list-style: none;
  position: relative;
  width: 100%;
  height: 56px;
  border-radius: 10px;
  border: 8px solid transparent;
  transition: 0.5s;
}

/* Estado ativo do item */
.list.active {
  transform: translateX(20px);
  background: #fff;
}

/* Curvas decorativas do item ativo */
.list::before {
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

.list::after {
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

.list.active::before,
.list.active::after {
  transform: scale(1);
}

.navigation:not(.active) .list::before,
.navigation:not(.active) .list::after {
  right: 48px;
}

/* Link de navegacao */
.nav-link {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  text-align: center;
  text-decoration: none;
  z-index: 1000;
}

/* Bloco do icone */
.nav-icon {
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

/* Imagem do icone */
.nav-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

/* Efeitos do icone */
.nav-icon::before {
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

.nav-icon::after {
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

/* Texto do item */
.nav-text {
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

/* Estados ativos de icone e texto */
.list.active .nav-icon {
  background: var(--clr);
  transform: translateX(0);
}

.list.active .nav-icon::before {
  opacity: 0.1;
}

.navigation.active .nav-text {
  visibility: visible;
  opacity: 1;
}

.list.active .nav-text {
  color: #333;
}

</style>