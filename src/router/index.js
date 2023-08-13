import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import login from '../views/login.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        name: '首页',
        component: HomeView
    },
    {
        path: '/login',
        name: '登陆',
        component: login
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
