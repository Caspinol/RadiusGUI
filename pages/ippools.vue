<template>
  <v-card
    class="primary"
    style="min-width: 100%;"
  >
    <v-layout>
      <v-flex>
        <v-tooltip top>
          <v-dialog
            slot="activator"
            v-model="ipDialog"
            max-width="800px"
            dark
          >
            <v-btn
              slot="activator"
              color="accent"
              class="mb-2"
            >New IP</v-btn>
            <v-card
              color="secondary"
              dark
            >
              <v-card-title
                class="headline primary accent--text"
                primary-title
              >
                {{ editing? 'Edit IP':'New IP' }}
              </v-card-title>
              <v-alert
                :value="alert"
                :type="alertType"
                dismissible
              >{{ alertMessage }}</v-alert>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.pool_name"
                        label="Pool name"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.framedipaddress"
                        label="IP"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.framedipmask"
                        label="Mask"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.gateway_ip"
                        label="Gateway"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.callingstationid"
                        label="Client MAC"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
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
                <v-btn
                  color="accent"
                  @click="close()"
                >Cancel</v-btn>
                <v-btn
                  color="accent"
                  @click="saveOrUpdateIp(editedItem)"
                >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <span>Create new IP entry</span>
        </v-tooltip>

        <!-- New Pool dialog -->

        <v-tooltip top>
          <v-dialog
            slot="activator"
            v-model="poolDialog"
            max-width="800px"
            dark
          >
            <v-btn
              slot="activator"
              color="accent"
              class="mb-2"
            >New pool</v-btn>
            <v-card
              color="secondary"
              dark
            >
              <v-card-title
                class="headline primary accent--text"
                primary-title
              >
                New pool
              </v-card-title>
              <v-alert
                :value="alert"
                :type="alertType"
                dismissible
              >{{ alertMessage }}</v-alert>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.pool_name"
                        label="Pool name"
                        placeholder="Pool Name"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.cidr"
                        label="IP range"
                        placeholder="i.e. 192.168.1.0/24"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
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
                <v-btn
                  color="accent"
                  @click="close()"
                >Cancel</v-btn>
                <v-btn
                  color="accent"
                  @click="savePool(editedItem)"
                >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <span>Create new pool</span>
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
      :items="pools"
      :total-items="poolCount"
      :pagination.sync="pagination"
      :loading="loading"
      item-key="pool_name"
      class="elevation-5"
    >
      <template
        slot="items"
        slot-scope="props"
      >
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
            <v-icon
              small
              color="accent"
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </tr>
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
  import { formatDate } from "../utils";
  export default {
    data() {
      return {
        headers: [
          { text: "Pool name", value: "pool_name" },
          { text: "IP", value: "framedipaddress" },
          { text: "Mask", value: "framedipmask" },
          { text: "GW", value: "gateway_ip" },
          { text: "NAS IP", value: "nasipaddress" },
          { text: "Client MAC", value: "callingstationid" },
          { text: "Lease", value: "expiry_time" },
          { text: "Username", value: "username" },
          { text: "Action", value: "", sortable: false }
        ],
        ipDialog: false,
        poolDialog: false,
        loading: false,
        editedItem: {},
        editing: false,
        pagination: {
          rowsPerPage: 10,
          sortBy: "pool_name",
          searchString: ""
        },
        alert: false,
        alertType: "success",
        alertMessage: "",
        pools: [],
        poolCount: 0
      };
    },
    watch: {
      pagination: {
        async handler() {
          const {
            page,
            rowsPerPage,
            sortBy,
            descending,
            searchString
          } = this.pagination;
          if (!searchString || searchString.length >= 3) {
            this.loading = true;
            const { data } = await this.$axios.post("ippools/show-pools", {
              page,
              size: rowsPerPage,
              sortBy,
              descending,
              searchString
            });
            this.pools = data.pageData;
            this.poolCount = data.total_count;
            this.loading = false;
          }
        },
        deep: true
      }
    },
    methods: {
      formatTimeStamp: formatDate,
      close() {
        this.ipDialog = false;
        this.poolDialog = false;
        this.alertMessage = "";
        this.alert = false;
      },
      async editItem(item) {
        this.editedItem = item;
        this.ipDialog = this.editing = true;
      },
      async savePool(item) {
        try {
          await this.$axios.post("ippools/save-pool", item);
          this.alertType = "success";
          this.alert = true;
          this.alertMessage = "Pool added!";
        } catch (err) {
          this.alertType = "error";
          this.alert = true;
          this.alertMessage = "Failed to create new pool.";
          console.log(err);
        }
      },

      async saveOrUpdateIp(item) {
        this.editing ? await this.updateIp(item) : await this.saveIp(item);
        this.editing = false;
      },
      async saveIp(item) {
        this.pools.push(item);
        try {
          await this.$axios.post("ippools/save-ip", item);
          this.alertType = "success";
          this.alert = true;
          this.alertMessage = "IP added!";
        } catch (err) {
          this.alertType = "error";
          this.alert = true;
          this.alertMessage = "Failed to add the IP.";
          console.log(err);
        }
      },
      async updateIp(item) {
        try {
          await this.$axios.post("ippools/update-ip", item);
          this.alertType = "success";
          this.alert = true;
          this.alertMessage = "IP updated!";
        } catch (e) {
          this.alertType = "error";
          this.alert = true;
          this.alertMessage = "Failed to update IP details.";
        }
      },
      async deleteItem(item) {
        if (confirm(`Really delete [${item.framedipaddress}]?`)) {
          try {
            await this.$axios.post("ippools/delete-ip", { id: item.id });
            const idx = this.pools.indexOf(item);
            this.pools.splice(idx, 1);
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    async asyncData({ app }) {
      const { data } = await app.$axios.post("ippools/show-pools", {
        page: 1,
        size: 10,
        sortBy: "pool_name"
      });

      return {
        pools: data.pageData,
        poolCount: data.total_count
      };
    }
  };
</script>

