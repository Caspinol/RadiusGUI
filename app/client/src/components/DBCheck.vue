<template>
  <v-layout column>
    <v-flex row mt-1 class="white--text" mr-2>DB status: </v-flex>
    <v-flex row :class="{ running: isRunning, notRunning: !isRunning }">
      {{ isRunning ? 'Connected' : 'Unreachable!' }}
    </v-flex>
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
