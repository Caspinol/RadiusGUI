<template>
  <v-layout>
    <v-card ma-2>
      <v-card-title class="headline accent--text">IP pools</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="getPools"
          :footer-props="{
            itemsPerPageOptions: [10, 20, 30],
          }"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item.pool_name }}</td>
              <td>{{ total(props.item) }}</td>
              <td>{{ props.item.used }}</td>
              <td>{{ props.item.free }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      headers: [
        { text: 'Pool name', value: 'pool_name' },
        { text: 'Total IPs', value: '' },
        { text: 'Used IPs', value: 'used' },
        { text: 'Free IPs', value: 'free' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getPools: 'utils/getPools',
    }),
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      this.$store.dispatch('utils/getPoolsData');
    },
    total(item) {
      return Number(item.free) + Number(item.used);
    },
  },
};
</script>
