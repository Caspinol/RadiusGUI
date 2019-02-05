<template>		
  <v-layout row wrap>
    <v-flex xs12 sm6 md6>
      <LastLogins :items="last_logins"/>
    </v-flex>
    <v-flex xs12 sm6 md6>
      <IpPools/>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <TopXList :items="big_traffic_users"/>
    </v-flex>
  </v-layout>
</template>

<script>
import LastLogins from '../components/dashboard/LastLogins';
import TopXList from '../components/dashboard/TopXList';
import IpPools from '../components/dashboard/IpPools';

export default {
  components: {
	LastLogins,
	TopXList,
	IpPools,
  },
  async asyncData({ app }) {
	const { data } = await app.$axios.post('dashboard/show-dashboard');
	return { last_logins: data.last_logins, big_traffic_users: data.big_traffic_users };
  },
  
  data() {
	return {
      last_logins: [],
      big_traffic_users: [],
      pools: [],
    };
  },
};
</script>
