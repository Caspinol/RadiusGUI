<template>
  <v-card class="ma-2">
    <v-card-title class="headline accent--text"
      ><v-flex>Last logins</v-flex>
      <v-flex>
        <v-text-field
          v-model="pagination.searchString"
          solo
          label="Search"
          prepend-inner-icon="search"
          clearable
        ></v-text-field></v-flex
    ></v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="getLogins.logins"
        :total-items="getLogins.count"
        :pagination.sync="pagination"
        :loading="getLoading"
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
        sortBy: 'authdate',
        descending: true,
        searchString: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      getLogins: 'utils/getLogins',
      getLoading: 'getLoading',
    }),
  },
  watch: {
    pagination: {
      async handler() {
        const { searchString } = this.pagination;
        if (!searchString || searchString.length >= 3) {
          await this.$store.dispatch('utils/getLastLogins', this.pagination);
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
