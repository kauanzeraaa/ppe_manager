<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSupabase } from "../composables/useSupabase";

const email = ref("");
const password = ref("");
const erro = ref(null);
const loading = ref(false);

const { supabase } = useSupabase();
const router = useRouter();

const goBack = () => {
  router.push("/");
};

const login = async () => {
  // Reseta o erro e define o estado de carregamento
  erro.value = null;
  loading.value = true;

  const emailNormalizado = email.value.trim().toLowerCase();

  // Validação básica para garantir que email e senha foram preenchidos
  if (!emailNormalizado || !password.value) {
    erro.value = "Email e senha são obrigatórios";
    loading.value = false;
    return;
  }

  try {
    // Tenta fazer login com email e senha usando o Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailNormalizado,
      password: password.value,
    });

    if (error) {
      console.error("Erro de login:", error);

      // Tratamento de erros específicos
      if (error.message.includes("Invalid login credentials")) {
        erro.value =
          "Email ou senha inválidos.";
      } else if (error.message.includes("Email not confirmed")) {
        erro.value =
          "Email não foi confirmado. Verifique sua caixa de entrada ou desative a confirmação de email no Supabase.";
      } else if (error.message.includes("Too many requests")) {
        erro.value = "Muitas tentativas. Tente novamente depois";
      } else {
        erro.value = error.message || "Erro ao fazer login";
      }
      loading.value = false;
      return;
    }

    // Se o login for bem-sucedido, redireciona para o dashboard
    if (data?.session) {
      router.push("/dashboard");
    }
  } catch (erroCatch) {
    console.error("Erro inesperado:", erroCatch);
    erro.value = "Erro inesperado. Tente novamente mais tarde";
    loading.value = false;
  }
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
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            v-model="email"
          />
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha"
            v-model="password"
          />
          <div class="container-buttons">
            <button class="submit" @click="login" :disabled="loading">
              {{ loading ? "Entrando..." : "Entrar" }}
            </button>
          </div>
          <p v-if="erro" class="error-message">{{ erro }}</p>
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
  background-image: url("../assets/icons_login/email.png");
}

#password {
  background-image: url("../assets/icons_login/password.png");
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
  width: 100%;
  margin: 0 auto;
  justify-content: space-between;
}

.submit {
  background-color: var(--color-blue-dark);
  color: #ffffff;
  border: none;
  padding: 12px 50px;
  width: 100%;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
}

.submit:hover {
  box-shadow: 0px 4px 15px rgba(10, 9, 90, 0.9);
}

/* ══════════════════════════════════════════
   RESPONSIVE - TABLET
══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .page {
    background: linear-gradient(
      to right,
      var(--color-blue-dark) 0%,
      var(--color-blue-dark) 45%,
      #ffffff 100%
    );
  }

  .container {
    width: 95%;
    height: 75%;
  }

  .container img {
    width: 50%;
  }

  .title {
    font-size: 2rem;
  }

  .content form {
    width: 85%;
  }
}

/* ══════════════════════════════════════════
   RESPONSIVE - TABLET MÉDIO
══════════════════════════════════════════ */
@media (max-width: 768px) {
  .page {
    background: linear-gradient(
      180deg,
      var(--color-blue-dark) 0%,
      var(--color-blue-dark) 50%,
      #ffffff 100%
    );
  }

  .container {
    width: 90%;
    height: auto;
    flex-direction: column;
    margin: 20px auto;
  }

  .container img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 23px 23px 0px 0px;
  }

  .content {
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
  }

  .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .content form {
    width: 100%;
    gap: 12px;
  }

  .content form label {
    font-size: 0.95rem;
  }

  .content form input {
    padding: 12px;
    padding-right: 40px;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .container-buttons {
    width: 100%;
    gap: 8px;
  }

  .submit {
    flex: 1;
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
@media (max-width: 600px) {
  .page {
    height: auto;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 90%;
    display: flex;
    border-radius: 16px;
    margin: 0 auto;
    flex-direction: column;
    box-shadow: none;
  } 

  .container img {
    display: none;
  }

  .content {
    width: 100%;
    padding: 35px 25px;
    box-sizing: border-box;
  }

  .back-button {
    top: 15px;
    left: 15px;
    font-size: 1.6rem;
  }

  .title {
    font-size: 1.7rem;
    margin-bottom: 25px;
  }

  .content form {
    width: 100%;
    gap: 12px;
  }

  .content form label {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .content form input {
    padding: 12px;
    padding-right: 38px;
    font-size: 0.9rem;
    margin-bottom: 0;
    background-size: 18px 18px;
  }

  .container-buttons {
    width: 100%;
    gap: 10px;
    margin: 20px 0 0 0;
    justify-content: space-between;
  }

  .submit {
    flex: 1;
    padding: 12px 20px;
    font-size: 0.95rem;
    border-radius: 18px;
  }

  .error-message {
    font-size: 0.85rem;
    margin-top: 15px;
  }
}

/* ══════════════════════════════════════════
   RESPONSIVE - MOBILE MÉDIO
══════════════════════════════════════════ */
@media (max-width: 480px) {
  .page {
    height: auto;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 90%;
    display: flex;
    border-radius: 16px;
    margin: 0 auto;
    flex-direction: column;
    box-shadow: none;
  }

  .container img {
    display: none;
  }

  .content {
    width: 100%;
    padding: 40px 20px;
    box-sizing: border-box;
  }

  .back-button {
    top: 15px;
    left: 15px;
    font-size: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
    margin-bottom: 25px;
    text-align: center;
  }

  .content form {
    width: 100%;
    gap: 15px;
  }

  .content form label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  .content form input {
    padding: 10px;
    padding-right: 38px;
    font-size: 0.9rem;
    margin-bottom: 0;
    background-size: 18px 18px;
    background-position: right 12px center;
    border: 1px solid #ddd;
  }

  .container-buttons {
    width: 100%;
    gap: 10px;
    margin: 20px 0 0 0;
    justify-content: center;
    flex-direction: row;
  }

  .submit {
    flex: 1;
    padding: 12px 20px;
    font-size: 0.95rem;
    border-radius: 18px;
    min-width: 120px;
  }

  .error-message {
    font-size: 0.85rem;
    margin-top: 15px;
    text-align: center;
    color: #d32f2f;
  }
}

/* ══════════════════════════════════════════
   RESPONSIVE - MOBILE PEQUENO
══════════════════════════════════════════ */
@media (max-width: 360px) {
  .container {
    width: 90%;
    margin: 0;
  }

  .container img {
    display: none;
  }

  .content {
    padding: 35px 16px;
    box-sizing: border-box;
  }

  .back-button {
    font-size: 1.3rem;
    top: 12px;
    left: 12px;
  }

  .title {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  .content form {
    gap: 12px;
  }

  .content form label {
    font-size: 0.85rem;
  }

  .content form input {
    padding: 10px;
    padding-right: 32px;
    font-size: 0.85rem;
    background-size: 16px 16px;
  }

  .container-buttons {
    gap: 8px;
    margin-top: 15px;
  }

  .submit {
    padding: 10px 14px;
    font-size: 0.9rem;
    border-radius: 16px;
  }

  .error-message {
    font-size: 0.8rem;
    margin-top: 10px;
  }
}
</style>