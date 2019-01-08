<template>
  <v-layout column>
    <v-flex mr-2>Server status: </v-flex><span :class="{running: isRunning, notRunning: !isRunning}">{{ isRunning? " Running":" Server down!" }}</span>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        isRunning: false
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
          const { data } = await this.$axios.post("utils/get-server-status");
          this.isRunning = data.isRunning;
        } catch (e) {
          console.log(e);
          this.isRunning = false;
        }
      }
    }
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

