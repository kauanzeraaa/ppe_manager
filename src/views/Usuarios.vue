<!-- src/views/Usuarios.vue -->

<script setup>

import { computed, ref } from 'vue'

/* =========================================================
   BUSCA
========================================================= */

const busca = ref('')

/* =========================================================
   USUÁRIOS MOCK
========================================================= */

const usuarios = ref([

  {
    id: 1,
    nome: 'Simone Queiroz',
    email: 'simone@epicontrol.com',
    setor: 'TI Industrial',
    perfil: 'Administrador',
    status: 'Ativo'
  },

  {
    id: 2,
    nome: 'Carlos Henrique',
    email: 'carlos@epicontrol.com',
    setor: 'Almoxarifado',
    perfil: 'Almoxarife',
    status: 'Ativo'
  },

  {
    id: 3,
    nome: 'Marina Lopes',
    email: 'marina@epicontrol.com',
    setor: 'Segurança do Trabalho',
    perfil: 'Técnico',
    status: 'Bloqueado'
  },

  {
    id: 4,
    nome: 'Lucas Almeida',
    email: 'lucas@epicontrol.com',
    setor: 'Produção',
    perfil: 'Funcionário',
    status: 'Ativo'
  }

])

/* =========================================================
   FILTRO
========================================================= */

const usuariosFiltrados = computed(() => {

  if (!busca.value) {
    return usuarios.value
  }

  return usuarios.value.filter((usuario) => {

    return (
      usuario.nome
        .toLowerCase()
        .includes(busca.value.toLowerCase())
    )

  })

})

/* =========================================================
   KPIS
========================================================= */

const totalUsuarios = computed(() => {
  return usuarios.value.length
})

const usuariosAtivos = computed(() => {

  return usuarios.value.filter(
    usuario => usuario.status === 'Ativo'
  ).length

})

const administradores = computed(() => {

  return usuarios.value.filter(
    usuario => usuario.perfil === 'Administrador'
  ).length

})

</script>

<template>

  <div class="users-page">

    <!-- HERO -->

    <header class="users-hero">

      <div class="hero-copy">

        <span class="badge">
          Administração
        </span>

        <h1 class="title">
          Gestão de usuários
        </h1>

        <p class="subtitle">
          Controle os acessos, permissões e usuários
          cadastrados no sistema de gestão de EPIs.
        </p>

      </div>

      <button class="btn-primary">
        Novo usuário
      </button>

    </header>

    <!-- KPIS -->

    <section class="kpi-grid">

      <div class="kpi-card">

        <small>
          Usuários cadastrados
        </small>

        <strong>
          {{ totalUsuarios }}
        </strong>

      </div>

      <div class="kpi-card">

        <small>
          Usuários ativos
        </small>

        <strong class="text-success">
          {{ usuariosAtivos }}
        </strong>

      </div>

      <div class="kpi-card">

        <small>
          Administradores
        </small>

        <strong>
          {{ administradores }}
        </strong>

      </div>

    </section>

    <!-- SEARCH -->

    <section class="search-card">

      <input
        v-model="busca"
        type="text"
        placeholder="Buscar usuário..."
      />

    </section>

    <!-- TABLE -->

    <section class="table-card">

      <div class="table-header">

        <h2>
          Usuários cadastrados
        </h2>

        <span>
          {{ usuariosFiltrados.length }} registros
        </span>

      </div>

      <div class="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Usuário</th>

              <th>Setor</th>

              <th>Perfil</th>

              <th>Status</th>

              <th>Ações</th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
            >

              <!-- USER -->

              <td>

                <div class="user-cell">

                  <div class="user-avatar">

                    {{ usuario.nome.charAt(0) }}

                  </div>

                  <div class="user-info">

                    <strong>
                      {{ usuario.nome }}
                    </strong>

                    <small>
                      {{ usuario.email }}
                    </small>

                  </div>

                </div>

              </td>

              <!-- SETOR -->

              <td>
                {{ usuario.setor }}
              </td>

              <!-- PERFIL -->

              <td>

                <span class="profile-badge">

                  {{ usuario.perfil }}

                </span>

              </td>

              <!-- STATUS -->

              <td>

                <span
                  :class="[
                    'status-badge',
                    usuario.status === 'Ativo'
                      ? 'status-active'
                      : 'status-blocked'
                  ]"
                >

                  {{ usuario.status }}

                </span>

              </td>

              <!-- ACTIONS -->

              <td>

                <div class="actions">

                  <button class="btn-table">
                    Editar
                  </button>

                  <button class="btn-table danger">
                    Bloquear
                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </section>

  </div>

