<!-- src/views/Settings.vue -->

<script setup>
import { ref } from 'vue'

const abaAtiva = ref('geral')

const abas = [
  { id: 'geral', nome: 'Geral' },
  { id: 'epis', nome: 'EPIs e CA' },
  { id: 'cargos', nome: 'Cargos' },
  { id: 'alertas', nome: 'CA e Alertas' },
  { id: 'estoque', nome: 'Estoque' },
  { id: 'relatorios', nome: 'Relatórios' }
]
</script>

<template>

  <div class="page">

    <!-- HEADER -->

    <header class="page-header">

      <!-- ESQUERDA -->

      <div class="page-header-copy">

        <span class="badge">
          Configurações
        </span>

        <h1 class="title">
          Painel de Configuração do Sistema
        </h1>

        <p class="subtitle">
          Ajuste as regras de negócio do sistema de gestão de EPIs
          para manter conformidade, rastreabilidade e controle operacional.
        </p>

      </div>

      <!-- DIREITA -->

      <aside class="summary-card">

        <span class="summary-title">
          Resumo rápido
        </span>

        <div class="summary-grid">

          <div class="summary-item">

            <small>UNIDADE</small>

            <strong>
              SENAI SC Joinville Sul
            </strong>

          </div>

          <div class="summary-item">

            <small>NORMA</small>

            <strong>
              NR-6
            </strong>

          </div>

          <div class="summary-item">

            <small>CA</small>

            <strong>
              Obrigatório e monitorado
            </strong>

          </div>

        </div>

      </aside>

    </header>

    <!-- TABS -->

    <div class="tabs-container">

      <button
        v-for="aba in abas"
        :key="aba.id"
        class="tab-button"
        :class="{ active: abaAtiva === aba.id }"
        @click="abaAtiva = aba.id"
      >
        {{ aba.nome }}
      </button>

    </div>

    <!-- GERAL -->

    <section
      v-if="abaAtiva === 'geral'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Configurações Gerais
        </h2>

        <p>
          Dados institucionais e parâmetros base da unidade.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Unidade</span>

          <input
            type="text"
            placeholder="SENAI SC Joinville Sul"
          />

        </label>

        <label class="form-group">

          <span>Responsável pela segurança</span>

          <input
            type="text"
            placeholder="Nome do responsável"
          />

        </label>

        <label class="form-group">

          <span>E-mail corporativo</span>

          <input
            type="email"
            placeholder="epi@senai.sc.edu.br"
          />

        </label>

        <label class="form-group">

          <span>Telefone</span>

          <input
            type="text"
            placeholder="(47) 3333-0000"
          />

        </label>

      </div>

      <div class="hint-box">

        <strong>
          Base institucional
        </strong>

        <span>
          Esses dados aparecem em relatórios e documentos oficiais.
        </span>

      </div>

      <button class="btn-save">
        Salvar Configurações
      </button>

    </section>

    <!-- EPIS -->

    <section
      v-else-if="abaAtiva === 'epis'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Cadastro de EPIs e CA
        </h2>

        <p>
          Controle técnico dos equipamentos e certificados.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Nome do EPI</span>

          <input
            type="text"
            placeholder="Capacete de segurança"
          />

        </label>

        <label class="form-group">

          <span>Número do CA</span>

          <input
            type="text"
            placeholder="CA 00000"
          />

        </label>

        <label class="form-group">

          <span>Validade do CA</span>

          <input type="date" />

        </label>

        <label class="form-group">

          <span>Vida útil</span>

          <input
            type="number"
            placeholder="180 dias"
          />

        </label>

      </div>

      <div class="checkbox-area">

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Exige higienização
          </span>

        </label>

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Exige manutenção
          </span>

        </label>

      </div>

      <button class="btn-save">
        Salvar EPI
      </button>

    </section>

    <!-- CARGOS -->

    <section
      v-else-if="abaAtiva === 'cargos'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Cargos e Funções
        </h2>

        <p>
          Associe EPIs obrigatórios aos cargos.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Cargo</span>

          <select>
            <option>Selecione</option>
            <option>Docente</option>
            <option>Laboratorista</option>
            <option>Estagiário</option>
          </select>

        </label>

        <label class="form-group">

          <span>Setor</span>

          <input
            type="text"
            placeholder="Laboratório"
          />

        </label>

      </div>

      <div class="checkbox-list">

        <label>
          <input type="checkbox" />
          Capacete
        </label>

        <label>
          <input type="checkbox" />
          Óculos
        </label>

        <label>
          <input type="checkbox" />
          Luvas
        </label>

        <label>
          <input type="checkbox" />
          Máscara
        </label>

      </div>

      <button class="btn-save">
        Salvar Associação
      </button>

    </section>

    <!-- ALERTAS -->

    <section
      v-else-if="abaAtiva === 'alertas'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          CA e Alertas
        </h2>

        <p>
          Configure avisos automáticos de validade e conformidade.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Alerta CA</span>

          <input
            type="number"
            placeholder="30 dias"
          />

        </label>

        <label class="form-group">

          <span>Bloquear sem CA</span>

          <select>
            <option>Sim</option>
            <option>Não</option>
          </select>

        </label>

      </div>

      <div class="checkbox-area">

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Exibir no dashboard
          </span>

        </label>

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Enviar por e-mail
          </span>

        </label>

      </div>

      <button class="btn-save">
        Salvar Alertas
      </button>

    </section>

    <!-- ESTOQUE -->

    <section
      v-else-if="abaAtiva === 'estoque'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Parâmetros de Estoque
        </h2>

        <p>
          Defina limites mínimos e máximos.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Estoque mínimo</span>

          <input
            type="number"
            placeholder="10"
          />

        </label>

        <label class="form-group">

          <span>Estoque máximo</span>

          <input
            type="number"
            placeholder="80"
          />

        </label>

      </div>

      <button class="btn-save">
        Salvar Estoque
      </button>

    </section>

    <!-- RELATÓRIOS -->

    <section
      v-else-if="abaAtiva === 'relatorios'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Relatórios e Assinaturas
        </h2>

        <p>
          Configure PDFs, assinaturas e layout.
        </p>

      </div>

      <div class="checkbox-area">

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Assinatura digital
          </span>

        </label>

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Gerar PDF automaticamente
          </span>

        </label>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Layout</span>

          <select>
            <option>Padrão</option>
            <option>Compacto</option>
          </select>

        </label>

        <label class="form-group">

          <span>Responsável</span>

          <input
            type="text"
            placeholder="Nome do responsável"
          />

        </label>

      </div>

      <button class="btn-save">
        Salvar Relatórios
      </button>

    </section>

  </div>

