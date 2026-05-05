<script setup>
// Importa funções e hooks necessários do Vue e Vue Router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Variável para controlar a exibição do modal de logout
const showLogoutModal = ref(false)

// Função para abrir o modal de logout e fechar o modal ao clicar fora dele
function openLogoutModal() {
    showLogoutModal.value = true
}

function closeLogoutModal() {
    showLogoutModal.value = false
}

// Função para confirmar o logout e redirecionar para a página de login
function confirmLogout() {
    showLogoutModal.value = false
    router.push('/login')
}
</script>

<template>
    <section class="buttons">
        <router-link to="/settings" class="button-configuration">
            <span class="icon">
                <img src="../assets/icons_actions/settings.png" alt="Settings Icon">
            </span>
        </router-link>
        <button class="button-exit" type="button" @click="openLogoutModal">
            <span class="icon">
                <img src="../assets/icons_actions/exit-alt.png" alt="Exit Icon">
            </span>
        </button>   

        <!-- Modal de Logout -->
        <div v-if="showLogoutModal" class="modal-backdrop" @click="closeLogoutModal">
            <div class="modal-card" @click.stop>
                <div class="decoration"></div>
                <div class="modal-content">
                    <h3 class="modal-title">Confirmar saída</h3>
                    <p class="modal-text">Tem certeza que deseja sair da conta?</p>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" @click="closeLogoutModal">Cancelar</button>
                        <button type="button" class="btn-confirm" @click="confirmLogout">Sair</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    /* Estilos dos botões */
    .buttons {
        position: fixed;
        top: 0;
        right: 20px;
        display: flex;
        gap: 15px;
        z-index: 100;
    }

    .button-notification, .button-configuration, .button-exit {
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        display: inline-flex;
        text-decoration: none;
    }

    .button-configuration {
        background-color: var(--color-orange);
    }

    .button-exit {
        background-color: var(--color-blue-dark);
    }

    .icon {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon img {
        width: 30px;
        height: 30px;
    }

    /* Estilos do modal */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 120;
    }

    .modal-card {
        width: min(92vw, 420px);
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 12px 34px rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }

    .decoration {
        width: 100%;
        height: 9px;
        background: var(--color-orange);
        border-radius: 16px 16px 0 0;
    }

    .modal-content {
        padding: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
    }

    .modal-title {
        margin: 0 0 10px;
        font-size: 22px;
        font-family: var(--font-primary);
        font-weight: 200;
    }

    .modal-text {
        margin: 0 0 20px;
        color: #666;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
    }

    .btn-cancel, .btn-confirm {
        border: none;
        border-radius: 10px;
        padding: 12px 18px;
        cursor: pointer;
        font-weight: 600;
    }

    .btn-cancel {
        background: #e5e7eb;
        color: #111827;
    }

    .btn-confirm {
        background: var(--color-blue-dark);
        color: #fff;
    }
</style>