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
        :total-items="getAccCount"
        :pagination.sync="pagination"
        :loading="getLoading"
        item-key="acctsessionid"
        class="elevation-5"
        style="min-width: 100%;"
      >
        <template slot="items" slot-scope="props">
          <tr
            :style="{ color: props.item.acctstoptime ? 'grey' : 'green' }"
            class="clickable"
            @click="props.expanded = !props.expanded"
          >
            <td>{{ props.item.acctsessionid }}</td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.framedipaddress || 'N/A' }}</td>
            <td>{{ props.item.framedipv6address || 'N/A' }}</td>
            <td>{{ props.item.ipv6delegatedpfx }}</td>
            <td>{{ props.item.acctinputoctets }}</td>
            <td>{{ props.item.acctoutputoctets }}</td>
            <td>{{ props.item.slaprofile }}</td>
            <td>{{ props.item.subscprofile }}</td>
            <td>
              <v-tooltip top>
                <span>View this subscriber in the ELK (Kibana)</span>
                <v-icon
                  slot="activator"
                  @click.stop="showTooltip(props.item.clientmac)"
                  >chrome_reader_mode</v-icon
                >
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card class="elevation-10">
            <v-layout class="ml-5" row wrap>
              <v-flex xs6 md3>
                <span class="font-weight-black">NAS IP:</span>
                {{ props.item.nasipaddress }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">NAS port:</span>
                {{ props.item.nasportid }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Client MAC:</span>
                {{ props.item.clientmac }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Client vendor:</span>
                {{ props.item.clienvendor || '-' }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Session start:</span>
                {{ formatDateStamp(props.item.acctstarttime) }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Last update:</span>
                {{ formatDateStamp(props.item.acctupdatetime) }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Session length:</span>
                {{ formatTime(props.item.acctsessiontime) }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Session stop:</span>
                {{ formatDateStamp(props.item.acctstoptime) || '-' }}
              </v-flex>
              <v-flex xs6 md3>
                <span class="font-weight-black">Stop cause:</span>
                {{ props.item.acctterminatecause || '-' }}
              </v-flex>
            </v-layout>
          </v-card>
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
        sortBy: 'acctstarttime',
        descending: true,
        searchString: '',
      },
      tooltip: false,
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
      const url = `${
        process.env.ELK_HOST
      }/app/kibana#/discover?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-4h,mode:quick,to:now))&_a=(columns:!(_source),index:AWFn3hy34NBPYG__wnEF,interval:auto,query:(query_string:(query:'mac_address:"${mac}"')),sort:!('@timestamp',desc))`;

      window.open(url, '_blank');
    },
  },
};
</script>

<style lang="css" scoped>
.clickable {
  cursor: pointer;
}
</style>
