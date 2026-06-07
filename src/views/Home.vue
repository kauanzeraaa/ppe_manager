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
          text: "Simplificar e otimizar o gerenciamento de equipamentos de proteção individual, garantindo que profissionais tenham acesso rápido e seguro aos EPIs necessários para sua proteção.",
        },
        {
          title: "Nossa Visão",
          text: "Ser a solução líder em gerenciamento de EPIs, contribuindo para reduzir acidentes de trabalho e promover ambientes laborais mais seguros em toda a região.",
        },
        {
          title: "Nosso Valor",
          text: "Segurança em primeiro lugar, inovação contínua, transparência total e compromisso com a excelência em cada aspecto do gerenciamento de equipamentos de proteção.",
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
            Controle total sobre seu estoque de EPIs. Rastreie cada equipamento, monitore prazos de validade, gere relatórios em tempo real e garanta conformidade com normas de segurança.
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
            Saiba exatamente onde está cada equipamento, quem o retirou, quando foi utilizado e quando chegará o prazo de validade. Nosso sistema oferece transparência total com um histórico completo de movimentações.
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
            <p>Tem dúvidas sobre como implementar o PPE Manager? Quer saber mais sobre nossas funcionalidades? Fale conosco!</p>
          </div>

        <div class="why-card">
          <h3>Por que entrar em contato?</h3>

          <div class="why-item">
            <div class="why-icon">
              <span class="material-icons">chat</span>
            </div>
            <div class="why-text">
              <h4>Tire Dúvidas</h4>
              <p>Esclareça suas dúvidas sobre como usar o sistema, implementar em sua empresa ou aproveitar todas as funcionalidades disponíveis.</p>
            </div>
          </div>

          <div class="why-item">
            <div class="why-icon">
              <span class="material-icons">help</span>
            </div>
            <div class="why-text">
              <h4>Suporte Técnico</h4>
              <p>Encontrou algum problema? Nossa equipe está pronta para ajudar você a resolver qualquer dificuldade.</p>
            </div>
          </div>
        </div>
        </div>

        <div class="form-card">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input type="text" id="nome" placeholder="Seu nome completo" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="seu.email@exemplo.com" />
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
            <textarea id="mensagem" placeholder="Descreva sua dúvida ou solicitação aqui..."></textarea>
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
  font-size: clamp(1.25rem, 5vw, 2.2rem);
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
  padding: 60px 5%;
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
  grid-template-columns: 1fr 1.8fr;
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

  /* Contact Section */
  .contact-body {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .contact-left {
    gap: 20px;
  }
}



/* Tablet médio */
@media (max-width: 820px) {
  .bnr_desc {
    width: 88%;
    padding: 36px 32px;
    gap: 24px;
  }

  .titulo_inf {
    font-size: 0.8rem;
    padding: 5px 14px;
  }

  .texto_dir_bnr {
    font-size: 0.9rem;
  }

  .acc_ent {
    padding: 12px 32px;
    font-size: 0.9rem;
  }

  .main-title {
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  }

  .why-card {
    grid-template-columns: 1fr 1fr;
  }

  /* Contact Section */
  .contact-body {
    gap: 28px;
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .why-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .why-card h3 {
    font-size: 0.95rem;
    margin-bottom: 8px;
  }

  .form-card {
    padding: 28px;
  }
}

/* Mobile grande */
@media (max-width: 768px) {
  section {
    padding: 60px 20px;
  }

  .nav_home {
    height: 100svh;
  }

  .bnr_desc {
    flex-direction: column;
    width: 92%;
    padding: 28px 24px;
    gap: 16px;
    border-radius: 16px;
  }

  .bnr_esq,
  .bnr_dir {
    width: 100%;
    align-items: center;
    text-align: center;
    padding: 12px 0;
  }

  .bnr_divider {
    width: 60%;
    height: 1px;
    align-self: center;
    margin: 4px 0;
  }

  .titulo_inf {
    font-size: 0.75rem;
  }

  .texto_esq_bnr {
    font-size: clamp(1.2rem, 6vw, 1.8rem);
  }

  .texto_dir_bnr {
    font-size: 0.85rem;
    line-height: 1.6;
    max-width: 90%;
  }

  .acc_ent {
    padding: 12px 28px;
    font-size: 0.85rem;
    width: 100%;
    max-width: 280px;
  }

  /* About Section */
  .nav_about {
    padding: 60px 20px;
  }

  .about-grid-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .col-accordion {
    grid-column: span 1;
  }

  .col-image {
    order: -1;
  }

  .col-image img {
    max-height: 300px;
    object-fit: cover;
  }

  .main-title {
    font-size: clamp(1.4rem, 5vw, 2rem);
    margin-bottom: 16px;
  }

  .description {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .btn-account {
    width: 100%;
    padding: 12px 24px;
    font-size: 0.85rem;
  }

  .acc-item {
    padding: 16px 18px;
    margin-bottom: 12px;
    font-size: 0.9rem;
  }

  .acc-header {
    font-size: 0.9rem;
  }

  .acc-content {
    font-size: 0.8rem;
    margin-top: 10px;
  }

  /* Contact Section */
  .nav_contact {
    padding: 60px 20px;
  }

  .contact-header h2 {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    margin: 8px 0;
  }

  .contact-header p {
    font-size: 0.95rem;
    max-width: 100%;
  }

  .contact-body {
    gap: 32px;
    grid-template-columns: 1fr;
  }

  .contact-left {
    gap: 24px;
  }

  .why-card {
    padding: 24px;
    border-radius: 16px;
  }

  .why-card h3 {
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  .why-item {
    gap: 12px;
    margin-bottom: 16px;
  }

  .why-icon {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .why-icon .material-icons {
    font-size: 20px;
  }

  .why-text h4 {
    font-size: 0.85rem;
  }

  .why-text p {
    font-size: 0.8rem;
  }

  .form-card {
    padding: 28px;
    border-radius: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 0.9rem;
    padding: 12px 14px;
    border-radius: 8px;
  }

  .form-group textarea {
    min-height: 120px;
  }

  .btn-submit {
    padding: 12px 24px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
}

/* Mobile médio */
@media (max-width: 600px) {
  section {
    padding: 50px 16px;
  }

  .nav_home {
    height: 100dvh;
  }

  .bnr_desc {
    width: 95%;
    padding: 24px 20px;
    gap: 12px;
  }

  .bnr_esq,
  .bnr_dir {
    padding: 8px 0;
  }

  .titulo_inf {
    font-size: 0.7rem;
    padding: 4px 12px;
  }

  .texto_esq_bnr {
    font-size: clamp(1.1rem, 7vw, 1.6rem);
    line-height: 1.3;
  }

  .texto_dir_bnr {
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .acc_ent {
    padding: 10px 24px;
    font-size: 0.8rem;
    max-width: 260px;
  }

  .main-title {
    font-size: clamp(1.2rem, 5.5vw, 1.8rem);
    margin-bottom: 12px;
  }

  .description {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .btn-account {
    width: 100%;
    padding: 10px 20px;
    font-size: 0.8rem;
  }

  .badge {
    font-size: 0.75rem;
    padding: 4px 12px;
    margin-bottom: 12px;
  }

  /* Contact Section */
  .nav_contact {
    padding: 50px 16px;
  }

  .contact-header h2 {
    font-size: clamp(1.4rem, 5vw, 1.8rem);
    margin: 6px 0;
  }

  .contact-header p {
    font-size: 0.9rem;
    max-width: 100%;
  }

  .contact-body {
    gap: 24px;
  }

  .contact-left {
    gap: 16px;
  }

  .why-card {
    padding: 20px;
    border-radius: 14px;
    gap: 12px;
  }

  .why-card h3 {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .why-item {
    gap: 12px;
    margin-bottom: 12px;
  }

  .why-item:last-child {
    margin-bottom: 0;
  }

  .why-icon {
    width: 34px;
    height: 34px;
    min-width: 34px;
  }

  .why-icon .material-icons {
    font-size: 18px;
  }

  .why-text h4 {
    font-size: 0.8rem;
  }

  .why-text p {
    font-size: 0.75rem;
  }

  .form-card {
    padding: 20px;
    border-radius: 14px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  .form-group label {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 0.85rem;
    padding: 10px 12px;
    border-radius: 6px;
  }

  .form-group-full {
    margin-bottom: 14px;
  }

  .form-group textarea {
    min-height: 100px;
  }

  .btn-submit {
    width: 100%;
    padding: 10px 16px;
    font-size: 0.85rem;
    border-radius: 6px;
    margin-top: 4px;
  }

  .select-wrapper::after {
    width: 6px;
    height: 6px;
    border-right: 1.5px solid #999;
    border-bottom: 1.5px solid #999;
    right: 10px;
    top: 42%;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  section {
    padding: 40px 12px;
  }

  .nav_home {
    height: 100dvh;
  }

  .bnr_img {
    max-height: 450px;
  }

  .bnr_desc {
    width: 85%;
    padding: 20px 16px;
    gap: 10px;
    border-radius: 12px;
    margin-top: -150px;
  }

  .bnr_esq,
  .bnr_dir {
    gap: 1rem;
    padding: 4px 0;
  }

  .titulo_inf {
    font-size: 0.65rem;
    padding: 3px 10px;
  }

  .titulo_inf p {
    margin: 0;
  }

  .texto_esq_bnr {
    font-size: clamp(1rem, 6.5vw, 1.5rem);
    line-height: 1.2;
    margin: 0;
  }

  .texto_dir_bnr {
    font-size: 0.75rem;
    line-height: 1.4;
    margin: 0;
  }

  .bnr_divider {
    width: 50%;
    height: 0.8px;
    margin: 2px 0;
  }

  .acc_ent {
    padding: 9px 20px;
    font-size: 0.75rem;
    border-radius: 50px;
    max-width: 240px;
  }

  /* About */
  .nav_about {
    padding: 40px 12px;
    margin-top: -160px;
  }

  .col-image img {
    max-height: 200px;
    object-fit: cover;
  }

  .about-grid-container {
    gap: 28px;
  }

  .main-title {
    font-size: clamp(1rem, 6vw, 1.6rem);
    margin-bottom: 10px;
  }

  .description {
    font-size: 0.8rem;
    margin-bottom: 18px;
    line-height: 1.6;
  }

  .btn-account {
    padding: 9px 18px;
    font-size: 0.75rem;
  }

  .acc-item {
    padding: 14px 14px;
    margin-bottom: 10px;
    border-radius: 12px;
    font-size: 0.85rem;
  }

  .acc-header {
    font-size: 0.85rem;
  }

  .acc-icon {
    font-size: 0.6rem;
  }

  .acc-content {
    font-size: 0.75rem;
    margin-top: 8px;
  }

  /* Contact */
  .nav_contact {
    padding: 40px 12px;
  }

  .contact-header h2 {
    font-size: clamp(1rem, 5.5vw, 1.6rem);
    margin-bottom: 6px;
  }

  .contact-header p {
    font-size: 0.8rem;
    margin: 8px 0 0;
  }

  .badge {
    font-size: 0.7rem;
    padding: 3px 10px;
  }

  .contact-body {
    gap: 20px;
    grid-template-columns: 1fr;
  }

  .contact-left {
    gap: 12px;
  }

  .contact-header h2 {
    font-size: clamp(1rem, 5.5vw, 1.6rem);
    margin-bottom: 6px;
  }

  .contact-header p {
    font-size: 0.8rem;
    margin: 8px 0 0;
  }

  .why-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
  }

  .why-card h3 {
    font-size: 0.85rem;
    margin-bottom: 10px;
  }

  .why-item {
    gap: 10px;
    margin-bottom: 10px;
  }

  .why-icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }

  .why-icon .material-icons {
    font-size: 18px;
  }

  .why-text h4 {
    font-size: 0.75rem;
    margin: 0 0 2px;
  }

  .why-text p {
    font-size: 0.65rem;
    margin: 0;
  }

  .form-card {
    padding: 16px 12px;
    border-radius: 12px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-group label {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 0.75rem;
    padding: 8px 10px;
    border-radius: 6px;
  }

  .form-group textarea {
    min-height: 90px;
  }

  .form-group-full {
    margin-bottom: 12px;
  }

  .btn-submit {
    width: 100%;
    padding: 10px 16px;
    font-size: 0.75rem;
    margin-top: 2px;
    border-radius: 6px;
  }

  .select-wrapper::after {
    width: 6px;
    height: 6px;
    border-right: 1.5px solid #999;
    border-bottom: 1.5px solid #999;
    right: 12px;
    top: 40%;
  }

  .form-group textarea {
    min-height: 90px;
  }

  .form-group-full {
    margin-bottom: 12px;
  }

  .btn-submit {
    width: 100%;
    padding: 10px 16px;
    font-size: 0.75rem;
    margin-top: 2px;
    border-radius: 6px;
  }

  .select-wrapper::after {
    width: 6px;
    height: 6px;
    border-right: 1.5px solid #999;
    border-bottom: 1.5px solid #999;
    right: 12px;
    top: 40%;
  }
}
</style>