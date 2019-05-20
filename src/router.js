import Vue from 'vue';
import firebase from 'firebase';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Join from './views/Join.vue';
import Single from './views/Single.vue';
import Multi from './views/Multi.vue';
import Battle from './views/Battle.vue';
import Pack from './views/Pack.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '*',
      name: 'Join',
      component: Join,
    }, {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/single',
      name: 'single',
      component: Single,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/pack',
      name: 'pack',
      component: Pack,
      meta: {
        requiresAuth: true,
      },
    }, {
      path: '/multi',
      name: 'multi',
      component: Multi,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/battle/:battleID',
      name: 'battle',
      component: Battle,
      props: true,
      meta: {
        requiresAuth: true,
      },
    }
  ],
});
router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) next('join');
  else if (!requiresAuth && currentUser) next('home');
  else next();
});
export default router;
