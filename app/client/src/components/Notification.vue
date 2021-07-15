<template>
  <vue-snotify></vue-snotify>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getNotifications: 'notification/getNotifications',
    }),
  },
  watch: {
    getNotifications: {
      handler(notifications) {
        notifications.forEach((n) => {
          this.$snotify[n.type](n.message);
          this.remove(n);
        });
      },
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    ...mapActions({
      remove: 'notification/remove',
    }),
  },
};
</script>

<style scoped></style>
