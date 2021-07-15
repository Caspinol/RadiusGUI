<template>
  <v-layout row wrap>
    <v-flex xs12 md12 sm12 lg12>
      <v-text-field
        v-model="pagination.searchString"
        solo
        dark
        label="Enter your search criteria here to limit output..."
        prepend-inner-icon="search"
        clearable
      ></v-text-field>
    </v-flex>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="getAccounting"
        :server-items-length="getAccCount"
        :options.sync="pagination"
        :loading="getLoading"
        item-key="acctsessionid"
        :expanded.sync="expanded"
        class="elevation-5"
        style="min-width: 100%"
      >
        <template v-slot:item="{ item }">
          <tr
            :style="{ color: item.acctstoptime ? 'grey' : 'green' }"
            class="clickable"
            @click="expandRow(item)"
          >
            <td>{{ item.acctsessionid }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.framedipaddress || 'N/A' }}</td>
            <td>{{ item.framedipv6address || 'N/A' }}</td>
            <td>{{ item.ipv6delegatedpfx }}</td>
            <td>{{ item.acctinputoctets }}</td>
            <td>{{ item.acctoutputoctets }}</td>
            <td>{{ item.slaprofile }}</td>
            <td>{{ item.subscprofile }}</td>
            <td>
              <v-tooltip top>
                <span>View this subscriber in the ELK (Kibana)</span>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click.stop="showTooltip(item.clientmac)"
                    >chrome_reader_mode</v-icon
                  >
                </template>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template v-slot:expanded-item="{ item, headers }">
          <td :colspan="headers.length">
            <v-card class="elevation-10">
              <v-layout class="ml-5">
                <v-flex xs6 md3>
                  <span class="font-weight-black">NAS IP:</span>
                  {{ item.nasipaddress }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">NAS port:</span>
                  {{ item.nasportid }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Client MAC:</span>
                  {{ item.clientmac }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Client vendor:</span>
                  {{ item.clienvendor || '-' }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Session start:</span>
                  {{ formatDateStamp(item.acctstarttime) }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Last update:</span>
                  {{ formatDateStamp(item.acctupdatetime) }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Session length:</span>
                  {{ formatTime(item.acctsessiontime) }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Session stop:</span>
                  {{ formatDateStamp(item.acctstoptime) || '-' }}
                </v-flex>
                <v-flex xs6 md3>
                  <span class="font-weight-black">Stop cause:</span>
                  {{ item.acctterminatecause || '-' }}
                </v-flex>
              </v-layout>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { formatDate, sec2HHMMSS, randomString } from '../utils';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Session ID',
          value: 'acctsessionid',
          sortable: false,
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'Username',
          value: 'username',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'IPv4',
          value: 'framedipaddress',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'IPv6 NT',
          value: 'framedipv6address',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'IPv6 DP',
          value: 'ipv6delegatedpfx',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'Download',
          value: 'acctinputoctets',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'Upload',
          value: 'acctoutputoctets',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'SLA profile',
          value: 'slaprofile',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'User profile',
          value: 'subscprofile',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'Action',
          value: '',
          class: ['secondary'],
        },
      ],
      pagination: {
        rowsPerPage: 10,
        descending: true,
        searchString: '',
      },
      tooltip: false,
      expanded: [],
    };
  },
  computed: {
    ...mapGetters({
      getAccounting: 'accounting/getAccounting',
      getAccCount: 'accounting/getAccCount',
      getLoading: 'getLoading',
    }),
  },
  watch: {
    pagination: {
      async handler() {
        const { searchString } = this.pagination;

        if (!searchString || searchString.length >= 3) {
          await this.$store.dispatch(
            'accounting/showAccounting',
            this.pagination
          );
        }
      },
      deep: true,
    },
  },
  methods: {
    formatDateStamp: formatDate,
    formatTime: sec2HHMMSS,
    randomString: randomString,
    showTooltip(mac) {
      const url = `${process.env.ELK_HOST}/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-4h,mode:quick,to:now))&_a=(columns:!(_source),index:AWFn3hy34NBPYG__wnEF,interval:auto,query:(query_string:(query:'mac_address:"${mac}"')),sort:!('@timestamp',desc))`;

      window.open(url, '_blank');
    },
    expandRow(val) {
      if (this.expanded.length && this.expanded[0] == val) {
        this.expanded = [];
      } else {
        this.expanded.push(val);
      }
    },
  },
};
</script>

<style lang="css" scoped>
.clickable {
  cursor: pointer;
}
</style>
