<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const router = useRouter();

// Estados
const loading = ref(true);
const usuarioLogado = ref({ id: "", nome: "", funcao: "", telefone: "", foto_perfil: "", ativo: true, email: "" });
const usuarios = ref([]);
const fileInput = ref(null);

// Modal de Gerenciar Usuários Admin
const showModal = ref(false);
const modalMode = ref("create");
const formModal = ref({ id: "", nome: "", telefone: "", funcao: "Operador", ativo: true, email: "", senha: "" });

// Modal para alterar senha
const showPasswordModal = ref(false);
const novaSenha = ref("");

// Criação dos toasts de notificação
const toast = ref({ show: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

// Computa se o usuario é adm
const isAdmin = computed(() => usuarioLogado.value.funcao === 'Administrador');

onMounted(async () => {
  await carregarDadosIniciais();
});

// Função para carregar os dados iniciais do perfil e, se for admin, a lista de usuários
const carregarDadosIniciais = async () => {
  try {
    loading.value = true;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/");

    const { data: perfilLogado } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", user.id)
      .single();

    if (perfilLogado) {
      usuarioLogado.value = { ...perfilLogado, email: user.email };
    }

    if (isAdmin.value) {
      await carregarListaUsuarios();
    }
  } catch (error) {
    console.error(error);
    showToast("Erro ao carregar os dados.", "error");
  } finally {
    loading.value = false;
  }
};

const carregarListaUsuarios = async () => {
  const { data, error } = await supabase.from("usuario").select("*").order("nome");
  if (!error && data) usuarios.value = data;
};

// Funções de perfil
const dispararUpload = () => fileInput.value.click();

// Função para atualizar a foto de perfil do usuário
const atualizarFoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast("A imagem deve ter no máximo 2MB.", "error");
    return;
  }

  try {
    showToast("Enviando foto...", "success");
    const extensao = file.name.split('.').pop();
    const nomeArquivo = `${usuarioLogado.value.id}-${Date.now()}.${extensao}`;

    const { error: uploadError } = await supabase.storage
      .from("user_images")
      .upload(nomeArquivo, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from("user_images").getPublicUrl(nomeArquivo);
    const urlPublica = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from("usuario")
      .upsert({ foto_perfil: urlPublica })
      .eq("id", usuarioLogado.value.id);

    if (dbError) throw dbError;

    usuarioLogado.value.foto_perfil = urlPublica;
    showToast("Foto atualizada com sucesso!", "success");

  } catch (error) {
    console.error(error);
    showToast("Erro ao salvar a foto no servidor.", "error");
  } finally {
    fileInput.value.value = null;
  }
};

// Função para salvar as alterações do perfil do usuário
const salvarMeuPerfil = async () => {
  try {
    const { error } = await supabase
      .from("usuario")
      .update({ nome: usuarioLogado.value.nome, telefone: usuarioLogado.value.telefone })
      .eq("id", usuarioLogado.value.id);

    if (error) throw error;
    showToast("Seus dados foram atualizados!", "success");
  } catch (error) {
    showToast("Erro ao atualizar seus dados.", "error");
  }
};

// Função para alterar a senha do usuário logado
const alterarMinhaSenha = async () => {
  if (novaSenha.value.length < 6) {
    showToast("A senha precisa ter no mínimo 6 caracteres.", "error");
    return;
  }

  try {
    loading.value = true;
    const { error } = await supabase.auth.updateUser({
      password: novaSenha.value
    });

    if (error) throw error;
    showToast("Sua senha foi atualizada com sucesso!", "success");
    showPasswordModal.value = false;
    novaSenha.value = "";
  } catch (error) {
    console.error(error);
    showToast("Erro ao alterar senha.", "error");
  } finally {
    loading.value = false;
  }
};

// Funções para abrir os modais de criação e edição de usuários (Admin) e para salvar as alterações feitas nesses modais
const abrirModalNovo = () => {
  modalMode.value = "create";
  formModal.value = { id: "", nome: "", telefone: "", funcao: "Operador", ativo: true, email: "", senha: "" };
  showModal.value = true;
};

// Modal de edição do formulário - apenas com os dados que podem ser editados
const abrirModalEditar = (user) => {
  modalMode.value = "edit";
  formModal.value = { ...user, email: "", senha: "" };
  showModal.value = true;
};

// Função para salvar as alterações feitas no modal de criação/edição de usuários (Admin)
const salvarUsuarioModal = async () => {
  try {
    loading.value = true;

    if (modalMode.value === "create") {
      
      const clienteTemporario = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });

      const { data: authData, error: authError } = await clienteTemporario.auth.signUp({
        email: formModal.value.email.trim(),
        password: formModal.value.senha,
      });

      if (authError) throw authError;

      // Ao invés de criar um novo usuário do zero, cria a conta de autenticação primeiro
      // e depois atualiza o perfil com os dados adicionais
      const { error: dbError } = await supabase.from("usuario").update({
        nome: formModal.value.nome,
        telefone: formModal.value.telefone,
        funcao: formModal.value.funcao,
        ativo: formModal.value.ativo
      }).eq("id", authData.user.id); // Apontamos para o ID que acabou de nascer

      if (dbError) throw dbError;
      showToast("Usuário criado com sucesso!", "success");

    } else {
      // Modo Edição
      const { error } = await supabase.from("usuario").update({
        nome: formModal.value.nome,
        telefone: formModal.value.telefone,
        funcao: formModal.value.funcao,
        ativo: formModal.value.ativo
      }).eq("id", formModal.value.id);

      if (error) throw error;
      showToast("Usuário updated com sucesso!", "success");
      
      if (formModal.value.id === usuarioLogado.value.id) await carregarDadosIniciais();
    }

    showModal.value = false;
    await carregarListaUsuarios();
  } catch (error) {
    console.error("Erro ao salvar:", error);
    let msg = error.message;
    if (msg.includes("already registered")) {
      msg = "Este e-mail já está em uso por outro usuário.";
    }
    showToast(msg || "Erro ao salvar usuário.", "error");
  } finally {
    loading.value = false;
  }
};

