<script setup lang="ts">
import router from '../router';
</script>

<!-- Component Header utilizado na tela Home para navegação -->
<template>
    <header class="header">
        <div class="logo_header">
            <img src="../assets/logo/temporaryLogo.png" class="img_logo" alt="Logo EPI Track">
        </div>
        <nav class="navigation_header">
            <a href="#home">Home</a>
            <a href="#services">Our Services</a>
            <a href="#contact">Contact</a>
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
  margin: 2rem 2rem;
  display: flex;
  align-items: center;
  padding: 20px 40px;
  justify-content: space-between;
  box-shadow: 1px 1px 4px #000000;
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
</style>