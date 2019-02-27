<template>
  <v-layout column>
    <v-flex mr-2>DB status: </v-flex
    ><span :class="{ running: isRunning, notRunning: !isRunning }">{{
      isRunning ? ' Running' : ' Database down!'
    }}</span>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      isRunning: false,
      timer: '',
    };
  },
  mounted() {
    this.getSrvStatus();
    this.timer = setInterval(this.getSrvStatus, 20000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getSrvStatus() {
      this.$axios
        .post('utils/get-db-status')
        .then(({ data }) => {
          this.isRunning = data.isRunning;
        })
        .catch(err => {
          console.log(err);
          this.isRunning = false;
        });
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
