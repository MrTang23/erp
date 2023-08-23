import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import login from '../views/login.vue'
//个人
import personal from '../views/personal/personal.vue'
//审批
import approve from '../views/approval/approve.vue'
//指令
import productionOrder from '../views/order/productionOrder.vue'
//材料
import materialDelivery from '../views/material/materialDelivery.vue'
import materialPurchase from '../views/material/materialPurchase.vue'
import materialBack from '../views/material/materialBack.vue'
import materialGetNormal from '../views/material/materialGetNormal.vue'
//产品
import productStorageNormal from '../views/product/productStorageNormal.vue'
import productShipment from '../views/product/productShipment.vue'
//数据汇总
import materialStock from '../views/dataView/materialStock.vue'
import productStock from '../views/dataView/productStock.vue'


const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        name: '首页',
        component: HomeView,
        children:[
            {
                path: '/material-purchase',
                name: '材料采购',
                component: materialPurchase
            },
            {
                path: '/material-stock',
                name: '材料库存',
                component: materialStock
            },
            {
                path: '/material-back',
                name: '材料退库',
                component: materialBack
            },
            {
                path: '/production-order',
                name: '生产指令单',
                component: productionOrder
            },
            {
                path: '/material-delivery',
                name: '材料出厂',
                component: materialDelivery
            },
            {
                path: '/production-receipt',
                name: '材料领取',
                component: materialGetNormal
            },
            {
                path: '/product-warehousing',
                name: '产品入库',
                component: productStorageNormal
            },
            {
                path: '/product-shipment',
                name: '产品出货',
                component: productShipment
            },
            {
                path: '/approve',
                name: '我的待办',
                component: approve
            },
            {
                path: '/personal',
                name: '个人设置',
                component: personal
            },
            {
                path: '/product-stock',
                name: '产品库存',
                component: productStock
            },
        ]
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
