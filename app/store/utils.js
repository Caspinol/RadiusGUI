export const state = () => ({
  totalMem: '',
  freeMem: '',
  uptime: '',
  dbStatus: false,
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
  getDbStatus(state) {
    return state.dbStatus;
  },
};

export const mutations = {
  GET_HOST_STATS_SUCCESS(state, stats) {
    state.totalMem = stats.totalMem;
    state.freeMem = stats.freeMem;
    state.uptime = stats.uptime;
  },

  SET_DB_STATUS(state, status) {
    state.dbStatus = !!status.isRunning;
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

  getDbCheck({ commit, dispatch }) {
    this.$axios
      .post('utils/get-db-status')
      .then(({ data }) => {
        commit('SET_DB_STATUS', data);
      })
      .catch(err => {
        const notif = {
          type: 'error',
          title: 'Error',
          message: 'Failed to query database status. ' + err.message,
        };
        dispatch('notification/add', notif, { root: true });
      });
  },
};
