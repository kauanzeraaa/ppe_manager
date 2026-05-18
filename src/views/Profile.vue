<script setup>

/* =========================================================
   MOCK USER
========================================================= */

const usuario = {

  nome: 'Simone Queiroz',

  cargo: 'Técnica de Informática',

  email: 'simone@epicontrol.com',

  setor: 'TI Industrial',

  perfil: 'Administrador'

}

/* =========================================================
   EPIS
========================================================= */

const epis = [

  {
    nome: 'Capacete',
    status: 'Ativo'
  },

  {
    nome: 'Luva de proteção',
    status: 'Vencendo'
  },

  {
    nome: 'Óculos',
    status: 'Ativo'
  }

]

/* =========================================================
   HISTÓRICO
========================================================= */

const historico = [

  {
    data: 'Hoje',
    acao: 'Atualização de senha'
  },

  {
    data: 'Ontem',
    acao: 'Entrega de EPI registrada'
  },

  {
    data: '14/05',
    acao: 'Login realizado'
  }

]

</script>

<template>

  <div class="profile-page">

    <!-- HEADER -->

   <header class="profile-hero">

  <!-- ESQUERDA -->

  <div class="hero-main">

    <div class="avatar">
      SQ
    </div>

    <div class="hero-content">

      <span class="badge">
        Perfil
      </span>

      <h1 class="title">
        {{ usuario.nome }}
      </h1>

      <p class="subtitle">
        {{ usuario.cargo }}
      </p>

      <div class="hero-tags">

        <span class="hero-tag">
          {{ usuario.setor }}
        </span>

        <span class="hero-tag">
          {{ usuario.perfil }}
        </span>

        <span class="hero-tag active">
          Conta ativa
        </span>

      </div>

    </div>

  </div>

  <!-- DIREITA -->

  <aside class="hero-side">

    <div class="hero-side-item">

      <small>
        Último acesso
      </small>

      <strong>
        Hoje às 08:42
      </strong>

    </div>

    <div class="hero-side-item">

      <small>
        EPIs vinculados
      </small>

      <strong>
        3 ativos
      </strong>

    </div>

    <div class="hero-side-item">

      <small>
        Conformidade
      </small>

      <strong class="status-ok-text">
        Regular
      </strong>

    </div>

  </aside>

</header>

    <!-- INFO GRID -->

    <div class="profile-grid">

      <!-- DADOS -->

      <section class="profile-card">

        <div class="card-header">

          <h2>
            Dados da Conta
          </h2>

          <p>
            Informações cadastradas no sistema.
          </p>

        </div>

        <div class="info-list">

          <div class="info-item">

            <small>E-mail</small>

            <strong>
              {{ usuario.email }}
            </strong>

          </div>

          <div class="info-item">

            <small>Setor</small>

            <strong>
              {{ usuario.setor }}
            </strong>

          </div>

          <div class="info-item">

            <small>Perfil de acesso</small>

            <strong>
              {{ usuario.perfil }}
            </strong>

          </div>

        </div>

      </section>

      <!-- SEGURANÇA -->

      <section class="profile-card">

        <div class="card-header">

          <h2>
            Segurança
          </h2>

          <p>
            Controle de acesso da conta.
          </p>

        </div>

        <div class="security-actions">

          <button class="btn-secondary">
            Alterar senha
          </button>

          <button class="btn-secondary">
            Encerrar sessões
          </button>

        </div>

      </section>

    </div>

    <!-- EPIS -->

    <section class="profile-card">

      <div class="card-header">

        <h2>
          EPIs vinculados
        </h2>

        <p>
          Equipamentos associados ao usuário.
        </p>

      </div>

      <div class="epi-list">

        <div
          v-for="epi in epis"
          :key="epi.nome"
          class="epi-item"
        >

          <strong>
            {{ epi.nome }}
          </strong>

          <span
            :class="[
              'epi-status',
              epi.status === 'Ativo'
                ? 'status-ok'
                : 'status-warning'
            ]"
          >
            {{ epi.status }}
          </span>

        </div>

      </div>

    </section>

    <!-- HISTÓRICO -->

    <section class="profile-card">

      <div class="card-header">

        <h2>
          Histórico recente
        </h2>

        <p>
          Últimas movimentações da conta.
        </p>

      </div>

      <div class="history-list">

        <div
          v-for="item in historico"
          :key="item.acao"
          class="history-item"
        >

          <small>
            {{ item.data }}
          </small>

          <strong>
            {{ item.acao }}
          </strong>

        </div>

      </div>

    </section>

  </div>

</template>

<style scoped>

/* PAGE */

.profile-page {

  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 22px;

  padding-bottom: 32px;
}

/* HEADER */

/* =========================================================
   HERO
========================================================= */

.profile-hero {

  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f9fbfd
    );

  border: 1px solid #e7edf3;

  border-radius: 28px;

  padding: 28px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 32px;

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.05);
}

/* HERO MAIN */

.hero-main {

  display: flex;

  align-items: center;

  gap: 24px;
}

/* AVATAR */

