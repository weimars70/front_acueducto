import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: () => import('../pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('../components/DashboardHome.vue')
      },
      {
        path: '/consumptions',
        component: () => import('../pages/ConsumptionsPage.vue')
      },
      {
        path: '/consumptions/new',
        component: () => import('../pages/NewConsumptionPage.vue')
      }
    ]
  },
  // Add catch-all route to redirect to login
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Always redirect to login if not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Redirect to dashboard if already authenticated and trying to access login
  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;