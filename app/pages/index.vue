<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 md6>
      <LastLogins />
    </v-flex>
    <v-flex xs12 sm6 md6>
      <IpPools />
    </v-flex>
    <v-flex xs12 sm12 md12>
      <TopXList :items="big_traffic_users" />
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

  data() {
    return {
      big_traffic_users: [],
    };
  },

  async mounted() {
    let d = {};
    try {
      const { data } = await this.$axios.post('dashboard/show-dashboard');
      d = data;
    } catch (err) {
      console.log(err);
    }
    this.big_traffic_users = d.big_traffic_users || [];
  },
};
</script>
