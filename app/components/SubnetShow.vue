<template>
  <v-layout ma-2>
    <v-data-table
      :headers="headers"
      :items="getSubnets"
      :loading="getLoading"
      class="elevation-2"
      hide-actions
      style="min-width: 100%"
    >
      <template slot="items" slot-scope="props">
        <tr
          :style="
            colorUtilization(
              showUtilization(props.item.usage.freehosts_percent)
            )
          "
        >
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.subnet }}</td>
          <td>{{ props.item.mask }}</td>
          <td>{{ props.item.description }}</td>
          <td>{{ props.item.usage.maxhosts }}</td>
          <td>{{ props.item.usage.used }}</td>
          <td>{{ props.item.usage.freehosts }}</td>
          <td>{{ showUtilization(props.item.usage.freehosts_percent) }}%</td>
        </tr>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    sectionId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Subnet', value: 'subnet' },
        { text: 'Mask', value: 'mask' },
        { text: 'Description', value: 'description' },
        { text: 'Total', value: 'usage.maxhosts' },
        { text: 'Used', value: 'usage.used' },
        { text: 'Free', value: 'usage.freehosts' },
        { text: 'Utilisation (%)', value: 'usage.freehost_percent' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getSubnets: 'subnets/getSubnets',
      getLoading: 'getLoading',
    }),
  },
  watch: {
    sectionId: {
      async handler() {
        this.$store.commit('subnets/CLEAR_SUBNETS');
        await this.$store.dispatch('subnets/fetchSubnets', this.sectionId);
      },
    },
  },
  async created() {
    await this.$store.dispatch('subnets/fetchSubnets', this.sectionId);
  },
  beforeDestroy() {},
  methods: {
    showUtilization(free) {
      return Math.round((100 - free) * 100) / 100;
    },

    colorUtilization(level) {
      console.log(level);
      if (level < 70) {
        return {
          color: 'green',
        };
      } else if (level > 70 && level < 90) {
        return {
          color: 'orange',
        };
      } else {
        return {
          color: 'red',
        };
      }
    },
  },
};
</script>

<style scoped></style>
