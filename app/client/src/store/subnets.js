export const state = () => ({
  ipamToken: null,
  ipamTokenExpiry: null,
  sections: [],
  subnets: [],
});

export const mutations = {
  SET_TOKEN(state, data) {
    state.ipamToken = data.token;
    state.ipamTokenExpiry = data.expires;
  },
  SET_SECTIONS(state, sections) {
    state.sections = sections;
  },
  SET_SUBNETS(state, subnets) {
    state.subnets = subnets;
  },
  CLEAR_SUBNETS(state) {
    state.subnets = [];
  },
};

export const getters = {
  getSections(state) {
    return state.sections;
  },
  getSubnets(state) {
    return state.subnets;
  },
};

export const actions = {
  async authenticate({ commit }) {
    try {
      const { data } = await this.$axios.post('subnets/get-token');
      commit('SET_TOKEN', data);
    } catch (e) {
      console.log('error fetching token', e);
    }
  },
  async fetchSections({ commit, state }) {
    try {
      const { data } = await this.$axios.post('subnets/get-sections', {
        token: state.ipamToken,
      });
      commit('SET_SECTIONS', data);
    } catch (e) {
      console.log('error fetching secions ', e);
    }
  },

  async fetchSubnets({ commit, state }, sectionId) {
    try {
      const { data } = await this.$axios.post('subnets/get-subnets', {
        token: state.ipamToken,
        sectionId,
      });

      commit('SET_SUBNETS', data);
    } catch (e) {
      console.log('error fetching pools ', e);
    }
  },
};
