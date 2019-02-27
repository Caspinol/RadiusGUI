export const state = () => ({
  accounting: [],
  accCount: 0,
});

export const mutations = {
  ACC_FETCH_SUCCESS(state, { accounting, count }) {
    state.accounting = accounting;
    state.accCount = count;
  },
};

export const getters = {
  getAccounting(state) {
    return state.accounting;
  },
  getAccCount(state) {
    return state.accCount;
  },
};

export const actions = {
  async showAccounting({ commit, dispatch }, pagination) {
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
      const notif = {
        type: 'error',
        message: 'There was an error fetching accounting data. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },
};
