import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Main
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue')
  },

  // Authentication
  {
    path: '/auth',
    component: () => import('layouts/AuthenticationLayout.vue'),
    children: [
      // Login Page
      {
        path: 'login',
        component: () => import('pages/auth/LoginPage.vue')
      },
      // Register Account Page
      {
        path: 'register',
        component: () => import('pages/auth/RegisterPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
