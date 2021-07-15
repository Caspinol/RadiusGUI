const state = () => ({
  totalMem: '',
  freeMem: '',
  uptime: '',
  dbStatus: false,
  pools: [],
  lastLogins: {
    logins: [],
    count: 0,
  },
});

const getters = {
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
  getPools(state) {
    return state.pools;
  },
  getLogins(state) {
    return state.lastLogins;
  },
};

const mutations = {
  GET_HOST_STATS_SUCCESS(state, stats) {
    state.totalMem = stats.totalMem;
    state.freeMem = stats.freeMem;
    state.uptime = stats.uptime;
  },

  SET_DB_STATUS(state, status) {
    state.dbStatus = !!status.isRunning;
  },

  SET_POOLS(state, pools) {
    state.pools = pools;
  },
  SET_LAST_LOGINS(state, logins) {
    state.lastLogins = logins;
  },
};

const actions = {
  getHostStats({ commit, dispatch }) {
    this._vm.$axios
      .post('utils/getHostStats')
      .then(({ data }) => {
        console.log(data);
        commit('GET_HOST_STATS_SUCCESS', data);
      })
      .catch((err) => {
        const notif = {
          type: 'error',
          message: 'Failed to query host data. ' + err.message,
        };
        dispatch('notification/add', notif, { root: true });
      });
  },

  getDbCheck({ commit, dispatch }) {
    this._vm.$axios
      .post('utils/get-db-status')
      .then(({ data }) => {
        commit('SET_DB_STATUS', data);
      })
      .catch((err) => {
        const notif = {
          type: 'error',
          title: 'Error',
          message: 'Failed to query database status. ' + err.message,
        };
        dispatch('notification/add', notif, { root: true });
      });
  },

  getPoolsData({ commit, dispatch }) {
    this._vm.$axios
      .post('utils/get-pools')
      .then(({ data }) => commit('SET_POOLS', data.pools))
      .catch((err) => {
        const notif = {
          type: 'error',
          title: 'Error',
          message: 'Failed to get pools data.. ' + err.message,
        };
        dispatch('notification/add', notif, { root: true });
      });
  },

  getLastLogins({ commit, dispatch }, pagination) {
    this._vm.$axios
      .post('dashboard/showLastLogins', pagination)
      .then(({ data }) => commit('SET_LAST_LOGINS', data))
      .catch((err) => {
        const notif = {
          type: 'error',
          title: 'Error',
          message: 'Failed to get last logins data. ' + err.message,
        };
        dispatch('notification/add', notif, { root: true });
      });
  },
};
export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};