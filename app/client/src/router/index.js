import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('../views/DefaultLayout.vue'),
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
      { path: '/settings', component: () => import('../views/Settings.vue') },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
