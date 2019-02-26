<template>
  <v-layout>
    <v-card ma-2>
      <v-card-title class="headline accent--text">IP pools</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="pools">
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
export default {
  data() {
    return {
      headers: [
        { text: 'Pool name', value: 'pool_name' },
        { text: 'Total IPs', value: '' },
        { text: 'Used IPs', value: 'used' },
        { text: 'Free IPs', value: 'free' },
      ],
      pools: [],
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    async update() {
      const { data } = await this.$axios.post('utils/get-pools');
      this.pools = data.pools;
    },
    total(item) {
      return Number(item.free) + Number(item.used);
    },
  },
};
</script>
