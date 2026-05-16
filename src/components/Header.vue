<script setup lang="ts">
import router from '../router';
import { ref } from 'vue';

// Variável para controlar o estado do menu de navegação (aberto ou fechado)
const isMenuOpen = ref(false);

// Função para alternar o estado do menu de navegação
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

</script>

<!-- Component Header utilizado na tela Home para navegação -->
<template>
    <header class="header">
        <div class="logo_header">
            <img src="../assets/logo/temporaryLogo.png" class="img_logo" alt="Logo PPE Manager">
        </div>

        <button class="hamburger" :class="{ active: isMenuOpen }" @click="toggleMenu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>

        <nav class="navigation_header" :class="{ open: isMenuOpen }">
            <a href="#home" @click="isMenuOpen = false">Home</a>
            <a href="#about" @click="isMenuOpen = false">Our Services</a>
            <a href="#contact" @click="isMenuOpen = false">Contact</a>

            <router-link class="login_button mobile_login" to="/login" @click="isMenuOpen = false">Login</router-link>
        </nav>

        <div class="header_login">
            <router-link class="login_button" to="/login">Login</router-link>
        </div>
    </header>
</template>

<style>
.header {
  position: sticky;
  top: 1rem;
  z-index: 100;
  margin: 1rem 2rem 0rem 2rem;
  display: flex;
  align-items: center;
  padding: 20px 40px;
  justify-content: space-between;
  box-shadow: 0px 0px 31px #00000015;
  font-family: "poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
  background-color: #FFFFFF;
  border-radius: 63px;
}

.img_logo {
  width: 210px;
}

a {
  text-decoration: none;
  color: inherit;
}

.navigation_header {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
}

.navigation_header a {
  transition: transform 0.1s;
}

.navigation_header a:hover {
  transform: scale(1.03);
}

.login_button{
  padding: 8px 30px;
  font-family: "poppins", sans-serif;
  color: white;
  background-color: #F39C12;
  border-radius: 28px;
  font-size: 18px;
  border-style: none;
  cursor: pointer;
}
.login_button:hover{
  transform: scale(1.03);
}

.mobile_login{
  display: none;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 101;
}

.hamburger .bar {
  width: 30px;
  height: 3px;
  background-color: #333;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.hamburger.active .bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger.active .bar:nth-child(2) {
  opacity: 0;
}

.hamburger.active .bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 768px) {
  .header {
    padding: 20px;
  }

  /* reduz o tamanho do logo para caber melhor em telas menores */
  .img_logo {
    width: 150px;
  }

  /* exibe o ícone do sanduíche */
  .hamburger {
    display: flex;
  }

  /* esconde o botão de login do header */
  .header_login {
    display: none;
  }

  /* configuração do menu transformado em um dropdown */
  .navigation_header {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    background-color: #FFFFFF;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    border-radius: 20px;
    box-shadow: 0px 10px 31px #00000015;
    gap: 25px;
    margin-top: 10px;

    /* estado fechado */
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
  }

  .navigation_header.open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* exibe o botão de login de dentro do menu */
  .mobile_login {
    display: block;
    margin-top: 10px;
  }
}
</style>