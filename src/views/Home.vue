<!-- Landing Page - primeira página ao acessar nosso site -->
<script>
import HeaderTemplate from "../components/Header.vue";
import FooterTemplate from "../components/Footer.vue";

export default {
  components: {
    HeaderTemplate,
    FooterTemplate,
  },
};
</script>

<template>
  <!-- Header importada dos components -->
  <HeaderTemplate />

  <div class="body">
    <!-- Section "Home" - aqui é a parte do Miguel, coloquei essa section para, ao clicar em "Home", a tela scrollar pra cima -->
    <section id="home" class="nav_home">
      <img
        src="../assets/banner/Banner_Image.png"
        class="bnr_img"
        alt="Home Banner"
      />
      <div class="bnr_desc">
        <div class="bnr_esq">
          <div class="titulo_inf">
            <p>Equipamento de Proteção Individual</p>
          </div>
          <h1 class="texto_esq_bnr">
            Faça o Gerenciamento do Seu Estoque de EPIs
          </h1>
        </div>
        <div class="bnr_dir">
          <p class="texto_dir_bnr">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s text ever since the 1500s
          </p>
          <router-link class="acc_ent" to="/login">
            Acesse sua conta
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section "Our Services" -->
    <section id="about" class="nav_about">
  <div class="about-header">
    <span class="badge">Sobre</span>
    <h1 class="services">Rastreabilidade Completa dos Produtos</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
  </div>

  <div class="about-body">
    <div class="about-content">
      <button class="btn-account">Acesse sua Conta</button>
    </div>

    <div class="about-image">
      <img src="../assets/sua-imagem.png" alt="Trabalhador">
    </div>

    <div class="about-accordion">
      </div>
  </div>
</section>

    <!-- Section "Contact" -->
    <section id="contact" class="nav_contact">
      <div class="contact-header">
        <span class="badge">Contato</span>
        <h1>Entre em Contato</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting.</p>
      </div>

      <div class="contact-body">
        <div class="why-card">
          <h3>Por que entrar em contato?</h3>

          <div class="why-item">
            <div class="why-icon">
              <span class="material-icons">chat</span>
            </div>
            <div class="why-text">
              <h4>Tire Dúvidas</h4>
              <p>Lorem Ipsum is simply dummy text of the prin</p>
            </div>
          </div>

          <div class="why-item">
            <div class="why-icon">
              <span class="material-icons">help</span>
            </div>
            <div class="why-text">
              <h4>Tire Dúvidas</h4>
              <p>Lorem Ipsum is simply dummy text of the prin</p>
            </div>
          </div>

          <div class="why-item">
            <div class="why-icon">
              <span class="material-icons">email</span>
            </div>
            <div class="why-text">
              <h4>Tire Dúvidas</h4>
              <p>Lorem Ipsum is simply dummy text of the prin</p>
            </div>
          </div>
        </div>

        <div class="form-card">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input type="text" id="nome" placeholder="Enter your name...." />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email...."
              />
            </div>
          </div>

          <div class="form-group form-group-full">
            <label for="assunto">Assunto</label>
            <div class="select-wrapper">
              <select id="assunto">
                <option value="" disabled selected>
                  Selecione um assunto...
                </option>
                <option value="duvida">Dúvida sobre EPI</option>
                <option value="suporte">Suporte Técnico</option>
                <option value="parceria">Parceria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div class="form-group form-group-full">
            <label for="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              placeholder="Leave your message...."
            ></textarea>
          </div>

          <button class="btn-submit" type="button">Enviar Mensagem</button>
        </div>
      </div>
    </section>
  </div>
  <FooterTemplate />
</template>

<style>
.nav_home {
  padding: 0;
}

/* temporario apenas pra teste visual */
section {
  height: 100vh;
  padding: 20px;
}

.bnr_img {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 100%;
}

.bnr_desc {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  height: 250px;
  width: 80%;
  background-color: #ffffff;
  border-radius: 30px;
  bottom: 61%;
  margin: auto;
}

