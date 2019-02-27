<template>
  <v-layout row>
    <v-flex column>
      <v-flex>Total mem:</v-flex> <span>{{ getTotalMem }}</span>
    </v-flex>
    <v-flex column>
      <v-flex>Free mem:</v-flex> <span>{{ getFreeMem }}</span>
    </v-flex>
    <v-flex column>
      <v-flex>Uptime: </v-flex><span>{{ getUptime }}</span>
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
  methods: {
    update() {
      this.$store.dispatch('utils/getHostStats');
    },
  },
};
</script>
