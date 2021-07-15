import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Axios from './plugins/axios';

import Snotify from 'vue-snotify';
import '../node_modules/vue-snotify/styles/dark.css';

Vue.use(Snotify, {
  toast: {
    bodyMaxLength: 200,
  },
});

Vue.use(Axios, store);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
