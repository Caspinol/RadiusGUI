<template>
  <v-card calss="ma-2">
    <v-card-title class="headline accent--text">Top 10 Traffic</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :server-items-length="items.length"
        item-key="radacctid"
        hide-default-footer
      >
        <template v-slot:items="{ item }">
          <tr>
            <td>{{ item.radacctid }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.framedipaddress }}</td>
            <td>{{ item.acctoutputoctets }}</td>
            <td>{{ item.acctinputoctets }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    items: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      headers: [
        { text: '#', value: 'radacctid', sortable: false },
        { text: 'Username', value: 'username', sortable: false },
        { text: 'IPv4', value: 'framedipaddress', sortable: false },
        { text: 'Download', value: 'acctoutputoctets', sortable: false },
        { text: 'Upload', value: 'acctinputoctets', sortable: false },
      ],
    };
  },
};
</script>
