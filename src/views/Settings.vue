<!-- src/views/Settings.vue -->

<script setup>
import { ref } from 'vue'

const abaAtiva = ref('geral')

const ambienteForm = ref({
  nome: '',
  tipoAtividade: '',
  epis: []
})

const episDisponiveis = [
  'Capacete',
  'Óculos',
  'Luvas',
  'Máscara',
  'Protetor auricular',
  'Botina'
]

const ambientesCadastrados = ref([
  {
    id: 1,
    nome: 'Oficina de Usinagem',
    tipoAtividade: 'Aulas práticas com máquinas operatrizes',
    epis: ['Óculos', 'Luvas', 'Protetor auricular']
  },
  {
    id: 2,
    nome: 'Área de Soldagem',
    tipoAtividade: 'Processos de solda e corte',
    epis: ['Capacete', 'Óculos', 'Luvas', 'Botina']
  }
])

const abas = [
  { id: 'geral', nome: 'Geral' },
  { id: 'epis', nome: 'Parâmetros de EPI e CA' },
  { id: 'cargos', nome: 'Ambientes e EPIs' },
  { id: 'alertas', nome: 'CA e Alertas' },
  { id: 'estoque', nome: 'Estoque' },
  { id: 'relatorios', nome: 'Relatórios' }
]

function toggleEpiAmbiente(epi) {
  const lista = ambienteForm.value.epis

  if (lista.includes(epi)) {
    ambienteForm.value.epis = lista.filter(item => item !== epi)
    return
  }

  ambienteForm.value.epis = [...lista, epi]
}

function salvarAmbiente() {
  if (!ambienteForm.value.nome.trim() || !ambienteForm.value.tipoAtividade.trim()) {
    return
  }

  ambientesCadastrados.value.unshift({
    id: Date.now(),
    nome: ambienteForm.value.nome.trim(),
    tipoAtividade: ambienteForm.value.tipoAtividade.trim(),
    epis: [...ambienteForm.value.epis]
  })

  ambienteForm.value = {
    nome: '',
    tipoAtividade: '',
    epis: []
  }
}
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

      <div class="config-actions">
        <button class="btn-save">
          Salvar Configurações
        </button>
      </div>

    </section>

    <!-- EPIS -->

    <section
      v-else-if="abaAtiva === 'epis'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Parâmetros de EPI e CA
        </h2>

        <p>
          Regras técnicas e critérios de conformidade aplicados aos equipamentos.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Validade padrão do CA</span>

          <input
            type="number"
            placeholder="365 dias"
          />

        </label>

        <label class="form-group">

          <span>Antecedência do alerta</span>

          <input
            type="number"
            placeholder="30 dias"
          />

        </label>

        <label class="form-group">

          <span>Classificação padrão</span>

          <select>
            <option>Selecione</option>
            <option>Reutilizável</option>
            <option>Descartável</option>
          </select>

        </label>

        <label class="form-group">

          <span>Vida útil padrão</span>

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
            Exigir higienização
          </span>

        </label>

        <label class="checkbox-item">

          <input type="checkbox" />

          <span>
            Exigir manutenção
          </span>

        </label>

      </div>

      <div class="config-actions">
        <button class="btn-save">
          Salvar Parâmetros
        </button>
      </div>

    </section>

    <!-- CARGOS -->

    <section
      v-else-if="abaAtiva === 'cargos'"
      class="config-card"
    >

      <div class="card-header">

        <h2>
          Ambientes e EPIs obrigatórios
        </h2>

        <p>
          Defina os EPIs exigidos por ambiente, oficina ou tipo de atividade prática.
        </p>

      </div>

      <div class="form-grid">

        <label class="form-group">

          <span>Nome do ambiente</span>

          <input
            v-model="ambienteForm.nome"
            type="text"
            placeholder="Ex.: Oficina de Mecânica"
          />

        </label>

        <label class="form-group">

          <span>Tipo de atividade</span>

          <input
            v-model="ambienteForm.tipoAtividade"
            type="text"
            placeholder="Ex.: Aula prática com máquinas e bancadas"
          />

        </label>

      </div>

      <div class="checkbox-list">

        <label
          v-for="epi in episDisponiveis"
          :key="epi"
          class="checkbox-item"
        >
          <input
            type="checkbox"
            :checked="ambienteForm.epis.includes(epi)"
            @change="toggleEpiAmbiente(epi)"
          />
          {{ epi }}
        </label>

      </div>

      <section class="linked-list-card">
        <div class="linked-list-header">
          <h3>Ambientes cadastrados</h3>
          <span>{{ ambientesCadastrados.length }} registros</span>
        </div>

        <div class="linked-list">
          <article
            v-for="ambiente in ambientesCadastrados"
            :key="ambiente.id"
            class="linked-item"
          >
            <div class="linked-item-main">
              <strong>{{ ambiente.nome }}</strong>
              <small>{{ ambiente.tipoAtividade }}</small>
            </div>

            <div class="linked-tags">
              <span
                v-for="epi in ambiente.epis"
                :key="`${ambiente.id}-${epi}`"
                class="mini-tag"
              >
                {{ epi }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <div class="config-actions">
        <button class="btn-save">
          Salvar Associação
        </button>
        <button class="btn-save" type="button" @click="salvarAmbiente">
          Salvar Ambiente e EPIs
        </button>
      </div>

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

      <div class="config-actions">
        <button class="btn-save">
          Salvar Alertas
        </button>
      </div>

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

      <div class="config-actions">
        <button class="btn-save">
          Salvar Estoque
        </button>
      </div>

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

      <div class="config-actions">
        <button class="btn-save">
          Salvar Relatórios
        </button>
      </div>

    </section>

  </div>

</template>

<style scoped>

/* PAGE */

.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

/* HEADER */

.page-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  align-items: stretch;
  gap: 18px;
}

