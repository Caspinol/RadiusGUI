export const state = () => ({
  result: '',
  message: '',
  title: '',
  accounting: [],
  accCount: 0,
});

export const mutations = {
  ACC_FETCH_SUCCESS(state, { accounting, count }) {
    state.accounting = accounting;
    state.accCount = count;
    state.result = '';
  },

  ACC_FETCH_FAIL(state, err) {
    state.result = 'error';
    state.message = 'Failed to fetch accounting data.\nError: ' + err;
    state.title = 'Failed to load!';
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
  getAccounting(state) {
    return state.accounting;
  },
  getAccCount(state) {
    return state.accCount;
  },
};

export const actions = {
  async showAccounting({ commit }, pagination) {
    try {
      const { data } = await this.$axios.post(
        'accounting/showAccounting',
        pagination
      );
      commit('ACC_FETCH_SUCCESS', {
        accounting: data.pageData,
        count: data.total_count,
      });
    } catch (err) {
      commit('ACC_FETCH_FAIL', err);
    }
  },
};
