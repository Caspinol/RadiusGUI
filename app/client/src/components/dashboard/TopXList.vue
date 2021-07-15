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
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.radacctid }}</td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.framedipaddress }}</td>
            <td>{{ props.item.acctoutputoctets }}</td>
            <td>{{ props.item.acctinputoctets }}</td>
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
        { text: 'Username', value: 'username' },
        { text: 'IPv4', value: 'framedipaddress' },
        { text: 'Download', value: 'acctoutputoctets' },
        { text: 'Upload', value: 'acctinputoctets' },
      ],
    };
  },
};
</script>
