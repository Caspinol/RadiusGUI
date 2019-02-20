export const state = () => ({
  result: '',
  message: '',
  title: '',
  pools: [],
  poolCount: 0,
});

export const mutations = {
  SET_POOLS(state, { pools, count }) {
    state.pools = pools;
    state.poolCount = count;
    state.result = '';
  },

  FETCH_POOLS_FAIL(state) {
    state.result = 'error';
    state.message = 'There was an error while fetching the pool list.';
    state.title = 'Error loading IP pools!';
  },

  DELETE_SUCCESS(state, item) {
    state.result = 'success';
    state.message = 'IP entry deleted successfully.';
    state.title = 'Success!';

    const idx = state.pools.indexOf(item);
    if (idx > -1) {
      state.pools.splice(idx, 1);
      state.poolCount--;
    }
  },
  DELETE_FAIL(state, err) {
    state.result = 'error';
    state.message = 'There was an issue deleting entry. Error: ' + err;
    state.title = 'Failed to delete!';
  },

  UPDATE_IP_SUCCESS(state, item) {
    //Swap the old entry with new one
    const idx = state.pools.findIndex(el => {
      return item.framedipaddress === el.framedipaddress;
    });
    if (idx > -1) {
      state.pools.splice(idx, 1, item);
    }

    state.result = 'success';
    state.message = 'IP sucesfuly updated.';
    state.title = 'Updated!';
  },

  UPDATE_IP_FAIL(state, err) {
    state.result = 'error';
    state.message = 'Failed to update IP entry.\n Error: ' + err;
    state.title = 'Failed to update!';
  },

  SAVE_IP_SUCCESS(state, item) {
    state.pools.push(item);
    state.poolCount++;

    state.result = 'success';
    state.message = 'IP saved.';
    state.title = 'Saved!';
  },

  SAVE_IP_FAIL(state, err) {
    state.result = 'error';
    state.message = 'Failed to save IP entry.\n Error: ' + err;
    state.title = 'Failed to save!';
  },

  SAVE_POOL_SUCCESS(state) {
    state.result = 'success';
    state.message = 'IP pool has been added.';
    state.title = 'Saved!';
  },

  SAVE_POOL_FAIL(state, err) {
    state.result = 'error';
    state.message = 'Failed to create IP pool entry.\n Error: ' + err;
    state.title = 'Failed to create!';
  },
};

export const getters = {
  getResult(state) {
    return {
      result: state.result,
      message: state.message,
      title: state.title,
    };
  },

  getPools(state) {
    return state.pools;
  },

  getPoolCount(state) {
    return state.poolCount;
  },
};

export const actions = {
  async deleteIP({ commit }, item) {
    try {
      await this.$axios.post('ippools/delete-ip', { id: item.id });
      commit('DELETE_SUCCESS', item);
    } catch (err) {
      commit('DELETE_FAIL', err);
    }
  },

  async getPools({ commit }, pagination) {
    try {
      const { data } = await this.$axios.post('ippools/show-pools', pagination);
      commit('SET_POOLS', { pools: data.pageData, count: data.total_count });
    } catch (err) {
      commit('FETCH_POOLS_FAIL', err);
    }
  },

  async updateIP({ commit }, item) {
    try {
      await this.$axios.post('ippools/update-ip', item);
      commit('UPDATE_IP_SUCCESS', item);
    } catch (err) {
      commit('UPDATE_IP_FAIL', err);
    }
  },

  async saveIP({ commit }, item) {
    try {
      await this.$axios.post('ippools/save-ip', item);
      commit('SAVE_IP_SUCCESS', item);
    } catch (err) {
      commit('SAVE_IP_FAIL', err);
    }
  },

  async savePool({ commit }, pool) {
    try {
      await this.$axios.post('ippools/save-pool', pool);
      commit('SAVE_POOL_SUCCESS');
    } catch (err) {
      commit('SAVE_POOL_FAIL', err);
    }
  },
};