// Função para extrair as iniciais do nome do usuário (usada para o avatar placeholder)
const getInitials = (nome) => {
  if (!nome) return "U";
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
};
</script>

<template>
  <div class="page" v-if="!loading">
    <div :class="['layout-grid', { 'is-admin': isAdmin }]">
      
      <section class="panel my-profile">
        <div class="panel-header">
          <h2>Meu Perfil</h2>
        </div>
        
        <div class="profile-content">
          <div class="avatar-section">
            <div class="avatar-container" @click="dispararUpload">
              <img v-if="usuarioLogado.foto_perfil" :src="usuarioLogado.foto_perfil" alt="Avatar" />
              <div v-else class="avatar-placeholder">{{ getInitials(usuarioLogado.nome) }}</div>
              <div class="avatar-overlay">Trocar</div>
            </div>
            <input type="file" ref="fileInput" @change="atualizarFoto" accept="image/*" hidden />
            <div class="avatar-info">
              <h3>{{ usuarioLogado.nome }}</h3>
              <span class="role-badge">{{ usuarioLogado.funcao }}</span>
            </div>
          </div>

          <form @submit.prevent="salvarMeuPerfil" class="form-minimal">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" v-model="usuarioLogado.nome" required />
            </div>
            <div class="form-group">
              <label>E-mail (Login)</label>
              <input type="email" :value="usuarioLogado.email" disabled class="disabled-input" />
            </div>
            <div class="form-group">
              <label>Telefone / Ramal</label>
              <input type="text" v-model="usuarioLogado.telefone" placeholder="(00) 00000-0000" />
            </div>
            
            <div class="profile-actions">
              <button type="submit" class="btn-primary">Atualizar Meus Dados</button>
              <button type="button" class="btn-outline w-full" @click="showPasswordModal = true">
                <img src="../assets/padlock.png" alt="Alterar Senha" class="icon" />
                Alterar Minha Senha
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="panel user-management" v-if="isAdmin">
        <div class="panel-header flex-between">
          <h2>Gerenciamento de Usuários</h2>
          <button class="btn-outline" @click="abrirModalNovo">+ Novo Usuário</button>
        </div>

        <div class="user-list">
          <div v-for="user in usuarios" :key="user.id" class="user-item">
            <div class="user-item-left">
              <div class="mini-avatar">
                <img v-if="user.foto_perfil" :src="user.foto_perfil" />
                <span v-else>{{ getInitials(user.nome) }}</span>
              </div>
              <div class="user-details">
                <strong>{{ user.nome }} <span v-if="user.id === usuarioLogado.id" class="me-tag">(Você)</span></strong>
                <small>{{ user.funcao }} • <span :class="user.ativo ? 'text-green' : 'text-red'">{{ user.ativo ? 'Ativo' : 'Inativo' }}</span></small>
              </div>
            </div>
            <button class="btn-icon" @click="abrirModalEditar(user)">Editar</button>
          </div>
        </div>
      </section>

    </div>

    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ modalMode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário' }}</h2>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        
        <form @submit.prevent="salvarUsuarioModal" class="form-minimal modal-form">
          <div class="form-group">
            <label>Nome Completo</label>
            <input type="text" v-model="formModal.nome" required />
          </div>
          
          <div class="form-group">
            <label>Telefone</label>
            <input type="text" v-model="formModal.telefone" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Função</label>
              <select v-model="formModal.funcao">
                <option value="Operador">Operador</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status da Conta</label>
              <select v-model="formModal.ativo">
                <option :value="true">Ativo</option>
                <option :value="false">Inativo</option>
              </select>
            </div>
          </div>

          <template v-if="modalMode === 'create'">
            <hr class="divider" />
            <div class="form-group">
              <label>E-mail de Login</label>
              <input type="email" v-model="formModal.email" required />
            </div>
            <div class="form-group">
              <label>Senha Provisória</label>
              <input type="password" v-model="formModal.senha" required minlength="6" />
            </div>
          </template>

          <div class="modal-actions">
            <button type="button" class="btn-text" @click="showModal = false">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Usuário</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-overlay" v-if="showPasswordModal" @click.self="showPasswordModal = false">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>Alterar Senha</h2>
          <button class="close-btn" @click="showPasswordModal = false">×</button>
        </div>
        
        <form @submit.prevent="alterarMinhaSenha" class="form-minimal modal-form">
          <div class="form-group">
            <label>Nova Senha</label>
            <input type="password" v-model="novaSenha" required minlength="6" placeholder="Mínimo 6 caracteres" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-text" @click="showPasswordModal = false">Cancelar</button>
            <button type="submit" class="btn-primary">Confirmar Nova Senha</button>
          </div>
        </form>
      </div>
    </div>

    <div :class="['toast-notification', toast.type, { 'show': toast.show }]">
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
/* Estilos gerais */
.page {
  width: 101.2%;
  height: 100%;
  margin-top: -1rem;
  padding-bottom: 40px;
}

