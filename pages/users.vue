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
            v-model="dialog"
            max-width="800px"
            dark
          >
            <v-btn
              slot="activator"
              color="accent"
              class="mb-2"
            >New User</v-btn>
            <v-card
              color="secondary"
              dark
            >
              <v-card-title
                class="headline primary accent--text"
                primary-title
              >
                User
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
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
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-text-field
                        v-model="editedItem.value"
                        label="Password"
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-select
                        v-model="editedItem.groupname"
                        :items="profiles"
                        item-text="groupname"
                        item-value="groupname"
                        label="Profile"
                        required
                      ></v-select>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-select
                        v-model="editedItem.ipv4_pool_name"
                        :items="ipv4_pools"
                        item-text="pool_name"
                        item-value="pool_name"
                        label="IPv4 pool"
                      ></v-select>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-select
                        v-model="editedItem.ipv6_dp_pool_name"
                        :items="ipv6_pd_pools"
                        item-text="pool_name"
                        item-value="pool_name"
                        label="IPv6 DP pool"
                        class="wrapped"
                      ></v-select>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md6
                    >
                      <v-select
                        v-model="editedItem.ipv6_nt_pool_name"
                        :items="ipv6_nt_pools"
                        item-text="pool_name"
                        item-value="pool_name"
                        label="IPv6 NT pool"
                        class="wrapped"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="accent"
                  flat
                  @click="close()"
                >Cancel</v-btn>
                <v-btn
                  color="accent"
                  flat
                  @click="saveItem(editedItem)"
                >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <span>Create new user entry</span>
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
    <v-data-table
      :headers="headers"
      :items="users"
      :total-items="userCount"
      :pagination.sync="pagination"
      :loading="loading"
      item-key="username"
      class="elevation-5"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr>
          <td class="wrapped">{{ props.item.username }}</td>
          <td class="wrapped">{{ props.item.value }}</td>
          <td>{{ props.item.groupname }}</td>
          <td class="wrapped">{{ props.item.ipv4_pool_name }}</td>
          <td class="wrapped">{{ props.item.ipv6_dp_pool_name }}</td>
          <td class="wrapped">{{ props.item.ipv6_nt_pool_name }}</td>
          <td>{{ formatTimeStamp(props.item.created_at) }}</td>
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
    components: {},
    data() {
      return {
        headers: [
          {
            text: "Username",
            value: "username",
            class: ["secondary", "accent--text"]
          },
          {
            text: "Password",
            value: "value",
            sortable: false,
            class: ["secondary", "accent--text"]
          },
          {
            text: "Profile",
            value: "groupname",
            class: ["secondary", "accent--text"]
          },
          {
            text: "IPv4 pool",
            value: "ipv4_pool_name",
            class: ["secondary", "accent--text"]
          },
          {
            text: "IPv6 PD pool",
            value: "ipv6_dp_pool_name",
            class: ["secondary", "accent--text"]
          },
          {
            text: "IPv6 NT pool",
            value: "ipv6_nt_pool_name",
            class: ["secondary", "accent--text"]
          },
          {
            text: "Created",
            value: "created_at",
            class: ["secondary", "accent--text"]
          },
          {
            text: "Actions",
            value: "",
            sortable: false,
            class: ["secondary", "accent--text"]
          }
        ],
        users: [],
        userCount: 0,
        dialog: false,
        editedItem: {},
        profiles: [],
        ipv4_pools: [],
        ipv6_pd_pools: [],
        ipv6_nt_pools: [],
        pagination: {
          rowsPerPage: 10,
          sortBy: "username",
          searchString: ""
        },
        loading: false
      };
    },
    watch: {
      dialog: {
        async handler() {
          const { data } = await this.$axios.post("users/user-settings");
          this.profiles = data.profiles;
          this.ipv4_pools = data.ip4Pools;
          this.ipv6_pd_pools = data.ip6PDPools;
          this.ipv6_nt_pools = data.ip6NTPools;
        }
      },
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
            const { data } = await this.$axios.post("users/users-page", {
              page,
              size: rowsPerPage,
              sortBy,
              descending,
              searchString
            });
            this.users = data.pageData;
            this.userCount = data.total_count;
            this.loading = false;
          }
        },
        deep: true
      }
    },
    methods: {
      formatTimeStamp: formatDate,
      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      async deleteItem(item) {
        if (confirm(`Really delete [${item.username}] ?`)) {
          const userIdx = this.users.indexOf(item);
          this.users.splice(userIdx, 1);
          await this.$axios.post("users/delete-user", {
            username: item.username
          });
          this.dialog = false;
        }
      },
      close() {
        this.dialog = false;
      },
      async saveItem(item) {
        this.users.push(item);
        await this.$axios.post("users/store-user", item);
        this.dialog = false;
      }
    },

    /* Called initially to populate the uses data */
    async asyncData({ app }) {
      const { data } = await app.$axios.post("users/users-page", {
        page: 1,
        size: 10,
        sortBy: "username"
      });

      return {
        users: data.pageData,
        userCount: data.total_count
      };
    }
  };
</script>

<style scoped>
  .wrapped {
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    word-break: break-all;
  }
</style>


