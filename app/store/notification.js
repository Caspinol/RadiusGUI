export const state = () => ({
  notifications: [],
});

let notificationId = 1;

export const mutations = {
  PUSH(state, notification) {
    state.notifications.push({
      ...notification,
      id: notificationId++,
    });
  },

  DELETE(state, notification) {
    state.notifications = state.notifications.filter(
      notif => notif.id !== notification.id
    );
  },
};

export const getters = {
  getNotifications(state) {
    return state.notifications;
  },
};

export const actions = {
  add({ commit }, notification) {
    commit('PUSH', notification);
  },
  remove({ commit }, notification) {
    commit('DELETE', notification);
  },
};