.bnr_esq {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: large;
  gap: 5px;
  width: 50%;
}

.bnr_dir {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
}

.titulo_inf {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8bb7387;
  border-radius: 10px;
  color: #f39c12;
  width: 400px;
  margin-top: 15px;
}

.texto_esq_bnr {
  font-family: var(--font-primary);
  text-align: center;
  width: 70%;
}

.texto_dir_bnr {
  font-family: var(--font-secondary);
  text-align: center;
  width: 50%;
}

.acc_ent {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2B4A69;
  color: white;
  text-decoration: none;
  border-radius: 90px;
  height: 50px;
  width: 250px;
}

/* ── Contact ── */
.contact-header h1 {
  font-family: var(--font-primary);
  font-size: clamp(1.8rem, 3vw, 2.9rem);
  color: #383838;
  font-weight: 400;
  margin-bottom: 10px;
}

.contact-header p {
  font-family: var(--font-secondary);
  font-size: 1.2rem;
  color: #383838;
  max-width: 300px;
  line-height: 1.4;
  margin-bottom: 10px;
}

.nav_contact {
  background: #f0f2f5;
  padding: 60px 5% 30px;
  height: auto; /* ----- Faz a altura se ajustar ao conteúdo*/
}

.contact-body {
  display: grid;
  grid-template-columns: 0.6fr 1.8fr;
  gap: 60px;
  align-items: flex-end;
}

.why-card {
  background: #2B4A69;
  border-radius: 25px;
  padding: 10px 30px;
  color: #fff;
}

.why-card h3 {
  font-family: var(--font-secondary);
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-align: center;
}

.why-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.why-item:last-child {
  margin-bottom: 0;
}

.why-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.why-icon .material-icons {
  font-size: 22px;
  color: #adc4e8;
}

.why-text h4 {
  font-size: 0.89rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 2px;
}

.why-text p {
  font-size: 0.75rem;
  color: #ffffff;
  line-height: 1.4;
  max-width: 160px;
}

.form-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 36px 34px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group-full {
  margin-bottom: 20px;
}

.form-group label {
  font-family: var(--font-secondary);
  font-size: 1.2rem;
  font-weight: 700;
  color: #343434;
}

.form-group input,
.form-group select,
.form-group textarea {
  font-size: 0.85rem;
  color: #343434;
  background: #f8f9fc;
  border: 1.5px solid #dde2ea;
  border-radius: 8px;
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #1b2d4f;
  box-shadow: 0 0 0 3px rgba(27, 45, 79, 0.08);
  background: #fff;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #bfc6d0;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  cursor: pointer;
  padding-right: 38px;
}

.select-wrapper::after {
  content: "";
  position: absolute;
  right: 14px;
  top: 40%;
  width: 8px;
  height: 8px;
  border-right: 2px solid #aaa;
  border-bottom: 2px solid #aaa;
  transform: rotate(45deg);
  pointer-events: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 110px;
}

.btn-submit {
  display: block;
  margin-left: auto;
  margin-top: 8px;
  padding: 13px 34px;
  background: #2B4A69;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #3d6a8a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.badge {
  display: inline-block;
  background: #fde8b8;
  color: #c47c00;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 6px;
  margin-bottom: 18px;
}

@media (max-width: 768px) {
  .nav_contact {
    padding: 40px 5% 60px;
  }

  .contact-body {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: 24px 20px;
  }
}

.about-header {
  text-align: center; /* Centraliza o cabeçalho igual ao "Contato" */
  margin-bottom: 40px;
}

.about-body {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Divide em 3 colunas iguais */
  gap: 20px;
  align-items: center;
}

/* Garante que no mobile elas fiquem uma abaixo da outra, 
seguindo o padrão que você já tem no VS Code */
@media (max-width: 768px) {
  .about-body {
    grid-template-columns: 1fr;
  }
}
</style>