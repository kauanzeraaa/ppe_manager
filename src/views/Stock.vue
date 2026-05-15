<script>
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default {
  data() {
    return {
      equipamentos: [],
      loading: true,
      error: null,
      searchTerm: '',
      selectedClassificacao: null,
      userRole: null, // guarda 'Administrador' ou 'Operador'
      showEditModal: false, // controla se o modal aparece
      equipamentoEmEdicao: null, // guarda os dados do epi que foi clicado
    }
  },
  async mounted() {
    await this.fetchUserRole() // descobre quem é o usuario
    await this.loadEquipamentos();
  },
  computed: {
    equipamentosFiltrados() {
      return this.equipamentos.filter(equipamento => {
        const matchSearch = equipamento.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           equipamento.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchClassificacao = !this.selectedClassificacao ||
                                  equipamento.classificacao === this.selectedClassificacao;
        return matchSearch && matchClassificacao;
      });
    }
  },
  methods: {
    // função para buscar os usuários e retornar se ele é operador ou administrador
    async fetchUserRole() {
      try{
        const { data: {user}} = await supabase.auth.getUser()
        if(user){
          const {data, error} = await supabase
            .from('usuario')
            .select('funcao')
            .eq('id', user.id)
            .single()

          if(data) {
            this.userRole = data.funcao
          }
        }
      }catch (err){
        console.log("Erro ao buscar a função do usuário:", err)
      }
    },

    // função para carregar os equipamentos cadastrados no banco
    async loadEquipamentos() {
      this.loading = true; // Garante o loading ao recarregar
      this.error = null;
      try {

        const { data, error } = await supabase
          .from('view_estoque_epi')
          .select('*');

        if (error) {
          console.error('Erro ao buscar equipamentos:', error);
          this.error = 'Erro ao carregar dados';
          return;
        }

        // Mapear os dados com ID sequencial
        this.equipamentos = data.map((item, index) => ({
          id_real: item.epi_id || item.id, // UUID do banco
          id_visual: String(index + 1).padStart(2, '0'), // ID visual
          nome: item.nome,
          descricao: item.descricao,
          classificacao: item.classificacao,
          tamanho: item.tamanho,
          quantidade: item.quantidade_atual,
          estoque_minimo: item.estoque_minimo,
          validade: item.validade
        }));

      } catch (err) {
        console.error('Erro inesperado ao carregar equipamentos:', err);
        this.error = 'Erro ao carregar dados';
      } finally {
        this.loading = false;
      }
    },

    openActions(equipamento) {
      this.equipamentoEmEdicao = { ...equipamento}
      this.showEditModal = true
    },

    // função para fechar o modal
    closeModal(){
      this.showEditModal = false
      this.equipamentoEmEdicao = null
    },

    // funcção para salvar as edições do EPI
    async salvarEdicao() {
      console.log('Salvando dados:', this.equipamentoEmEdicao)

      this.closeModal()

      await this.loadEquipamentos() // atualiza a tabela para aparecer os dados atualizados
    },

    resetFilters() {
      this.searchTerm = '';
      this.selectedClassificacao = null;
    },

    qtyBadgeClass(qty, estoqueMinimo) {
      if (qty <= estoqueMinimo) return 'red';
      if (qty <= estoqueMinimo + 10) return 'orange';
      return 'green';
    },

    dateBadgeClass(dateStr) {
      if (!dateStr) return 'green';
      
      // Parsear a data considerando timezone UTC
      const parts = dateStr.split('-');
      if (parts.length !== 3) return 'green';
      
      const [year, month, day] = parts;
      const valityDate = new Date(year, Number(month) - 1, Number(day));
      const today = new Date();
      
      // Normalizar ambas as datas para midnight em UTC para comparação consistente
      valityDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      // Calcular diferença em dias
      const diffMs = valityDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'red';      // Vencido
      if (diffDays <= 30) return 'orange'; // Faltando até 30 dias
      return 'green';                      // Acima de 30 dias
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
}
</script>

<template>
  <div class="page">
    <span class="badge">Estoque</span>
    <h1 class="title">Equipamentos Cadastrados</h1>
    
    <div class="filters-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar por nome ou descrição..." 
          class="search-input"
        />
      </div>
      
      <div class="filter-buttons">
        <button 
          :class="['filter-btn', { active: selectedClassificacao === null }]"
          @click="selectedClassificacao = null"
        >
          Todos
        </button>
        <button 
          :class="['filter-btn', { active: selectedClassificacao === 'Reutilizável' }]"
          @click="selectedClassificacao = 'Reutilizável'"
        >
          Reutilizáveis
        </button>
        <button 
          :class="['filter-btn', { active: selectedClassificacao === 'Descartável' }]"
          @click="selectedClassificacao = 'Descartável'"
        >
          Descartáveis
        </button>
      </div>
    </div>
    
    <table class="table">
        <thead class="header-table">
          <tr>
          <th>ID</th>
          <th>NOME/DESCRIÇÃO</th>
          <th>CLASSIFICAÇÃO</th>
          <th>TAMANHO</th>
          <th>QUANTIDADE</th>
          <th>VALIDADE</th>
          <th></th>
          </tr>
        </thead>
        <tbody class="content-table">
            <tr v-if="loading">
              <td colspan="7" style="text-align: center; padding: 20px; color: #777;">
                Carregando estoque...
              </td>
            </tr>

            <tr v-else-if="error">
              <td colspan="7" style="text-align: center; padding: 20px; color: #c0392b;">
                {{ error }}
              </td>
            </tr>

            <tr v-else-if="equipamentosFiltrados.length === 0">
              <td colspan="7" style="text-align: center; padding: 20px; color: #777;">
                Nenhum equipamento encontrado com os filtros atuais.
              </td>
            </tr>

            <tr v-else v-for="equipamento in equipamentosFiltrados" :key="equipamento.id_real">
              <td>{{ equipamento.id_visual }}</td>
              <td class="name-cell">
                <div class="product-name">{{ equipamento.nome }}</div>
                <div class="product-description">{{ equipamento.descricao }}</div>
              </td>
              <td>{{ equipamento.classificacao }}</td>
              <td>{{ equipamento.tamanho }}</td>
              <td>
                <span :class="['badge-qty', qtyBadgeClass(equipamento.quantidade, equipamento.estoque_minimo)]">
                  {{ equipamento.quantidade }}
                </span>
              </td>
              <td>
                <span :class="['badge-date', dateBadgeClass(equipamento.validade)]">
                  {{ formatDate(equipamento.validade) }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="actions-btn" @click="openActions(equipamento)" aria-label="Ações">⋮</button>
              </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<style scoped>

.content-table tr {
    height: 40px;
    background-image: linear-gradient(to right, transparent 0%, #cac7c7 3%, #cac7c7 98%, transparent 0%);
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 100% 1px;
} 

.content-table td {
    padding: 12px 15px;
    font-size: 14px;
    font-weight: 300;
    text-align: center;
}

.content-table td.name-cell {
  text-align: left;
}

.content-table tr:last-child td {
  border-bottom: none;
}

.name-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.product-name {
  font-weight: 400;
  color: #333;
  line-height: 1.2;
}

.product-description {
  margin-top: 4px;
  font-size: 12px;
  color: #777;
  line-height: 1.2;
}

.page {
  width: 101.2%;
  height: 100%;
  margin-top: -1rem;
}

.filters-container {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 90%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--font-secondary);
  transition: all 0.3s ease;
  background-color: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 10px 18px;
  border: 2px solid #e0e0e0;
  background-color: #fff;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  font-family: var(--font-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #f39c12;
  background-color: #fff;
  color: #f39c12;
}

.filter-btn.active {
  background-color: #f39c12;
  border-color: #f39c12;
  color: white;
  font-weight: 600;
}

.badge {
  display: inline-block;
  background: #f39d125c;
  color: #f39c12;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 6px;
  margin-bottom: 0;
}

.title {
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 20px;
  font-family: var(--font-primary);
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}


.header-table {
    background-color: #f39c12;
    color: white;;
}

.header-table th:first-child {
  border-top-left-radius: 20px;
  width: 60px;
}

.header-table th:last-child {
  border-top-right-radius: 20px;
}

.header-table tr {
    height: 35px;
}
.header-table th {
    padding: 12px 15px;
    font-size: 13px;
    font-weight: 300;
    text-align: center;
    margin-left: 1rem;
}

.header-table th:nth-child(2) {
  text-align: left;
}

.actions-cell {
  width: 48px;
  padding: 0 8px;
}

.actions-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 6px;
  border-radius: 6px;
}

.actions-btn:hover {
  background: rgba(0,0,0,0.05);
}

.actions-btn:focus {
  outline: 2px solid rgba(243,156,18,0.25);
}

.badge-qty, .badge-date {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  color: #1b1b1b;
  min-width: 34px;
  text-align: center;
}

.badge-qty.green { background: #e6f9ea; color: #2d8a40; }
.badge-qty.orange { background: #fff3e0; color: #b96900; }
.badge-qty.red { background: #ffecec; color: #c0392b; }

.badge-date.green { background: #eafaf0; color: #2d8a40; }
.badge-date.orange { background: #fff8ec; color: #b96900; }
.badge-date.red { background: #fff0f0; color: #c0392b; }

</style>
