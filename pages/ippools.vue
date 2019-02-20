<template>
  <v-card class="primary" style="min-width: 100%;">
    <v-layout>
      <v-flex>
        <v-tooltip top>
          <v-dialog slot="activator" v-model="ipDialog" max-width="800px" dark>
            <v-btn slot="activator" color="accent" class="mb-2">New IP</v-btn>
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
          <span>Create new single IP entry</span>
        </v-tooltip>

        <!-- New Pool dialog -->

        <v-tooltip top>
          <v-dialog
            slot="activator"
            v-model="poolDialog"
            max-width="800px"
            dark
          >
            <v-btn slot="activator" color="accent" class="mb-2">New pool</v-btn>
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
          <span
            >Create entries for entire subnet. <br />
            The the pool inserted will skip the first 3 IPs as it assumes those
            are used for the network infrastructure.</span
          >
        </v-tooltip>
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
      :total-items="getPoolCount"
      :pagination.sync="pagination"
      :loading="loading"
      item-key="pool_name"
      class="elevation-5"
    >
      <template slot="items" slot-scope="props">
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
      loading: false,
      editedItem: {},
      editing: false,
      pagination: {
        rowsPerPage: 10,
        sortBy: 'pool_name',
        searchString: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      getPools: 'ippools/getPools',
      getPoolCount: 'ippools/getPoolCount',
      getResult: 'ippools/getResult',
    }),
  },
  watch: {
    pagination: {
      async handler() {
        const { searchString } = this.pagination;
        if (!searchString || searchString.length >= 3) {
          this.loading = true;
          await this.$store.dispatch('ippools/getPools', this.pagination);
          if (this.getResult.result) {
            this.$snotify[this.getResult.result](
              this.getResult.message,
              this.getResult.title
            );
          }
          this.loading = false;
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
    },
    editItem(item) {
      this.ipDialog = this.editing = true;
      this.editedItem = item;
    },
    async savePool(item) {
      await this.$store.dispatch('ippools/savePool', item);
      this.$snotify[this.getResult.result](
        this.getResult.message,
        this.getResult.title
      );
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
      this.$snotify[this.getResult.result](
        this.getResult.message,
        this.getResult.title
      );
      this.close();
    },
    async updateIp(item) {
      await this.$store.dispatch('ippools/updateIP', item);
      this.$snotify[this.getResult.result](
        this.getResult.message,
        this.getResult.title
      );
      this.close();
    },
    async deleteItem(item) {
      this.$snotify.confirm(
        `Really delete [${item.framedipaddress}]?`,
        'Confirm',
        {
          buttons: [
            {
              text: 'Yes',
              action: async toast => {
                await this.$store.dispatch('ippools/deleteIP', item);
                this.$snotify[this.getResult.result](
                  this.getResult.message,
                  this.getResult.title
                );
                this.$snotify.remove(toast.id);
              },
              bold: false,
            },
            {
              text: 'No',
              action: toast => {
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
