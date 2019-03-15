export const strict = false;
export const state = () => ({
  loading: false,
});

export const mutations = {
  SET_LOADING(state) {
    state.loading = true;
  },
  CLEAR_LOADING(state) {
    state.loading = false;
  },
};

export const getters = {
  getLoading(state) {
    return state.loading;
  },
};

export const actions = {};
