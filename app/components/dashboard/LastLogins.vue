<template>
  <v-card class="ma-2">
    <v-card-title class="headline accent--text">Last logins</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="getLogins.logins"
        :total-items="getLogins.count"
        :pagination.sync="pagination"
        :loading="loading"
        item-key="username"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.reply }}</td>
            <td>{{ props.item.macaddress }}</td>
            <td>{{ formatTimeStamp(props.item.authdate) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDate } from '../../utils';
export default {
  data() {
    return {
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Result', value: 'reply' },
        { text: 'MAC', value: 'macaddress' },
        { text: 'Time', value: 'authdate' },
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: '',
        searchString: '',
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      getLogins: 'utils/getLogins',
    }),
  },
  watch: {
    pagination: {
      async handler() {
        const { searchString } = this.pagination;
        if (!searchString || searchString.length >= 3) {
          this.loading = true;
          await this.$store.dispatch('utils/getLastLogins', this.pagination);
          this.loading = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    formatTimeStamp: formatDate,
  },
};
</script>

<style scoped></style>
