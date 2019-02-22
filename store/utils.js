export const state = () => ({
  result: '',
  message: '',
  title: '',
  totalMem: '',
  freeMem: '',
  uptime: '',
});

export const getters = {
  getResult(state) {
    return {
      result: state.result,
      message: state.message,
      title: state.title,
    };
  },
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
    state.result = '';
  },

  GET_HOST_STATS_FAIL(state, err) {
    state.result = 'error';
    state.message = 'Failed to get host statistics.\n Error: ' + err;
    state.title = 'Failed query host!';
  },
};

export const actions = {
  async getHostStats({ commit }) {
    try {
      const { data } = await this.$axios.post('utils/getHostStats');
      commit('GET_HOST_STATS_SUCCESS', data);
    } catch (err) {
      commit('GET_HOST_STATS_FAIL');
    }
  },
};
