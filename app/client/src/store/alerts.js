const state = () => ({
  settings: [],
});

const mutations = {
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },
};

const getters = {
  getSettings(state) {
    return state.settings;
  },
};

const actions = {
  async fetchAlertSettings({ commit, dispatch }) {
    try {
      const { data } = await this._vm.$axios.post(
        'settings/get-alert-settings'
      );
      commit('SET_SETTINGS', data.settings);
    } catch (e) {
      const notif = {
        type: 'error',
        message: 'Failed to fetch the alert settings. ' + e.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async saveAlertSettings({ dispatch }, settings) {
    try {
      await this._vm.$axios.post('settings/save-alert-settings', settings);
      const notif = {
        type: 'success',
        message: 'Settings stored succesfully!',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (e) {
      const notif = {
        type: 'error',
        message: 'Failed to save the alert settings. ' + e.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },
};

export default { namespaced: true, state, getters, mutations, actions };
