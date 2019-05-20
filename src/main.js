import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';

import router from './router';

Vue.config.productionTip = false;

let app = '';

const config = {
  apiKey: 'AIzaSyBbZ9_rBN9XeRE6w1bjxQN07DptWovYvA0',
  authDomain: 'kodujwebapp.firebaseapp.com',
  databaseURL: 'https://kodujwebapp.firebaseio.com',
  projectId: 'kodujwebapp',
  storageBucket: 'kodujwebapp.appspot.com',
  messagingSenderId: '290065728837',
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
  }
});