.avatar {

  width: 110px;

  height: 110px;

  border-radius: 30px;

  background:
    linear-gradient(
      135deg,
      #2b4a69,
      #3f6388
    );

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 2rem;

  font-weight: 800;

  box-shadow:
    0 10px 24px rgba(43, 74, 105, 0.2);
}

/* CONTENT */

.hero-content {

  display: flex;

  flex-direction: column;

  gap: 12px;
}

/* BADGE */

.badge {

  width: fit-content;

  background: rgba(243, 156, 18, 0.12);

  color: #f39c12;

  padding: 6px 14px;

  border-radius: 999px;

  font-size: 0.8rem;

  font-weight: 700;
}

/* TITLE */

.title {

  margin: 0;

  color: #243444;

  font-size:
    clamp(2rem, 2vw, 3rem);

  line-height: 1;

  font-weight: 800;
}

.subtitle {

  margin: 0;

  color: #607086;

  font-size: 1rem;

  line-height: 1.5;
}

/* TAGS */

.hero-tags {

  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  margin-top: 4px;
}

.hero-tag {

  background: #f4f7fa;

  border: 1px solid #e4ebf2;

  border-radius: 999px;

  padding: 8px 14px;

  font-size: 0.78rem;

  font-weight: 700;

  color: #4f6478;
}

.hero-tag.active {

  background:
    rgba(47, 166, 106, 0.12);

  border-color:
    rgba(47, 166, 106, 0.18);

  color: #2fa66a;
}

/* SIDE */

.hero-side {

  width: 260px;

  display: flex;

  flex-direction: column;

  gap: 16px;
}

.hero-side-item {

  background: white;

  border: 1px solid #edf1f5;

  border-radius: 16px;

  padding: 14px 16px;

  display: flex;

  flex-direction: column;

  gap: 6px;
}

.hero-side-item small {

  color: #607086;

  font-size: 0.72rem;

  font-weight: 700;

  text-transform: uppercase;
}

.hero-side-item strong {

  color: #243444;

  font-size: 0.95rem;
}

.status-ok-text {

  color: #2fa66a !important;
}

/* GRID */

.profile-grid {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;
}

/* CARD */

.profile-card {

  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fcfdff 100%
    );

  border: 1px solid #e7edf3;

  border-radius: 24px;

  padding: 24px;

  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.04);
}

/* HEADER CARD */

.card-header {

  margin-bottom: 20px;
}

.card-header h2 {

  margin: 0 0 6px 0;

  color: #243444;

  font-size: 1.05rem;
}

.card-header p {

  margin: 0;

  color: #607086;

  line-height: 1.5;
}

/* INFO */

.info-list {

  display: flex;

  flex-direction: column;

  gap: 18px;
}

.info-item {

  display: flex;

  flex-direction: column;

  gap: 6px;
}

.info-item small {

  color: #607086;

  font-size: 0.72rem;

  font-weight: 700;

  text-transform: uppercase;
}

.info-item strong {

  color: #243444;

  font-size: 0.95rem;
}

/* SECURITY */

.security-actions {

  display: flex;

  flex-direction: column;

  gap: 14px;
}

.btn-secondary {

  border: 1px solid #dce5ee;

  background: white;

  border-radius: 14px;

  min-height: 48px;

  padding: 0 16px;

  cursor: pointer;

  font-weight: 700;

  color: #243444;

  transition: 0.2s;
}

.btn-secondary:hover {

  border-color: #f39c12;
}

/* EPIS */

.epi-list {

  display: flex;

  flex-direction: column;

  gap: 14px;
}

.epi-item {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 14px 16px;

  border-radius: 14px;

  background: #f8fafc;

  border: 1px solid #edf1f5;
}

.epi-status {

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 0.75rem;

  font-weight: 700;
}

.status-ok {

  background: rgba(47, 166, 106, 0.12);

  color: #2fa66a;
}

.status-warning {

  background: rgba(243, 156, 18, 0.12);

  color: #f39c12;
}

/* HISTORY */

.history-list {

  display: flex;

  flex-direction: column;

  gap: 16px;
}

.history-item {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding-bottom: 14px;

  border-bottom: 1px solid #edf1f5;
}

.history-item:last-child {

  border-bottom: none;

  padding-bottom: 0;
}

.history-item small {

  color: #607086;

  font-weight: 700;
}

.history-item strong {

  color: #243444;
}

/* RESPONSIVO */

@media (max-width: 1024px) {

  .profile-grid {

    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {

  .profile-user {

    flex-direction: column;

    align-items: flex-start;
  }

  .epi-item,
  .history-item {

    flex-direction: column;

    align-items: flex-start;

    gap: 10px;
  }

  .profile-card {

    padding: 18px;
  }
}

@media (max-width: 1024px) {

  .profile-hero {

    flex-direction: column;

    align-items: flex-start;
  }

  .hero-side {

    width: 100%;
  }
}

@media (max-width: 768px) {

  .hero-main {

    flex-direction: column;

    align-items: flex-start;
  }

  .avatar {

    width: 90px;
    height: 90px;
  }
}

</style>