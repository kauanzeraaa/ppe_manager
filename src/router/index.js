import { createRouter, createWebHistory } from 'vue-router'

// Importando as views para as rotas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Historic from '../views/Historic.vue'
import Profile from '../views/Profile.vue'
import Record from '../views/Record.vue'
import Request from '../views/Request.vue'
import Settings from '../views/Settings.vue'
import Stock from '../views/Stock.vue'

// Define as rotas
const routes = [
    { path : '/', component: Home },
    { path : '/login', component: Login },
    { path : '/register', component: Register },
    { path : '/dashboard', component: Dashboard },
    { path : '/historic', component: Historic },
    { path : '/profile', component: Profile },
    { path : '/record', component: Record },
    { path : '/request', component: Request },
    { path : '/settings', component: Settings },
    { path : '/stock', component: Stock }

]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router