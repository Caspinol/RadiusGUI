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
      getResult: 'utils/getResult',
    }),
  },
  created() {
    this.update();
    this.timer = setInterval(
      function() {
        this.update();
      }.bind(this),
      20000
    );
  },
  methods: {
    update() {
      this.$store.dispatch('utils/getHostStats').catch(() => {
        if (this.getResult.result) {
          this.$snotify[this.getResult.result](
            this.getResult.message,
            this.getResult.title
          );
        }
      });
    },
  },
};
</script>
