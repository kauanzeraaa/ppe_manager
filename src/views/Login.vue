<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.push('/');
};

const goToDashboard = () => {
  router.push('/dashboard');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="content">
        <button class="back-button" @click="goBack">←</button>
        <h1 class="title">Faça Login</h1>
        <form @submit.prevent="">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Digite seu email" />
          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" />
          <div class="container-buttons">
            <button type="button" class="submit" @click="goToDashboard">Entrar</button>
            <button type="button" class="register" @click="goToRegister">Cadastrar</button>
          </div>
        </form>
      </div>
      <img src="../assets/homi.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  height: 100vh;
  width: 100%;
  background: linear-gradient(
    to right,
    var(--color-blue-dark) 0%,
    var(--color-blue-dark) 50%,
    #ffffff 100%
  );
}

.container {
  margin: auto;
  width: 65%;
  height: 70%;
  background-color: #ffffff;
  border-radius: 23px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  justify-content: center;
  display: flex;
}

.container img {
  width: 45%;
  height: auto;
  border-radius: 0px 23px 23px 0px;
}

.content {
  width: 55%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-blue-dark);
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 0;
}

.back-button:hover {
  transform: scale(1.2);
}

.title {
  font-size: 2.2rem;
  font-family: var(--font-primary);
  font-weight: 500;
}

.content form {
  display: flex;
  flex-direction: column;
  width: 80%;
  gap: 10px;
}

.content form label {
  font-size: 1rem;
  font-family: var(--font-secondary);
  font-weight: 500;
}

.content form input {
  padding: 14px;
  padding-right: 40px;
  border-radius: 10px;
  border: none;
  font-size: 0.9rem;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: box-shadow 0.3s ease;
}

.content form input:hover,
.content form input:focus {
  outline: none;
  box-shadow: 0px 0px 12px rgba(0, 102, 204, 0.5);
}

#email {
  background-image: url('../assets/icons_login/email.png');
}

#password {
  background-image: url('../assets/icons_login/password.png');
}

.content form input::placeholder {
  color: #999999;
  opacity: 1;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper img {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.container-buttons {
  display: flex;
  gap: 10px;
  width: 90%;
  margin: 0 auto;
  justify-content: space-between;
}

.submit {
  background-color: var(--color-blue-dark);
  color: #ffffff;
  border: none;
  padding: 12px 50px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
}

.submit:hover { 
  box-shadow: 0px 4px 15px rgba(10, 9, 90, 0.9);
}

.register {
  background-color: transparent;
  color: var(--color-blue-dark);
  border: 2px solid var(--color-blue-dark);
  padding: 10px 45px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
}

.register:hover {
  background-color: var(--color-blue-dark);
  color: #ffffff;
  box-shadow: 0px 4px 15px rgba(10, 9, 90, 0.9);
}

</style>