/* Layout principal */
.layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.layout-grid.is-admin {
  grid-template-columns: 400px 1fr;
  align-items: start;
}

/* Paineis */
.panel {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.panel-header {
  padding: 24px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

/* Perfil - esquerda */
.profile-content {
  padding: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  background: #334155;
  flex-shrink: 0;
}

.avatar-container img, .avatar-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  transition: 0.2s;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-info h3 {
  margin: 0 0 6px 0;
  font-size: 1.2rem;
  color: #0f172a;
}

.role-badge {
  background: #f39c1220;
  color: #d68910;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* Form minimalista */
.form-minimal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.form-group input, .form-group select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #334155;
  background: #f8fafc;
  transition: all 0.2s;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #f39c12;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

.disabled-input {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

/* Lista de usuarios - direita */
.user-list {
  display: flex;
  flex-direction: column;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.user-item:hover {
  background: #f8fafc;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mini-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #475569;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
}

.mini-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-details strong {
  font-size: 0.95rem;
  color: #1e293b;
}

.user-details small {
  font-size: 0.8rem;
  color: #64748b;
}

.me-tag {
  color: #f39c12;
  font-size: 0.75rem;
  margin-left: 4px;
}

.text-green { color: #10b981; font-weight: 500; }
.text-red { color: #ef4444; font-weight: 500; }

/* Estilos para botões */
.btn-primary {
  background: #f39c12;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-primary:hover { background: #d68910; }

.btn-outline {
  background: transparent;
  color: #f39c12;
  border: 1px solid #f39c12;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}
.btn-outline:hover {
  background: #f39c12;
  color: white;
}
.w-full { width: 100%; padding: 10px; border-radius: 8px; }

.btn-icon {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-icon:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-text {
  background: transparent;
  color: #64748b;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.btn-text:hover { color: #0f172a; }

.icon{
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-small {
  max-width: 350px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 { margin: 0; font-size: 1.1rem; color: #0f172a; }

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
}

.modal-form {
  padding: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 9999;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-notification.show { transform: translateY(0); opacity: 1; }
.toast-notification.success { background-color: #2ecc71; }
.toast-notification.error { background-color: #e74c3c; }

/* Responsividade */
@media (max-width: 900px) {
  .layout-grid.is-admin { grid-template-columns: 1fr; }
}
</style>