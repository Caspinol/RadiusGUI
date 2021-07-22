import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('../views/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
      },
      {
        path: '/profiles',
        name: 'Profiles',
        component: () => import('../views/Profiles.vue'),
      },
      { path: '/ippools', component: () => import('../views/IpPools.vue') },
      {
        path: '/accounting',
        component: () => import('../views/Accounting.vue'),
      },
      { path: '/nas', component: () => import('../views/Nas.vue') },
      { path: '/changelog', component: () => import('../views/Changelog.vue') },
      { path: '/subnets', component: () => import('../views/Subnets.vue') },
      { path: '/settings', component: () => import('../views/Settings.vue') },
    ],
  },
  { path: '/login', component: () => import('../views/Login.vue') },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['login/get_login']) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
  next();
});

export default router;