.page-header-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  max-width: 780px;
  padding: 8px 0;
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
  justify-content: center;
  gap: 16px;
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #edf1f5;
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
  padding: 10px;
  background: #f7f9fc;
  border: 1px solid #e7edf3;
  border-radius: 18px;
  position: sticky;
  top: 16px;
  z-index: 20;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
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
  white-space: nowrap;
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
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef2f6;
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
  background: #fbfcfe;
  padding: 0 14px;
  font-size: 0.86rem;
  color: #243444;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow:
    0 0 0 4px rgba(243, 156, 18, 0.12);
  background: #ffffff;
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
  padding: 14px 16px;
  border-radius: 12px;
  background: #fbfcfe;
  border: 1px solid #edf1f5;
  font-size: 0.84rem;
  font-weight: 600;
  color: #243444;
}

.linked-list-card {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e8eef5;
}

.linked-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.linked-list-header h3 {
  margin: 0;
  color: #243444;
  font-size: 0.96rem;
}

.linked-list-header span {
  color: #607086;
  font-size: 0.78rem;
  font-weight: 700;
}

.linked-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.linked-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e9eff5;
}

.linked-item-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.linked-item-main strong {
  color: #243444;
  font-size: 0.9rem;
}

.linked-item-main small {
  color: #607086;
  font-size: 0.78rem;
  font-weight: 600;
}

.linked-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.mini-tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(43, 74, 105, 0.08);
  color: #2b4a69;
  font-size: 0.74rem;
  font-weight: 700;
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

.config-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eef2f6;
}

.btn-save {
  border: none;
  border-radius: 12px;
  min-width: 220px;
  min-height: 46px;
  padding: 0 18px;
  background: #f39c12;
  color: white;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(243, 156, 18, 0.18);
}

.btn-save:hover {
  background: #e58f07;
}

/* RESPONSIVO */

@media (max-width: 1200px) {

  .page-header {
    grid-template-columns: 1fr;
  }

  .summary-card {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .summary-item {
    padding: 12px 14px;
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

  .linked-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .linked-tags {
    justify-content: flex-start;
  }

  .config-actions {
    justify-content: stretch;
  }

  .btn-save {
    width: 100%;
    min-width: 0;
  }
}

</style>
