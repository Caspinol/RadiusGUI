const state = () => ({
  pools: [],
  poolCount: 0,
});

const mutations = {
  SET_POOLS(state, { pools, count }) {
    state.pools = pools;
    state.poolCount = count;
  },

  DELETE_SUCCESS(state, item) {
    const idx = state.pools.indexOf(item);
    if (idx > -1) {
      state.pools.splice(idx, 1);
      state.poolCount--;
    }
  },

  UPDATE_IP_SUCCESS(state, item) {
    //Swap the old entry with new one
    const idx = state.pools.findIndex((el) => {
      return item.framedipaddress === el.framedipaddress;
    });
    if (idx > -1) {
      state.pools.splice(idx, 1, item);
    }
  },

  SAVE_IP_SUCCESS(state, item) {
    state.pools.push(item);
    state.poolCount++;
  },
};

const getters = {
  getPools(state) {
    return state.pools;
  },

  getPoolCount(state) {
    return state.poolCount;
  },
};

const actions = {
  async deleteIP({ commit, dispatch }, item) {
    try {
      await this._vm.$axios.post('ippools/delete-ip', { id: item.id });
      commit('DELETE_SUCCESS', item);
      const notif = {
        type: 'success',
        message: 'IP deleted succesfully.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error deleting ip. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async getPools({ commit, dispatch }, pagination) {
    try {
      const { data } = await this._vm.$axios.post(
        'ippools/show-pools',
        pagination
      );
      commit('SET_POOLS', { pools: data.pageData, count: data.total_count });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error fetching pool data. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async updateIP({ commit, dispatch }, item) {
    try {
      await this._vm.$axios.post('ippools/update-ip', item);
      commit('UPDATE_IP_SUCCESS', item);
      const notif = {
        type: 'success',
        message: 'IP entry updated!',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'Failed to update the IP. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async saveIP({ commit, dispatch }, item) {
    try {
      await this._vm.$axios.post('ippools/save-ip', item);
      commit('SAVE_IP_SUCCESS', item);
      const notif = {
        type: 'success',
        message: 'IP saved!.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'Failed to save the IP. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async savePool({ commit, dispatch }, pool) {
    try {
      await this._vm.$axios.post('ippools/save-pool', pool);
      commit('SAVE_POOL_SUCCESS');
      const notif = {
        type: 'success',
        message: 'Pool saved!.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error while saving the pool. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
