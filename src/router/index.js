import { createRouter, createWebHistory } from 'vue-router'

// Importing routes
import Home from '../views/Home.vue'
import Contact from '../views/Contact.vue'
import OurServices from '../views/OurServices.vue'
import Login from '../views/Login.vue'

// Define route access
const routes = [
    { path : '/', component: Home },
    { path : '/contact', component: Contact },
    { path : '/ourServices', component: OurServices },
    { path : '/login', component: Login }
]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router