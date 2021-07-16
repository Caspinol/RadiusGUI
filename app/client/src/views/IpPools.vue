<template>
  <v-card class="primary" style="min-width: 100%">
    <v-layout>
      <v-flex>
        <v-dialog v-model="ipDialog" max-width="800px" dark>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="accent" class="mb-2">New IP</v-btn>
          </template>
          <v-card color="secondary" dark>
            <v-card-title class="headline primary accent--text" primary-title>
              {{ editing ? 'Edit IP' : 'New IP' }}
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.pool_name"
                      label="Pool name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.framedipaddress"
                      label="IP"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.framedipmask"
                      label="Mask"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.gateway_ip"
                      label="Gateway"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.callingstationid"
                      label="Client MAC"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.username"
                      label="Username"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="close()">Cancel</v-btn>
              <v-btn color="accent" @click="saveOrUpdateIp(editedItem)"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- New Pool dialog -->

        <v-dialog v-model="poolDialog" max-width="800px" dark>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="accent" class="mb-2">New pool</v-btn>
          </template>
          <v-card color="secondary" dark>
            <v-card-title class="headline primary accent--text" primary-title>
              New pool
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.pool_name"
                      label="Pool name"
                      placeholder="Pool Name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.cidr"
                      label="IP range"
                      placeholder="i.e. 192.168.1.0/24"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="editedItem.gateway"
                      label="GW IP"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="close()">Cancel</v-btn>
              <v-btn color="accent" @click="savePool(editedItem)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="pagination.searchString"
          class="mx-3 mt-1"
          flat
          label="Search"
          solo
          dark
          prepend-inner-icon="search"
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Data table -->
    <v-data-table
      :headers="headers"
      :items="getPools"
      :server-items-length="getPoolCount"
      :options.sync="pagination"
      :loading="getLoading"
      item-key="id"
      class="elevation-5"
    >
      <template slot="item" slot-scope="props">
        <tr>
          <td class="wrapped">{{ props.item.pool_name }}</td>
          <td class="wrapped">{{ props.item.framedipaddress }}</td>
          <td>{{ props.item.framedipmask }}</td>
          <td class="wrapped">{{ props.item.gateway_ip }}</td>
          <td class="wrapped">{{ props.item.nasipaddress }}</td>
          <td class="wrapped">{{ props.item.callingstationid }}</td>
          <td class="wrapped">{{ formatTimeStamp(props.item.expiry_time) }}</td>
          <td class="wrapped">{{ props.item.username }}</td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              color="accent"
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon small color="accent" @click="deleteItem(props.item)">
              delete
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { formatDate } from '../utils';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      headers: [
        { text: 'Pool name', value: 'pool_name' },
        { text: 'IP', value: 'framedipaddress' },
        { text: 'Mask', value: 'framedipmask' },
        { text: 'GW', value: 'gateway_ip' },
        { text: 'NAS IP', value: 'nasipaddress' },
        { text: 'Client MAC', value: 'callingstationid' },
        { text: 'Lease', value: 'expiry_time' },
        { text: 'Username', value: 'username' },
        { text: 'Action', value: '', sortable: false },
      ],
      ipDialog: false,
      poolDialog: false,
      editedItem: {},
      editing: false,
      pagination: {
        rowsPerPage: 10,
        searchString: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      getPools: 'ippools/getPools',
      getPoolCount: 'ippools/getPoolCount',
      getLoading: 'getLoading',
    }),
  },
  watch: {
    pagination: {
      async handler() {
        const { searchString } = this.pagination;
        if (!searchString || searchString.length >= 3) {
          await this.$store.dispatch('ippools/getPools', this.pagination);
        }
      },
      deep: true,
    },
  },
  methods: {
    formatTimeStamp: formatDate,
    close() {
      this.ipDialog = false;
      this.poolDialog = false;
      this.editedItem = {};
    },
    editItem(item) {
      this.ipDialog = this.editing = true;
      /*
       * Deep clone to avoid modyfing of the store value
       */
      this.editedItem = Object.assign({}, item);
    },
    async savePool(item) {
      await this.$store.dispatch('ippools/savePool', item);
      //Trigger the pagination handler and show newly added pool
      this.pagination.searchString = item.pool_name;
      this.close();
    },

    async saveOrUpdateIp(item) {
      this.editing ? await this.updateIp(item) : await this.saveIp(item);
      this.editing = false;
    },
    async saveIp(item) {
      await this.$store.dispatch('ippools/saveIP', item);
      this.close();
    },
    async updateIp(item) {
      await this.$store.dispatch('ippools/updateIP', item);
      this.close();
    },
    async deleteItem(item) {
      console.log(item);
      this.$snotify.confirm(
        `Really delete [${item.framedipaddress}]?`,
        'Confirm',
        {
          buttons: [
            {
              text: 'Yes',
              action: async (toast) => {
                await this.$store.dispatch('ippools/deleteIP', item);
                this.$snotify.remove(toast.id);
              },
              bold: false,
            },
            {
              text: 'No',
              action: (toast) => {
                this.$snotify.remove(toast.id);
              },
            },
          ],
        }
      );
    },
  },
};
</script>
