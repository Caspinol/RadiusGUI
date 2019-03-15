<template>
  <v-card class="primary" style="min-width: 100%;">
    <!-- Data table -->
    <v-data-table
      :headers="headers"
      :items="changelist"
      :total-items="changeCount"
      :pagination.sync="pagination"
      :loading="getLoading"
      item-key="timestamp"
      class="elevation-5"
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.changelogid }}</td>
          <td>{{ props.item.timestamp }}</td>
          <td>{{ props.item.severity }}</td>
          <td>{{ props.item.message }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      headers: [
        { text: 'ID', value: 'changelogid', sortable: false },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Severity', value: 'severity' },
        { text: 'Message', value: 'message' },
      ],
      pagination: {},
      changelist: [],
      changeCount: 0,
    };
  },
  computed: {
    ...mapGetters(['getLoading']),
  },
  watch: {
    pagination: {
      async handler() {
        const {
          page,
          rowsPerPage,
          sortBy,
          descending,
          searchString,
        } = this.pagination;
        if (!searchString || searchString.length >= 3) {
          const { data } = await this.$axios.post('changelog/show-logs', {
            page,
            size: rowsPerPage,
            sortBy,
            descending,
            searchString,
          });
          this.changelist = data.pageData;
          this.changeCount = data.total_count;
        }
      },
      deep: true,
    },
  },
};
</script>
