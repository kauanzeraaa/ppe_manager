<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

import homeIcon from '../assets/icons_sidebar/home.png'
import stockIcon from '../assets/icons_sidebar/stock.png'
import requestIcon from '../assets/icons_sidebar/request.png'
import recordIcon from '../assets/icons_sidebar/record.png'
import historicIcon from '../assets/icons_sidebar/historic.png'
import profileIcon from '../assets/icons_sidebar/profile.png'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const route = useRoute()
const isActive = ref(false)
const isMobileOpen = ref(false) // Novo estado para o menu mobile
const userRole = ref(null)

const topItems = [
  { label: 'Home', to: '/dashboard', icon: homeIcon, alt: 'Home', color: '#F39C12' },
  { label: 'Estoque', to: '/stock', icon: stockIcon, alt: 'Estoque', color: '#F39C12' },
  { label: 'Relatórios', to: '/reports', icon: requestIcon, alt: 'Relatórios', color: '#F39C12', role: 'Administrador' },
  { label: 'Movimentação', to: '/movement', icon: recordIcon, alt: 'Movimentações', color: '#F39C12' },
  { label: 'Histórico', to: '/historic', icon: historicIcon, alt: 'Histórico', color: '#F39C12' },
]

const visibleTopItems = computed(() => topItems.filter(item => !item.role || item.role === userRole.value))

const bottomItems = [
  { label: 'Perfil', to: '/profile', icon: profileIcon, alt: 'Perfil', color: '#F39C12' },
]

function isCurrentRoute(path) {
  return route.path === path
}

// Função para fechar o menu no mobile ao clicar em um link
function closeMobileMenu() {
  isMobileOpen.value = false
}

async function fetchUserRole() {
  try {
    const { data, error: authError } = await supabase.auth.getUser()
    const user = data?.user

    if (authError) {
      console.error('Erro ao obter usuário autenticado:', authError)
      return
    }

    if (user) {
      const { data: roleData, error: roleError } = await supabase
        .from('usuario')
        .select('funcao')
        .eq('id', user.id)
        .maybeSingle()

      if (roleData) {
        userRole.value = roleData.funcao
      }
      if (roleError) {
        console.error('Erro ao buscar a função do usuário:', roleError)
      }
    }
  } catch (error) {
    console.error('Erro ao buscar a função do usuário:', error)
  }
}

onMounted(() => {
  fetchUserRole()
})
</script>

<template>
  <button class="hamburger-btn" @click="isMobileOpen = !isMobileOpen">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>

  <div class="sidebar-overlay" :class="{ 'overlay-active': isMobileOpen }" @click="closeMobileMenu"></div>

  <div class="sidebar" :class="{ expanded: isActive, 'mobile-open': isMobileOpen }" @mouseenter="isActive = true" @mouseleave="isActive = false">
    <ul class="nav-menu">
      <div class="nav-group">
        <li v-for="item in visibleTopItems" :key="item.to" class="nav-item" :class="{ active: isCurrentRoute(item.to) }">
          <router-link :to="item.to" :style="{ '--clr': item.color }" class="nav-link" @click="closeMobileMenu">
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
          <router-link :to="item.to" :style="{ '--clr': item.color }" class="nav-link" @click="closeMobileMenu">
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
  inset: 20px 0 28px 20px;
  width: 75px;
  height: calc(100vh - 48px);
  background: #2b4a69;
  border-radius: 28px;
  overflow: hidden;
  transition: width 0.38s cubic-bezier(0.4, 0, 0.2, 1), transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  display: flex;
}

.sidebar.expanded {
  width: 260px;
}

/* Menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem 10px 2.5rem;
  margin: 0;
  list-style: none;
  width: 100%;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 10px 4px 14px;
  flex-shrink: 0;
}

.teste {
  margin-top: auto;
  padding-bottom: 56px;
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
  padding: 6px 10px;
  height: 48px;
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


/* ========================================================
   ESTILOS DE RESPONSIVIDADE (MOBILE)
======================================================== */

.hamburger-btn {
  display: none; /* Escondido por padrão no desktop */
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  /* Mostra o botão hambúrguer */
  .hamburger-btn {
    display: flex;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 90;
    background: #2b4a69;
    color: white;
    border: none;
    border-radius: 8px;
    width: 44px;
    height: 44px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .teste {
    margin-bottom: 2rem; 
  }

  .hamburger-btn svg {
    width: 24px;
    height: 24px;
  }

  /* Estilos do fundo escuro (overlay) */
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 95;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .sidebar-overlay.overlay-active {
    opacity: 1;
    visibility: visible;
  }

  /* Modifica a sidebar para agir como um menu lateral retrátil (Drawer) */
  .sidebar {
    inset: 0 auto 0 0;
    height: 100vh;
    border-radius: 0 28px 28px 0;
    transform: translateX(-100%); /* Esconde fora da tela por padrão */
    width: 260px; /* Largura fixa quando aberto no mobile */
    z-index: 100;
  }

  /* Quando ativado no mobile */
  .sidebar.mobile-open {
    transform: translateX(0);
  }

  /* Garante que os textos apareçam no mobile, pois ele já abre expandido */
  .nav-label {
    opacity: 1;
    visibility: visible;
  }
}
</style>