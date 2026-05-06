<!-- Landing Page - primeira página ao acessar nosso site -->
<script>
import HeaderTemplate from "../components/Header.vue";
import FooterTemplate from "../components/Footer.vue";

export default {
  components: { HeaderTemplate, FooterTemplate },
  data() {
    return {
      openAccordion: 0,
      accordionItems: [
        {
          title: "Nossa Missão",
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
        {
          title: "Nossa Visão",
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
        {
          title: "Nosso Valor",
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
      ],
    };
  },
  methods: {
    toggleAccordion(index) {
      this.openAccordion = this.openAccordion === index ? -1 : index;
    },
  },
};
</script>

<template>
  <HeaderTemplate />

  <div class="body">
    <!-- ── Banner ──────────────────────────────── -->
    <section id="home" class="nav_home">
      <img
        src="../assets/banner/pexels-clickerhappy-38070.jpg"
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
        <div class="bnr_divider"></div>
        <div class="bnr_dir">
          <p class="texto_dir_bnr">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
          <router-link class="acc_ent" to="/login">Acesse sua conta</router-link>
        </div>
      </div>
    </section>

    <!-- ── About ───────────────────────────────── -->
    <section id="about" class="nav_about">
      <div class="about-grid-container">
        <div class="col-text">
          <span class="badge">Sobre</span>
          <h2 class="main-title">Rastreabilidade <br />Completa dos Produtos</h2>
          <p class="description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
          <button class="btn-account">Acesse sua Conta</button>
        </div>

        <div class="col-image">
          <img src="../assets/banner/pexels-sergey-sergeev-2153675005-32845692 2.png" alt="Trabalhador Industrial" />
        </div>

        <div class="col-accordion">
          <div
            v-for="(item, index) in accordionItems"
            :key="index"
            class="acc-item"
            :class="{ active: openAccordion === index }"
            @click="toggleAccordion(index)"
          >
            <div class="acc-header">
              <span>{{ item.title }}</span>
              <span class="acc-icon" :class="{ rotated: openAccordion === index }">▼</span>
            </div>
            <p class="acc-content" v-show="openAccordion === index">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Contact ─────────────────────────────── -->
    <section id="contact" class="nav_contact">
      <div class="contact-body">
        <div class="contact-left">
          <div class="contact-header">
            <span class="badge">Contato</span>
            <h2>Entre em Contato</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting.</p>
          </div>

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
              <h4>Suporte</h4>
              <p>Lorem Ipsum is simply dummy text of the</p>
            </div>
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
              <input type="email" id="email" placeholder="Enter your email...." />
            </div>
          </div>

          <div class="form-group form-group-full">
            <label for="assunto">Assunto</label>
            <div class="select-wrapper">
              <select id="assunto">
                <option value="" disabled selected>Selecione um assunto...</option>
                <option value="duvida">Dúvida sobre EPI</option>
                <option value="suporte">Suporte Técnico</option>
                <option value="parceria">Parceria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div class="form-group form-group-full">
            <label for="mensagem">Mensagem</label>
            <textarea id="mensagem" placeholder="Leave your message...."></textarea>
          </div>

          <button class="btn-submit" type="button">Enviar Mensagem</button>
        </div>
      </div>
    </section>
  </div>

  <FooterTemplate />
</template>

<style>
/* ── Base section layout ─────────────────── */
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: unset;
  height: auto;
}

/* ══════════════════════════════════════════
   BANNER
══════════════════════════════════════════ */
.nav_home {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding: 0;
  justify-content: center;
  align-items: center;
}

.bnr_img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.bnr_desc {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 85%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 24px;
  padding: 48px 52px;
  gap: 32px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
}

.bnr_divider {
  width: 1px;
  align-self: stretch;
  background: #e0e4ea;
  flex-shrink: 0;
}

.bnr_esq {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.titulo_inf {
  background-color: #fde8b8;
  border-radius: 8px;
  color: #c47c00;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 6px 16px;
}

.titulo_inf p {
  margin: 0;
}

.texto_esq_bnr {
  font-family: var(--font-primary);
  font-size: clamp(1.5rem, 2.8vw, 2.2rem);
  line-height: 1.25;
  margin: 0;
  color: #1a1a2e;
}

.bnr_dir {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1;
}

.texto_dir_bnr {
  font-family: var(--font-secondary);
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  margin: 0;
}

.acc_ent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #2b4a69;
  color: white;
  text-decoration: none;
  border-radius: 90px;
  padding: 14px 36px;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
}

.acc_ent:hover {
  background: #3d6a8a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(43, 74, 105, 0.35);
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
.nav_about {
  background: #fff;
  padding: 80px 5%;
  align-items: stretch;
}

.about-grid-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  background-color: #fde8b8;
  color: #c47c00;
  font-size: 0.88rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.main-title {
  font-family: var(--font-primary);
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  color: #1a1a2e;
  margin: 0 0 20px;
  line-height: 1.2;
}

.description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 32px;
}

.btn-account {
  background-color: #2b4a69;
  color: white;
  padding: 14px 36px;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-secondary);
  transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
}

.btn-account:hover {
  background: #3d6a8a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(43, 74, 105, 0.3);
}

.col-image img {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: block;
}

.acc-item {
  background: #fff;
  border: 1.5px solid #eee;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.acc-item:last-child {
  margin-bottom: 0;
}

.acc-item:hover:not(.active) {
  border-color: #c5d8ee;
  box-shadow: 0 4px 16px rgba(43, 74, 105, 0.1);
}

.acc-item.active {
  background: #2b4a69;
  border-color: #2b4a69;
  color: white;
}

.acc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.acc-icon {
  display: inline-block;
  font-size: 0.7rem;
  opacity: 0.6;
  transition: transform 0.3s ease, opacity 0.3s;
}

.acc-icon.rotated {
  transform: rotate(-180deg);
  opacity: 1;
}

.acc-content {
  margin: 12px 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.88;
}

/* ══════════════════════════════════════════
   CONTACT
══════════════════════════════════════════ */
.nav_contact {
  background: #f0f2f5;
  padding: 80px 5%;
}

.contact-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-header {
  text-align: left;
  width: 100%;
}

.contact-header h2 {
  font-family: var(--font-primary);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: #1a1a2e;
  font-weight: 400;
  margin: 8px 0;
  line-height: 1;
}

.contact-header p {
  font-family: var(--font-secondary);
  font-size: 1rem;
  color: #666;
  max-width: 360px;
  line-height: 1.6;
  margin: 0;
}

.contact-body {
  display: grid;
  grid-template-columns: 0.55fr 1.8fr;
  gap: 36px;
  width: 100%;
  max-width: 1200px;
  align-items: start;
}

.why-card {
  background: #2b4a69;
  border-radius: 20px;
  padding: 28px;
  color: #fff;
}
 
.why-card h3 {
  font-family: var(--font-secondary);
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 22px;
  text-align: center;
  line-height: 1.1;
}

.why-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.why-item:last-child {
  margin-bottom: 0;
}

.why-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.why-icon .material-icons {
  font-size: 20px;
  color: #adc4e8;
}

.why-text h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
}

