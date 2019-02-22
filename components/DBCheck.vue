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
    };
  },
  created() {
    this.update();
  },
  methods: {
    async update() {
      await this.getSrvStatus();
      await new Promise(async resolve =>
        setTimeout(async () => {
          await this.update();
          resolve();
        }, 20000)
      );
    },
    async getSrvStatus() {
      try {
        const { data } = await this.$axios.post('utils/get-db-status');
        this.isRunning = data.isRunning;
      } catch (e) {
        console.log('Error: ', e);
        this.isRunning = false;
      }
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