</template>

<style scoped>

/* PAGE */

.users-page {

  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 22px;

  padding-bottom: 32px;
}

/* HERO */

.users-hero {

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

  gap: 24px;

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.05);
}

.hero-copy {

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

/* SUBTITLE */

.subtitle {

  margin: 0;

  color: #607086;

  font-size: 1rem;

  line-height: 1.5;

  max-width: 720px;
}

/* BUTTON */

.btn-primary {

  border: none;

  background:
    linear-gradient(
      135deg,
      #f39c12,
      #ffb347
    );

  color: white;

  border-radius: 14px;

  min-height: 52px;

  padding: 0 22px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.btn-primary:hover {

  transform: translateY(-1px);
}

/* KPIS */

.kpi-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 18px;
}

.kpi-card {

  background: white;

  border: 1px solid #e7edf3;

  border-radius: 22px;

  padding: 22px;

  display: flex;

  flex-direction: column;

  gap: 10px;

  box-shadow:
    0 6px 18px rgba(15, 23, 42, 0.04);
}

.kpi-card small {

  color: #607086;

  font-size: 0.75rem;

  font-weight: 700;

  text-transform: uppercase;
}

.kpi-card strong {

  color: #243444;

  font-size: 2rem;

  line-height: 1;
}

.text-success {

  color: #2fa66a !important;
}

/* SEARCH */

.search-card {

  background: white;

  border: 1px solid #e7edf3;

  border-radius: 22px;

  padding: 18px;
}

.search-card input {

  width: 100%;

  min-height: 50px;

  border: 1px solid #dce5ee;

  border-radius: 14px;

  padding: 0 16px;

  font-size: 0.92rem;

  box-sizing: border-box;
}

.search-card input:focus {

  outline: none;

  border-color: #f39c12;

  box-shadow:
    0 0 0 4px rgba(243, 156, 18, 0.12);
}

/* TABLE */

.table-card {

  background: white;

  border: 1px solid #e7edf3;

  border-radius: 24px;

  overflow: hidden;

  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.04);
}

.table-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 22px 24px;

  border-bottom: 1px solid #edf1f5;
}

.table-header h2 {

  margin: 0;

  color: #243444;

  font-size: 1rem;
}

.table-header span {

  color: #607086;

  font-size: 0.85rem;

  font-weight: 700;
}

.table-wrapper {

  overflow-x: auto;
}

table {

  width: 100%;

  border-collapse: collapse;
}

thead {

  background: #f8fafc;
}

th {

  text-align: left;

  padding: 16px 24px;

  color: #607086;

  font-size: 0.76rem;

  text-transform: uppercase;

  letter-spacing: 0.05em;
}

td {

  padding: 18px 24px;

  border-top: 1px solid #edf1f5;

  color: #243444;
}

/* USER */

.user-cell {

  display: flex;

  align-items: center;

  gap: 14px;
}

.user-avatar {

  width: 42px;

  height: 42px;

  border-radius: 14px;

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

  font-weight: 800;
}

.user-info {

  display: flex;

  flex-direction: column;

  gap: 4px;
}

.user-info strong {

  font-size: 0.9rem;
}

.user-info small {

  color: #607086;
}

/* PROFILE */

.profile-badge {

  background:
    rgba(43, 74, 105, 0.08);

  color: #2b4a69;

  border-radius: 999px;

  padding: 6px 12px;

  font-size: 0.75rem;

  font-weight: 700;
}

/* STATUS */

.status-badge {

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 0.75rem;

  font-weight: 700;
}

.status-active {

  background:
    rgba(47, 166, 106, 0.12);

  color: #2fa66a;
}

.status-blocked {

  background:
    rgba(217, 92, 79, 0.12);

  color: #d95c4f;
}

/* ACTIONS */

.actions {

  display: flex;

  gap: 10px;
}

.btn-table {

  border: none;

  background: #eef3f7;

  color: #243444;

  border-radius: 10px;

  min-height: 36px;

  padding: 0 14px;

  font-size: 0.78rem;

  font-weight: 700;

  cursor: pointer;
}

.btn-table.danger {

  background:
    rgba(217, 92, 79, 0.12);

  color: #d95c4f;
}

/* RESPONSIVO */

@media (max-width: 1024px) {

  .users-hero {

    flex-direction: column;

    align-items: flex-start;
  }

  .kpi-grid {

    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {

  .table-header {

    flex-direction: column;

    align-items: flex-start;

    gap: 10px;
  }

  td,
  th {

    padding: 14px;
  }

  .actions {

    flex-direction: column;
  }
}

</style>