</template>

<style scoped>

/* PAGE */

.page {

  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 20px;

  padding-bottom: 32px;
}

/* HEADER */

.page-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 24px;

  padding-top: 8px;
}

.page-header-copy {

  display: flex;

  flex-direction: column;

  gap: 12px;

  max-width: 760px;
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

  font-size:
    clamp(2rem, 2vw, 3.2rem);

  line-height: 1;

  font-weight: 800;
}

.subtitle {

  margin: 0;

  color: #607086;

  font-size: 1rem;

  line-height: 1.5;

  max-width: 720px;
}

/* SUMMARY */

.summary-card {

  width: 520px;

  flex-shrink: 0;

  background:
    linear-gradient(
      135deg,
      #ffffff,
      #fbfcfe
    );

  border-radius: 18px;

  padding: 18px 20px;

  border: 1px solid #e7edf3;

  box-shadow:
    0 6px 18px rgba(15, 23, 42, 0.05);

  display: flex;

  flex-direction: column;

  gap: 16px;

  margin-top: 72px;
}

.summary-title {

  font-size: 0.72rem;

  font-weight: 800;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: #f39c12;
}

.summary-grid {

  display: grid;

  grid-template-columns:
    1.4fr
    0.7fr
    1fr;

  gap: 18px;
}

.summary-item {

  display: flex;

  flex-direction: column;

  gap: 6px;

  padding-left: 14px;

  border-left: 3px solid #eef2f6;
}

.summary-item:first-child {

  padding-left: 0;

  border-left: none;
}

