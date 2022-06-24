import {
    createRouter as createVueRouter,
    createMemoryHistory,
    createWebHistory,
    RouteRecordRaw,
    Router
} from 'vue-router';
const routes: Array<RouteRecordRaw> = [
        {
            path: '/',
            name: 'index',
            meta: {
                title: '首页',
                keepAlive: true,
                requireAuth: true
            },
            component: () => import('@/views/index.vue')
        },
        {
            path: '/vueuse',
            name: 'vueuse',
            meta: {
                title: 'vueuse',
                keepAlive: true,
                requireAuth: true
            },
            component: () => import('@/views/vueUse.vue')
        }
    ]
export const createRouter = (type: 'client' | 'server'): Router =>
    createVueRouter({
        history: type === 'client' ? createWebHistory() : createMemoryHistory(),
        routes,
    });
