import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../Component/Page/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: Home,
        meta: {
            title: 'Home',
        }
    },
    {
        path: '/pet',
        component: () => import('../Component/Page/Pet/List.vue'),
        meta: {
            title: 'List Pets',
        }
    },
    {
        path: '/pet/create',
        component: () => import('../Component/Page/Pet/Create.vue'),
        meta: {
            title: 'Create Pet',
        }
    },
    {
        path: '/pet/:id',
        component: () => import('../Component/Page/Pet/Read.vue'),
        meta: {
            title: 'Read Pet',
        }
    },
    {
        path: '/pet/:id/update',
        component: () => import('../Component/Page/Pet/Update.vue'),
        meta: {
            title: 'Update Pet',
        }
    },
    {
        path: '*',
        component: () => import('../Component/Page/NotFound.vue'),
        meta: {
            title: 'Not Found',
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) document.title = to.meta.title;

    next();
});

export default router;
