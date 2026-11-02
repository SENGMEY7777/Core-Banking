import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import LoginView from '../views/LoginView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/accounts', name: 'Accounts', component: DashboardView },
  { path: '/transfers', name: 'Transfers', component: DashboardView },
  { path: '/biometrics', name: 'Biometrics', component: DashboardView },
  { path: '/admin', name: 'AdminConsole', component: DashboardView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.name !== 'Login' && !auth.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
