const state = () => ({
  loading: false,
});

const mutations = {
  SET_LOADING(state) {
    state.loading = true;
  },
  CLEAR_LOADING(state) {
    state.loading = false;
  },
};

const getters = {
  getLoading(state) {
    return state.loading;
  },
};

const actions = {};

import Vue from 'vue';
import Vuex from 'vuex';

import notification from './notification';
import users from './users';
import utils from './utils';
import profile from './profile';
import ippools from './ippools';
import accounting from './accounting';
import nas from './nas';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    notification,
    users,
    utils,
    profile,
    ippools,
    accounting,
    nas,
  },
});
