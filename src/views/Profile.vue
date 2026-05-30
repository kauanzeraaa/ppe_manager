<script setup>
const usuario = {
  nome: 'Simone Queiroz',
  cargo: 'Gerente Administrativa',
  email: 'simone@epicontrol.com',
  setor: 'Gestão Operacional',
  perfil: 'Administrador',
  unidade: 'SENAI SC Joinville Sul',
  idFuncional: 'ADM-0248',
  ultimoAcesso: 'Hoje às 08:42'
}

const permissoes = [
  'Gerenciar estoque',
  'Editar cadastros de EPI',
  'Aprovar solicitações',
  'Acessar relatórios executivos',
  'Configurar parâmetros do sistema',
  'Gerenciar usuários'
]

const escopos = [
  'Estoque central',
  'Conformidade NR-6',
  'Monitoramento de CA',
  'Acompanhamento de setores e unidades'
]

const indicadores = [
  { titulo: 'Itens críticos', valor: '4', apoio: 'Abaixo do mínimo' },
  { titulo: 'CA vencendo', valor: '1', apoio: 'Monitoramento imediato' },
  { titulo: 'Solicitações pendentes', valor: '4', apoio: 'Aguardando análise' },
  { titulo: 'Conformidade geral', valor: '85%', apoio: 'Indicador atual' }
]

const historico = [
  { data: 'Hoje', acao: 'Relatório executivo exportado' },
  { data: 'Ontem', acao: 'Aprovação de solicitação de reposição' },
  { data: '19/05', acao: 'Atualização de parâmetros de estoque' },
  { data: '18/05', acao: 'Revisão de conformidade concluída' }
]
</script>

<template>
  <div class="profile-page">
    <header class="profile-hero">
      <div class="hero-main">
        <div class="avatar">
          SQ
        </div>

        <div class="hero-content">
          <span class="badge">
            Perfil Administrativo
          </span>

          <h1 class="title">
            {{ usuario.nome }}
          </h1>

          <p class="subtitle">
            {{ usuario.cargo }}
          </p>

          <div class="hero-tags">
            <span class="hero-tag">
              {{ usuario.perfil }}
            </span>

            <span class="hero-tag">
              {{ usuario.setor }}
            </span>

            <span class="hero-tag active">
              Conta ativa
            </span>
          </div>
        </div>
      </div>

      <aside class="hero-side">
        <div class="hero-side-item">
          <small>Unidade</small>
          <strong>{{ usuario.unidade }}</strong>
        </div>

        <div class="hero-side-item">
          <small>Último acesso</small>
          <strong>{{ usuario.ultimoAcesso }}</strong>
        </div>

        <div class="hero-side-item">
          <small>ID funcional</small>
          <strong>{{ usuario.idFuncional }}</strong>
        </div>
      </aside>
    </header>

    <div class="profile-grid">
      <section class="profile-card">
        <div class="card-header">
          <h2>Dados da conta</h2>
          <p>Informacoes institucionais e identificacao no sistema.</p>
        </div>

        <div class="info-list">
          <div class="info-item">
            <small>E-mail corporativo</small>
            <strong>{{ usuario.email }}</strong>
          </div>

          <div class="info-item">
            <small>Unidade</small>
            <strong>{{ usuario.unidade }}</strong>
          </div>

          <div class="info-item">
            <small>Setor</small>
            <strong>{{ usuario.setor }}</strong>
          </div>

          <div class="info-item">
            <small>Perfil de acesso</small>
            <strong>{{ usuario.perfil }}</strong>
          </div>
        </div>
      </section>

      <section class="profile-card">
        <div class="card-header">
          <h2>Segurança</h2>
          <p>Controles de acesso e proteção da conta administrativa.</p>
        </div>

        <div class="security-actions">
          <button class="btn-secondary">
            Alterar senha
          </button>

          <button class="btn-secondary">
            Encerrar sessões
          </button>

          <button class="btn-secondary">
            Verificar acessos recentes
          </button>
        </div>
      </section>
    </div>

    <div class="profile-grid profile-grid--double">
      <section class="profile-card">
        <div class="card-header">
          <h2>Permissões</h2>
          <p>Capacidades disponíveis no ambiente administrativo.</p>
        </div>

        <div class="pill-list">
          <span
            v-for="item in permissoes"
            :key="item"
            class="pill-item"
          >
            {{ item }}
          </span>
        </div>
      </section>

      <section class="profile-card">
        <div class="card-header">
          <h2>Escopo de gestão</h2>
          <p>Áreas e responsabilidades vinculadas ao cargo.</p>
        </div>

        <div class="scope-list">
          <div
            v-for="item in escopos"
            :key="item"
            class="scope-item"
          >
            <strong>{{ item }}</strong>
            <span>Ativo</span>
          </div>
        </div>
      </section>
    </div>

    <section class="profile-card">
      <div class="card-header">
        <h2>Indicadores sob responsabilidade</h2>
        <p>Pontos de acompanhamento contínuo no contexto gerencial.</p>
      </div>

      <div class="indicator-grid">
        <article
          v-for="item in indicadores"
          :key="item.titulo"
          class="indicator-card"
        >
          <small>{{ item.titulo }}</small>
          <strong>{{ item.valor }}</strong>
          <span>{{ item.apoio }}</span>
        </article>
      </div>
    </section>

    <section class="profile-card">
      <div class="card-header">
        <h2>Histórico administrativo</h2>
        <p>Últimas ações registradas no contexto de gestão.</p>
      </div>

      <div class="history-list">
        <div
          v-for="item in historico"
          :key="item.acao"
          class="history-item"
        >
          <small>{{ item.data }}</small>
          <strong>{{ item.acao }}</strong>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

