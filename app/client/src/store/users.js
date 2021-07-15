const state = () => ({
  users: [],
  userCount: 0,
  profiles: [],
  ip4Pools: [],
  ip6PDPools: [],
  ip6NTPools: [],
});

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },

  SET_USER_COUNT(state, userCount) {
    state.userCount = userCount;
  },
  SET_USER_SETTINGS_SUCCESS(
    state,
    { profiles, ip4Pools, ip6PDPools, ip6NTPools }
  ) {
    state.profiles = profiles;
    state.ip4Pools = ip4Pools;
    state.ip6PDPools = ip6PDPools;
    state.ip6NTPools = ip6NTPools;
  },
  DELETE_USER_SUCCESS(state, user) {
    const userIdx = state.users.indexOf(user);
    state.users.splice(userIdx, 1);
    state.userCount--;
  },
  SAVE_USER_SUCCESS(state, user) {
    const idx = state.users.findIndex((u) => {
      return u.username === user.username;
    });
    if (idx > -1) {
      state.users.splice(idx, 1);
      state.users.push(user);
    }
  },
};

const getters = {
  getUsers(state) {
    return state.users;
  },
  getUserCount(state) {
    return state.userCount;
  },
  getProfiles(state) {
    return state.profiles;
  },
  getIpv4Pools(state) {
    return state.ip4Pools;
  },
  getIpv6PDPools(state) {
    return state.ip6PDPools;
  },
  getIpv6NTPools(state) {
    return state.ip6NTPools;
  },
};

const actions = {
  async fetchUsers({ commit }, req) {
    const { data } = await this._vm.$axios.post('users/users-page', req);
    commit('SET_USERS', data.pageData);
    commit('SET_USER_COUNT', data.total_count);
  },

  async fetchUserSettings({ commit }) {
    const { data } = await this._vm.$axios.post('users/user-settings');
    commit('SET_USER_SETTINGS_SUCCESS', data);
  },

  async deleteUser({ commit, dispatch }, user) {
    try {
      await this._vm.$axios.post('users/delete-user', {
        username: user.username,
      });
      commit('DELETE_USER_SUCCESS', user);
      const notif = {
        type: 'success',
        message: 'User deleted.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error while deleting the user. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async saveUser({ commit, dispatch }, user) {
    try {
      await this._vm.$axios.post('users/store-user', user);
      commit('SAVE_USER_SUCCESS', user);
      const notif = {
        type: 'success',
        message: 'User stored.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error while storing the user. ' + err.message,
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
