const state = {
  user: null,
  users: [],
};

const actions = {
  async register({ commit }, user_data) {
    const { data } = await this._vm.$axios.post('login/register', user_data);
    commit('set_user', data.user);
  },
  async get_logins({ commit }) {
    const { data } = await this._vm.$axios.post('login/get-logins');
    commit('set_users', data.logins);
  },
  async login({ commit }, user_data) {
    const { data } = await this._vm.$axios.post('login/login', user_data);
    console.log(data);
    commit('set_user', data.user);
  },
};

const mutations = {
  set_user(state, user_data) {
    state.user = user_data;
  },
  set_users(state, users) {
    state.users = users;
  },
};

const getters = {
  get_login(state) {
    return state.user;
  },
  get_logins(state) {
    return state.users;
  },

  get_logins_count(state) {
    return state.users.length;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
