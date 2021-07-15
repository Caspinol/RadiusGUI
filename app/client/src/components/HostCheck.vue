<template>
  <v-layout row>
    <v-flex column>
      <v-flex row mt-1 class="white--text">Total mem:</v-flex>
      <v-flex row class="green--text">{{ getTotalMem }}</v-flex>
    </v-flex>
    <v-flex column>
      <v-flex row mt-1 class="white--text">Free mem:</v-flex>
      <v-flex row class="green--text">{{ getFreeMem }}</v-flex>
    </v-flex>
    <v-flex column>
      <v-flex row mt-1 class="white--text">Uptime: </v-flex>
      <v-flex row class="green--text">{{ getUptime }}</v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    ...mapGetters({
      getTotalMem: 'utils/getTotalMem',
      getFreeMem: 'utils/getFreeMem',
      getUptime: 'utils/getUptime',
    }),
  },
  mounted() {
    this.update();
    this.timer = setInterval(this.update, 20000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    update() {
      this.$store.dispatch('utils/getHostStats');
    },
  },
};
</script>
