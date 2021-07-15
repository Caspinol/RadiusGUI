const state = () => ({
  profiles: [],
  profileCount: 0,
  currentProfile: [],
  currentProfileName: '',
});

const mutations = {
  ADD_ROW(state, profileRow) {
    state.currentProfile.push(profileRow);
  },

  REMOVE_ROW(state, profileRow) {
    const idx = state.currentProfile.indexOf(profileRow);
    if (idx > -1) state.currentProfile.splice(idx, 1);
  },

  UPDATE_PROFILE_LIST(state, profile) {
    const idx = state.profiles.findIndex((el) => {
      return el.groupname === profile.groupname;
    });

    // If the old profile exists remove it before adding new one
    if (idx > -1) {
      state.profiles.splice(idx, 1);
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

  FETCH_PROFILES_SUCCESS(state, { profiles, count }) {
    state.profiles = profiles;
    state.profileCount = count;
  },
};

const getters = {
  getProfiles(state) {
    return state.profiles;
  },

  getProfileCount(state) {
    return state.profileCount;
  },

  getProfile(state) {
    return state.currentProfile;
  },

  getCurrentProfileName(state) {
    return state.currentProfileName;
  },
};

const actions = {
  async fetchProfile({ commit, dispatch }, name) {
    try {
      const { data } = await this.$axios.post('profiles/get-profile', { name });
      commit('SET_PROFILE', data.pageData);
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error while fething profile. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async fetchProfiles({ commit, dispatch }, pagination) {
    try {
      const { data } = await this.$axios.post(
        'profiles/list-profiles',
        pagination
      );
      console.log(data);
      commit('FETCH_PROFILES_SUCCESS', data);
    } catch (err) {
      const notif = {
        type: 'error',
        message:
          'There was an error while fething profile list. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async saveProfile({ commit, state, dispatch }) {
    try {
      await this.$axios.post('profiles/save-profile', {
        name: state.currentProfileName,
        rows: state.currentProfile,
      });
      commit('UPDATE_PROFILE_LIST', {
        groupname: state.currentProfileName,
        count: 0,
      });
      const notif = {
        type: 'success',
        message: 'Profile saved.',
        title: 'Suucess',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'There was an error while saving the profile. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async deleteProfile({ commit, dispatch }, profile) {
    try {
      await this.$axios.post('profiles/delete-profile', {
        name: profile.groupname,
      });
      commit('UPDATE_PROFILE_LIST', {
        groupname: profile.groupname,
      });
      const notif = {
        type: 'success',
        message: 'Profile deleted succesfully.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message:
          'There was an error while deleting the profile. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },

  async submitWizard({ commit, dispatch }, wizardData) {
    try {
      await this.$axios.post('profiles/wizardProfile', wizardData);
      const { data } = await this.$axios.post('profiles/list-profiles');
      commit('FETCH_PROFILES_SUCCESS', data);
      const notif = {
        type: 'success',
        message: 'Profile created.',
      };
      dispatch('notification/add', notif, { root: true });
    } catch (err) {
      const notif = {
        type: 'error',
        message: 'Failed to create the profile. ' + err.message,
      };
      dispatch('notification/add', notif, { root: true });
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