.why-text p {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
}

.form-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px;
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
  font-size: 0.9rem;
  font-weight: 700;
  color: #343434;
}

.form-group input,
.form-group select,
.form-group textarea {
  font-size: 0.875rem;
  color: #343434;
  background: #f8f9fc;
  border: 1.5px solid #dde2ea;
  border-radius: 8px;
  padding: 12px 14px;
  outline: none;
  appearance: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2b4a69;
  box-shadow: 0 0 0 3px rgba(43, 74, 105, 0.1);
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
  top: 42%;
  width: 7px;
  height: 7px;
  border-right: 2px solid #999;
  border-bottom: 2px solid #999;
  transform: rotate(45deg);
  pointer-events: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.btn-submit {
  display: block;
  margin-left: 0;
  margin-top: 8px;
  padding: 14px 36px;
  background: #2b4a69;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
}

.btn-submit:hover {
  background: #3d6a8a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(43, 74, 105, 0.3);
}

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */

/* Tablet large: about vai para 2 colunas */
@media (max-width: 1100px) {
  .about-grid-container {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .col-accordion {
    grid-column: span 2;
  }
}

/* Tablet: contact body empilha */
@media (max-width: 900px) {
  .contact-body {
    grid-template-columns: 1fr;
  }

  .contact-left {
    gap: 16px;
  }

  .why-card {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px 24px;
  }

  .why-card h3 {
    grid-column: span 3;
    margin-bottom: 4px;
  }

  .why-item {
    margin-bottom: 0;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .nav_home {
    height: 100svh;
  }

  .bnr_desc {
    flex-direction: column;
    width: 90%;
    padding: 32px 28px;
    gap: 0;
  }

  .bnr_esq,
  .bnr_dir {
    width: 100%;
    align-items: center;
    text-align: center;
    padding: 20px 0;
  }

  .bnr_divider {
    width: 80%;
    height: 1px;
    align-self: center;
  }

  .texto_esq_bnr {
    text-align: center;
  }

  .about-grid-container {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .col-accordion {
    grid-column: span 1;
  }

  .col-image {
    order: -1;
  }

  .why-card {
    display: block;
  }

  .why-card h3 {
    margin-bottom: 16px;
  }

  .why-item {
    margin-bottom: 14px;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .nav_home {
    height: 100dvh;
  }

  .bnr_desc {
    width: 92%;
    padding: 24px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: 4px 20px;
  }

  .acc-item {
    padding: 16px 18px;
  }

  .btn-submit {
    width: 100%;
    margin-left: 0;
  }
}
</style>
