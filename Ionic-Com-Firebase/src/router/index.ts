import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { auth } from '@/main.js';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/login'
  },
  {
    path: '/tabs/perfil',
    component: () => import('@/views/PerfilPage.vue'),
    meta: { autenticado: true}
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/login'
      },
      {
        path: 'login',
        component: () => import('@/views/LoginPage.vue')
      },
      {
        path: 'recuperar',
        component: () => import('@/views/RecPage.vue')
      },
      {
        path: 'cadastro',
        component: () => import('@/views/CadastroPage.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if(!to.meta.autenticado) return true;

  const user = auth.currentUser;

  if(!user) {
    return {
      path: '/tabs/login',
      query: { redirect: to.fullPath }
    };
  }

  return true;
});


export default router
