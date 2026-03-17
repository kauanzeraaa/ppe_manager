import { createRouter, createWebHistory } from 'vue-router'

// Importando as views para as rotas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// Define as rotas
const routes = [
    { path : '/', component: Home },
    { path : '/login', component: Login },
    { path : '/register', component: Register }
]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router