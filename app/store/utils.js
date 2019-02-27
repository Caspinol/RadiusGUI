export const state = () => ({
  totalMem: '',
  freeMem: '',
  uptime: '',
});

export const getters = {
  getTotalMem(state) {
    return state.totalMem;
  },
  getFreeMem(state) {
    return state.freeMem;
  },
  getUptime(state) {
    return state.uptime;
  },
};

export const mutations = {
  GET_HOST_STATS_SUCCESS(state, stats) {
    state.totalMem = stats.totalMem;
    state.freeMem = stats.freeMem;
    state.uptime = stats.uptime;
  },
};

export const actions = {
  getHostStats({ commit, dispatch }) {
    this.$axios
      .post('utils/getHostStats')
      .then(({ data }) => {
        commit('GET_HOST_STATS_SUCCESS', data);
      })
      .catch(err => {
        const notif = {
          type: 'error',
          message: 'Failed to query host data. ' + err.message,
        };
        dispatch('notification/add', notif, { root: true });
      });
  },
};
