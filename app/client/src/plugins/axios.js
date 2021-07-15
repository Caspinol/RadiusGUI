import axios from 'axios';

const ax = axios.create({
  baseURL: 'http://192.168.1.200:3000/api',
  timeout: 1000,
});
export default {
  install(Vue, store) {
    ax.interceptors.request.use((config) => {
      console.log('Request');
      store.commit('SET_LOADING');
      return config;
    });

    ax.interceptors.response.use((response) => {
      console.log('Response');
      store.commit('CLEAR_LOADING');
      return response;
    });

    Vue.prototype.$axios = ax;
  },
};
