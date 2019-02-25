<template>
  <v-card class="primary" style="min-width: 100%;">
    <v-layout>
      <v-flex>
        <v-tooltip top>
          <v-dialog slot="activator" v-model="nasDialog" max-width="800px" dark>
            <v-btn slot="activator" color="accent" class="mb-2">New NAS</v-btn>
            <v-card color="secondary" dark>
              <v-card-title
                class="headline primary accent--text"
                primary-title
              >{{ editing? 'Edit NAS':'New NAS' }}</v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.nasname" label="NAS IP"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.shortname" label="Short name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.type" label="Type"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.ports" label="Ports"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.secret" label="Secret"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.server" label="Server"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.community" label="Community"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent" @click="close()">Cancel</v-btn>
                <v-btn color="accent" @click="saveOrUpdateNas(editedItem)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <span>Create new NAS entry. This will allow all requests from this device to be processed by RADIUS.</span>
        </v-tooltip>
      </v-flex>
    </v-layout>

    <!-- Data table -->
    <v-data-table
      :headers="headers"
      :items="naslist"
      :total-items="nasCount"
      :pagination.sync="pagination"
      :loading="loading"
      item-key="nasname"
      class="elevation-5"
    >
      <template slot="items" slot-scope="props">
        <tr class="clickable" @click="props.expanded = !props.expanded">
          <td>{{ props.item.nasname }}</td>
          <td>{{ props.item.shortname }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.ports }}</td>
          <td>{{ props.item.secret }}</td>
          <td>{{ props.item.server }}</td>
          <td>{{ props.item.community }}</td>
          <td class="justify-center layout px-0">
            <v-icon small color="accent" class="mr-2" @click.stop="editItem(props.item)">edit</v-icon>
            <v-icon small color="accent" @click.stop="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card class="elevation-10">
          <v-layout class="ml-5" row wrap>
            <v-flex xs6 md3>
              <span>Description:</span>
              {{ props.item.description }}
            </v-flex>
          </v-layout>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  export default {
    data() {
      return {
        page: 0,
        headers: [
          { text: 'NAS IP', value: 'nasname' },
          { text: 'Short name', value: 'shortname' },
          { text: 'Type', value: 'type' },
          { text: 'Ports', value: 'ports' },
          { text: 'Secret', value: 'secret' },
          { text: 'Server', value: 'server' },
          { text: 'Community', value: 'community' },
          { text: 'Actions', value: '', sortable: false },
        ],
        editedItem: {},
        nasDialog: false,
        editing: false,
        pagination: {
          rowsPerPage: 10,
          sortBy: 'nasname',
          searchString: '',
        },
        naslist: [],
        nasCount: 0,
        loading: false,
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
            searchString,
          } = this.pagination;
          if (!searchString || searchString.length >= 3) {
            this.loading = true;
            const { data } = await this.$axios.post('nas/show-naslist', {
              page,
              size: rowsPerPage,
              sortBy,
              descending,
              searchString,
            });
            this.naslist = data.pageData;
            this.nasCount = data.total_count;
            this.loading = false;
          }
        },
        deep: true,
      },
    },
    methods: {
      close() {
        this.editedItem = {};
        this.nasDialog = this.editing = false;
      },
      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.nasDialog = this.editing = true;
      },
      async saveOrUpdateNas(item) {
        if (this.editing) {
          await this.$axios.post('nas/update-nas', item);
        } else {
          this.naslist.push(item);
          await this.$axios.post('nas/save-nas', item);
        }

        this.close();
      },
    },
  };
</script>

<style lang="css" scoped>
  .clickable {
    cursor: pointer;
  }
</style>