.summary-item small {

  color: #607086;

  font-size: 0.68rem;

  font-weight: 800;

  letter-spacing: 0.05em;
}

.summary-item strong {

  color: #243444;

  font-size: 0.92rem;

  line-height: 1.35;
}

/* TABS */

.tabs-container {

  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  padding: 8px;

  background: #f7f9fc;

  border: 1px solid #e7edf3;

  border-radius: 18px;
}

.tab-button {

  border: none;

  background: transparent;

  color: #607086;

  padding: 12px 16px;

  border-radius: 12px;

  cursor: pointer;

  font-size: 0.82rem;

  font-weight: 700;

  transition: 0.2s ease;
}

.tab-button:hover {
  background: rgba(255,255,255,0.85);
}

.tab-button.active {

  background:
    linear-gradient(
      135deg,
      #2b4a69,
      #3f6388
    );

  color: #ffffff;

  box-shadow:
    0 8px 20px rgba(43, 74, 105, 0.18);
}

/* CARD */

.config-card {

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

  position: relative;

  overflow: hidden;
}

.config-card::before {

  content: '';

  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  height: 4px;

  background:
    linear-gradient(
      90deg,
      #f39c12,
      #ffbf47
    );
}

/* CARD HEADER */

.card-header {

  display: flex;

  flex-direction: column;

  gap: 6px;

  margin-bottom: 22px;
}

.card-header h2 {

  margin: 0;

  color: #243444;

  font-size: 1.1rem;
}

.card-header p {

  margin: 0;

  color: #607086;

  line-height: 1.5;
}

/* FORM */

.form-grid {

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(260px, 1fr));

  gap: 16px;
}

.form-group {

  display: flex;

  flex-direction: column;

  gap: 8px;
}

.form-group span {

  font-size: 0.74rem;

  font-weight: 700;

  text-transform: uppercase;

  color: #607086;
}

.form-group input,
.form-group select {

  width: 100%;

  min-height: 46px;

  border: 1px solid #dce5ee;

  border-radius: 12px;

  background: #ffffff;

  padding: 0 14px;

  font-size: 0.86rem;

  color: #243444;

  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {

  outline: none;

  border-color: #f39c12;

  box-shadow:
    0 0 0 4px rgba(243, 156, 18, 0.12);
}

/* CHECKBOX */

.checkbox-area {

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(260px, 1fr));

  gap: 14px;

  margin-top: 18px;
}

.checkbox-list {

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 14px;

  margin-top: 18px;
}

.checkbox-item {

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px;

  border-radius: 12px;

  background: #ffffff;

  border: 1px solid #edf1f5;

  font-size: 0.84rem;

  font-weight: 600;

  color: #243444;
}

/* HINT */

.hint-box {

  margin-top: 18px;

  padding: 14px 16px;

  border-radius: 12px;

  background: #fff9ef;

  border: 1px solid #f5dfae;
}

.hint-box strong {

  display: block;

  margin-bottom: 4px;

  color: #243444;
}

.hint-box span {

  color: #607086;

  font-size: 0.82rem;

  line-height: 1.5;
}

/* BUTTON */

.btn-save {

  margin-top: 22px;

  border: none;

  border-radius: 12px;

  padding: 13px 18px;

  background: #f39c12;

  color: white;

  font-size: 0.84rem;

  font-weight: 700;

  cursor: pointer;
}

.btn-save:hover {
  background: #e58f07;
}

/* RESPONSIVO */

@media (max-width: 1200px) {

  .page-header {

    flex-direction: column;
  }

  .summary-card {

    width: 100%;
  }

  .summary-grid {

    grid-template-columns: 1fr;
  }

  .summary-item {

    padding-left: 0;

    border-left: none;

    padding-bottom: 12px;

    border-bottom: 1px solid #eef2f6;
  }

  .summary-item:last-child {

    border-bottom: none;

    padding-bottom: 0;
  }
}

@media (max-width: 768px) {

  .form-grid,
  .checkbox-area,
  .checkbox-list {

    grid-template-columns: 1fr;
  }

  .config-card {

    padding: 18px;
  }

  .tabs-container {

    overflow-x: auto;
  }
}

</style>