.profile-hero {
  background: linear-gradient(135deg, #ffffff, #f9fbfd);
  border: 1px solid #e7edf3;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.hero-main {
  display: flex;
  align-items: center;
  gap: 22px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 28px;
  background: linear-gradient(135deg, #2b4a69, #3f6388);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(43, 74, 105, 0.2);
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.badge {
  width: fit-content;
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.title {
  margin: 0;
  color: #243444;
  font-size: clamp(2rem, 2vw, 2.8rem);
  line-height: 1;
  font-weight: 800;
}

.subtitle {
  margin: 0;
  color: #607086;
  font-size: 1rem;
  line-height: 1.5;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
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
  background: rgba(47, 166, 106, 0.12);
  border-color: rgba(47, 166, 106, 0.18);
  color: #2fa66a;
}

.hero-side {
  width: 320px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.hero-side-item {
  background: white;
  border: 1px solid #edf1f5;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  min-height: 78px;
}

.hero-side-item small,
.info-item small,
.indicator-card small,
.history-item small {
  color: #607086;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.hero-side-item strong,
.info-item strong {
  color: #243444;
  font-size: 0.95rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.profile-grid--double {
  align-items: start;
}

.profile-card {
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid #e7edf3;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.card-header {
  margin-bottom: 16px;
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

.info-list,
.history-list,
.scope-list,
.security-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 74px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #edf1f5;
}

.btn-secondary {
  border: 1px solid #dce5ee;
  background: white;
  border-radius: 14px;
  min-height: 50px;
  padding: 0 16px;
  cursor: pointer;
  font-weight: 700;
  color: #243444;
  transition: 0.2s;
  text-align: left;
}

.btn-secondary:hover {
  border-color: #f39c12;
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
}

.pill-item {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f6f9fc;
  border: 1px solid #e6edf5;
  color: #304255;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.35;
}

.scope-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #edf1f5;
}

.scope-item strong {
  color: #243444;
  font-size: 0.92rem;
}

.scope-item span {
  color: #2fa66a;
  background: rgba(47, 166, 106, 0.12);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.indicator-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.indicator-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #edf1f5;
  min-height: 144px;
}

.indicator-card strong {
  color: #243444;
  font-size: 1.5rem;
  line-height: 1;
}

.indicator-card span {
  color: #607086;
  font-size: 0.82rem;
  line-height: 1.5;
}

.history-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: start;
  gap: 16px;
  padding: 0 0 14px;
  border-bottom: 1px solid #edf1f5;
}

.history-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.history-item strong {
  color: #243444;
  text-align: left;
  line-height: 1.5;
}

@media (max-width: 1200px) {
  .indicator-grid {
    grid-template-columns: 1fr 1fr;
  }

  .hero-side {
    width: 280px;
  }
}

@media (max-width: 1024px) {
  .profile-grid,
  .indicator-grid {
    grid-template-columns: 1fr;
  }

  .profile-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-side {
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-grid,
  .indicator-grid {
    grid-template-columns: 1fr;
  }

  .info-list {
    grid-template-columns: 1fr;
  }

  .profile-card {
    padding: 18px;
  }

  .history-item,
  .scope-item {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .history-item strong {
    text-align: left;
  }

  .hero-side {
    grid-template-columns: 1fr;
  }
}
</style>
