const state = () => ({
  notifications: [],
});

let notificationId = 1;

const mutations = {
  PUSH(state, notification) {
    state.notifications.push({
      ...notification,
      id: notificationId++,
    });
  },

  DELETE(state, notification) {
    state.notifications = state.notifications.filter(
      (notif) => notif.id !== notification.id
    );
  },
};

const getters = {
  getNotifications(state) {
    return state.notifications;
  },
};

const actions = {
  add({ commit }, notification) {
    commit('PUSH', notification);
  },
  remove({ commit }, notification) {
    commit('DELETE', notification);
  },
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
