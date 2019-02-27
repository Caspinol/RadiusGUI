<template>
  <v-layout column>
    <v-flex mr-2>DB status: </v-flex
    ><span :class="{ running: isRunning, notRunning: !isRunning }">{{
      isRunning ? ' Running' : ' Database down!'
    }}</span>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      timer: '',
    };
  },
  computed: {
    ...mapGetters({
      isRunning: 'utils/getDbStatus',
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
      this.$store.dispatch('utils/getDbCheck');
    },
  },
};
</script>

<style scoped>
.running {
  color: green;
}
.notRunning {
  color: red;
}
</style>
