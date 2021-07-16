<template>
  <v-card class="primary" style="min-width: 100%">
    <!-- Data table -->
    <v-data-table
      :headers="headers"
      :items="changelist"
      :server-items-length="changeCount"
      :options.sync="pagination"
      :loading="getLoading"
      item-key="changelogid"
      class="elevation-5"
    >
      <template v-slot:items="{ item }">
        <tr>
          <td>{{ item.changelogid }}</td>
          <td>{{ item.timestamp }}</td>
          <td>{{ item.severity }}</td>
          <td>{{ item.message }}</td>
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
        { text: 'ID', value: 'changelogid' },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Severity', value: 'severity' },
        { text: 'Message', value: 'message' },
      ],
      pagination: {
        rowsPerPage: 10,
      },
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
        const { searchString } = this.pagination;
        if (!searchString || searchString.length >= 3) {
          const { data } = await this.$axios.post(
            'changelog/show-logs',
            this.pagination
          );
          this.changelist = data.pageData;
          this.changeCount = data.total_count;
        }
      },
      deep: true,
    },
  },
};
</script>
