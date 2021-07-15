import axios from 'axios';

const ax = axios.create({
  baseURL: 'http://192.168.1.200:3000/api',
  timeout: 5000,
});
export default {
  install(Vue, store) {
    ax.interceptors.request.use((config) => {
      store.commit('SET_LOADING');
      return config;
    });

    ax.interceptors.response.use((response) => {
      store.commit('CLEAR_LOADING');
      return response;
    });

    Vue.prototype.$axios = ax;
  },
};
