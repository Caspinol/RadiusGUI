export const state = () => ({
  result: '',
  message: '',
  title: '',
  profiles: [],
  currentProfile: [],
  currentProfileName: '',
});

export const mutations = {
  ADD_ROW(state, profileRow) {
    state.currentProfile.push(profileRow);
  },

  REMOVE_ROW(state, profileRow) {
    const idx = state.currentProfile.indexOf(profileRow);
    if (idx > -1) state.currentProfile.splice(idx, 1);
  },

  UPDATE_PROFILE_LIST(state, { profile, op }) {
    const idx = state.profiles.findIndex(el => {
      return el.groupname === profile.groupname;
    });

    // If the old profile exists remove it before adding new one
    if (idx > -1) {
      state.profiles.splice(idx, 1);
    }

    if (op === 'add') {
      state.profiles.push(profile);
    }

    state.result = 'success';
    state.title = 'Success!';
    if (op === 'add') {
      state.message = 'Profile list updated.';
    } else {
      state.message = 'Profile succesfully deleted.';
    }
  },

  SET_PROFILE(state, profile) {
    state.currentProfile = profile;
    state.currentProfileName = profile[0]
      ? profile[0].groupname
      : 'New Profile';
  },

  SET_PROFILE_NAME(state, name) {
    state.currentProfileName = name;
  },

  FETCH_PROFILE_FAIL() {},

  FETCH_PROFILES_SUCCESS(state, profiles) {
    state.profiles = profiles;
    state.result = 'success';
    state.message = '';
    state.title = 'Success!';
  },

  FETCH_PROFILES_FAIL(state) {
    state.result = 'error';
    state.message = 'There was an error while fething the profiles.';
    state.title = 'Error!';
  },

  SAVE_PROFILE_FAIL(state) {
    state.result = 'error';
    state.message = 'There was an error while saving the profiles.';
    state.title = 'Error saving profile!';
  },

  DELETE_PROFILE_FAIL(state) {
    state.result = 'error';
    state.message = 'There was an error while deleteing the profiles.';
    state.title = 'Error deleteing profile!';
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

  getProfiles(state) {
    return state.profiles;
  },

  getProfile(state) {
    return state.currentProfile;
  },

  getCurrentProfileName(state) {
    return state.currentProfileName;
  },
};

export const actions = {
  async fetchProfile({ commit }, name) {
    try {
      const { data } = await this.$axios.post('profiles/get-profile', { name });
      commit('SET_PROFILE', data.pageData);
    } catch (err) {
      commit('FETCH_PROFILE_FAIL', err);
    }
  },

  async fetchProfiles({ commit }) {
    try {
      const { data } = await this.$axios.post('profiles/list-profiles');
      commit('FETCH_PROFILES_SUCCESS', data.pageData);
    } catch (err) {
      console.log(err);
      commit('FETCH_PROFILES_FAIL', err);
    }
  },

  async saveProfile({ commit, state }) {
    try {
      await this.$axios.post('profiles/save-profile', {
        name: state.currentProfileName,
        rows: state.currentProfile,
      });
      commit('UPDATE_PROFILE_LIST', {
        profile: {
          groupname: state.currentProfileName,
          count: 0,
        },
        op: 'add',
      });
    } catch (err) {
      commit('SAVE_PROFILE_FAIL', err);
    }
  },

  async deleteProfile({ commit }, profile) {
    try {
      await this.$axios.post('profiles/delete-profile', {
        name: profile.groupname,
      });
      commit('UPDATE_PROFILE_LIST', {
        profile: {
          groupname: profile.groupname,
        },
        op: 'delete',
      });
    } catch (e) {
      commit('DELETE_PROFILE_FAIL');
    }
  },

  async submitWizard({ commit }, wizardData) {
    try {
      await this.$axios.post('profiles/wizardProfile', wizardData);
      const { data } = await this.$axios.post('profiles/list-profiles');
      commit('FETCH_PROFILES_SUCCESS', data.pageData);
    } catch (err) {
      commit('SAVE_PROFILE_FAIL');
    }
  },
};
