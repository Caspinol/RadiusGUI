export const state = ()=>({
  users: [],
  userCount: 0,
  profiles: [],
  ip4Pools: [],
  ip6PDPools: [],
  ip6NTPools: [],
  result: '',
  message: '',
  title: ''
});

export const mutations = {
  SET_USERS(state, users){
	state.users = users;
  },

  SET_USER_COUNT(state, userCount){
	state.userCount = userCount;
  },
  SET_USER_SETTINGS_SUCCESS(state, {profiles, ip4Pools, ip6PDPools, ip6NTPools}){
	state.profiles = profiles;
	state.ip4Pools = ip4Pools;
	state.ip6PDPools = ip6PDPools;
	state.ip6NTPools = ip6NTPools;
  },
  DELETE_USER_SUCCESS(state, user){
	const userIdx = state.users.indexOf(user);
	state.users.splice(userIdx, 1);
	state.userCount --;
	state.result = 'success';
	state.message = 'User deleted!';
	state.title = 'Success!';
  },
  DELETE_USER_FAIL(state){
	state.result = 'error';
	state.message = 'There was an error while deleting user.';
	state.title = 'Failed to delete...';
  },
  SAVE_USER_SUCCESS(state, user){
	const idx = state.users.findIndex((u)=>{
	  return u.username === user.username;
	});
	if(idx > -1){
	  state.users.splice(idx, 1);
	  state.users.push(user);
	}
	state.result = 'success';
	state.message = 'User saved!';
	state.title = 'Success!';
  },
  SAVE_USER_FAIL(state){
	state.result = 'error';
	state.message = 'There was an error while storing the user.';
	state.title = 'Failed to save...';
  }
};

export const getters = {
  getUsers(state){
	return state.users;
  },
  getUserCount(state){
	return state.userCount;
  },
  getProfiles(state){
	return state.profiles;
  },
  getIpv4Pools(state){
	return state.ip4Pools;
  },
  getIpv6PDPools(state){
	return state.ip6PDPools;
  },
  getIpv6NTPools(state){
	return state.ip6NTPools;
  },
  getResult(state){
	return {
	  result: state.result,
	  message: state.message,
	  title: state.title
	};
  }
};

export const actions = {
  async fetchUsers({commit}, req){
	const {data} = await this.$axios.post('users/users-page', req);
	commit('SET_USERS', data.pageData);
	commit('SET_USER_COUNT', data.total_count);
  },

  async fetchUserSettings({commit}){
	const {data} = await this.$axios.post('users/user-settings');
	commit('SET_USER_SETTINGS_SUCCESS', data);
  },

  async deleteUser({commit}, user){
	try{
	  await this.$axios.post('users/delete-user', {username: user.username});
	}catch(err){
	  commit('DELETE_USER_FAIL', err);	  
	}
	commit('DELETE_USER_SUCCESS', user);
  },

  async saveUser({commit}, user){
	try{
	  await this.$axios.post('users/store-user', user);
	}catch(err){
	  commit('SAVE_USER_FAIL');
	}
	commit('SAVE_USER_SUCCESS', user);
  }
};
