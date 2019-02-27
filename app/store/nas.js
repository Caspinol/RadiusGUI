export const state = () => ({
  nasList: [],
  nasCount: 0,
});

export const mutations = {
  SET_NASLIST(state, nas) {
    state.nasList = nas.nasList;
    state.nasCount = nas.count;
  },

  ADD_NAS(state, nas) {
    state.nasList.push(nas);
    state.nasCount++;
  },

  UPDATE_NAS(state, nas) {
    const idx = state.nasList.findIndex(n => {
      return n.nasname === nas.nasname;
    });
    if (idx > -1) {
      state.nasList.splice(idx, 1, nas);
    }
  },

  REMOVE_NAS(state, nas) {
    const idx = state.nasList.indexOf(nas);
    if (idx > -1) {
      state.nasList.splice(idx, 1);
      state.nasCount--;
    }
  },
};

export const getters = {
  getNaslist(state) {
    return {
      list: state.nasList,
      count: state.nasCount,
    };
  },
};

export const actions = {
  async fetchNasList({ commit, dispatch }, pagination) {
    try {
      const { data } = await this.$axios.post('nas/show-naslist', pagination);
      commit('SET_NASLIST', data);
    } catch (err) {
      const notif = {
        type: 'error',
        title: 'Error!',
        message: 'Failed to fetch the NAS list. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async saveNas({ commit, dispatch }, item) {
    try {
      await this.$axios.post('nas/save-nas', item);
      commit('ADD_NAS', item);
      const notif = {
        type: 'success',
        title: 'Success!',
        message: 'NAS saved.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        title: 'Error!',
        message: 'Failed to save the NAS. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async updateNas({ commit, dispatch }, item) {
    try {
      await this.$axios.post('nas/update-nas', item);
      commit('UPDATE_NAS', item);
      const notif = {
        type: 'success',
        title: 'Success!',
        message: 'NAS updated.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        title: 'Error!',
        message: 'Failed to update the NAS. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async deleteNas({ commit, dispatch }, item) {
    try {
      await this.$axios.post('nas/delete-nas', item);
      commit('REMOVE_NAS', item);
      const notif = {
        type: 'success',
        title: 'Success!',
        message: 'NAS deleted.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        title: 'Error!',
        message: 'Failed to delete the NAS. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },
};
