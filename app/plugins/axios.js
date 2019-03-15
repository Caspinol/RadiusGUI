export default function({ $axios, store }) {
  $axios.interceptors.request.use(config => {
    store.commit('SET_LOADING');
    return config;
  });
  $axios.interceptors.response.use(response => {
    store.commit('CLEAR_LOADING');
    return response;
  });
}
