<template>
  <v-layout row wrap>
    <v-flex xs12 md12 sm12 lg12>
      <v-alert :value="alert" :type="alertType" ma-0 dismissible>{{ alertMessage }}</v-alert>
    </v-flex>

    <!-- List of currently existing profiles -->
    <v-flex xs5 sm5 md5>
      <v-card class="primary" style="max-width: 99%;">
        <!-- Profile list button header -->
        <v-layout>
          <v-flex>
            <v-btn color="accent" @click="cleanUpForm();showProfile = 'currentProfile';">New profile</v-btn>

            <v-btn
              color="accent"
              @click="cleanUpForm();showProfile = 'profileWizard';"
            >Profile Wizard</v-btn>
          </v-flex>
          <!-- <v-flex>
            <v-text-field
              class="mx-3 mt-1"
              flat
              label="Search"
              solo
              dark
              prepend-inner-icon="search"
              clearable
            ></v-text-field>
          </v-flex>-->
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="profiles"
          :loading="loading"
          :rows-per-page-items="pagination"
          item-key="groupname"
          class="elevation-5"
        >
          <template slot="items" slot-scope="props">
            <tr
              :active="props.item.groupname === currentProfileName"
              class="clickable"
              @click="getProfile(props.item.groupname);"
            >
              <td>{{ props.item.groupname }}</td>
              <td>{{ props.item.count }}</td>
              <td>
                <v-tooltip top>
                  <v-icon
                    slot="activator"
                    small
                    color="accent"
                    @click.stop="deleteProfile(props.item)"
                  >delete</v-icon>
                  <span>Delete this profile.
                    <br>If this profile is used by any subscriber you have un-assign it first.
                  </span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <!-- Current profile display -->
    <v-flex ml-5 style="max-width: 99%" xs6 md6 sm6>
      <v-layout v-if="showProfile=='currentProfile'" dark>
        <v-card color="secondary" dark>
          <v-card-title class="headline primary accent--text" primary-title>
            <v-layout row>
              <v-flex>Profile</v-flex>
              <v-flex>{{ currentProfileName }}</v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout>
                <v-text-field v-model="currentProfileName" label="Profile name" outline></v-text-field>
              </v-layout>

              <v-layout v-for="cp in currentProfile" :key="cp.attribute" row>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field v-model="cp.attribute" label="Attribute" readonly></v-text-field>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field v-model="cp.op" label="Op" readonly></v-text-field>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field v-model="cp.value" label="Value" readonly></v-text-field>
                </v-flex>
                <v-flex ma-1 xs1 sm1 md1 class="justify-center layout px-0">
                  <v-tooltip top>
                    <v-icon slot="activator" color="accent" @click="removeRow(cp)">delete_sweep</v-icon>
                    <span>Remove this row</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout row mt-5>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field v-model="currentProfileRow.attribute" label="Attribute"></v-text-field>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-select v-model="currentProfileRow.op" :items="ops" label="Op"></v-select>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field v-model="currentProfileRow.value" label="Value"></v-text-field>
                </v-flex>
                <v-flex xs1 sm1 md1 class="justify-center layout px-0">
                  <v-tooltip top>
                    <v-icon slot="activator" color="success" @click="addRow()">add_circle</v-icon>
                    <span>Add this attribute to profile</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="close()">Cancel</v-btn>
            <v-btn color="accent" @click="saveProfile()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>

      <!-- Profile Wizard creaation block -->
      <v-layout v-else-if="showProfile=='profileWizard'">
        <v-card color="secondary" dark>
          <v-card-title class="headline primary accent--text" primary-title>
            <v-layout row>
              <v-flex>New Profile</v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text></v-card-text>
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        headers: [
          { text: 'Profile', value: 'groupname' },
          { text: 'Usage', value: 'count' },
          { text: 'Delete', sortable: false },
        ],
        pagination: [
          10,
          20,
          30,
          { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 },
        ],
        ops: [':=', '==', '+=', '-='],
        currentProfile: [],
        currentProfileName: '',
        currentProfileRow: {},
        showProfile: '',
        loading: false,
        alert: false,
        alertType: 'error',
        alertMessage: '',
        profiles: [],
        wizard: {
          profileName: '',
          serviceProvider: '',
          bandWidth: '',
        },
      };
    },
    methods: {
      cleanUpForm() {
        this.currentProfile = [];
        this.currentProfileName = '';
      },
      addRow() {
        this.currentProfile.push(this.currentProfileRow);
        this.currentProfileRow = {};
      },
      removeRow(row) {
        const idx = this.currentProfile.indexOf(row);
        this.currentProfile.splice(idx, 1);
      },
      async getProfile(name) {
        try {
          const { data } = await this.$axios.post('profiles/get-profile', {
            name,
          });

          this.currentProfile = data.pageData;
          this.currentProfileName =
            this.currentProfile[0].groupname || 'New Profile';
          this.showProfile = 'currentProfile';
        } catch (e) {
          console.log(e);
        }
      },
      async saveProfile() {
        try {
          await this.$axios.post('profiles/save-profile', {
            name: this.currentProfileName,
            rows: this.currentProfile,
          });
          this.profiles.push({ groupname: this.currentProfileName, count: 0 });
          this.close();
          this.alert = true;
          this.alertType = 'success';
          this.alertMessage = `Profile saved!`;
        } catch (e) {
          console.log(e);
        }
        this.currentProfile = [];
      },
      async deleteProfile(item) {
        if (confirm(`Do you really wish to remove ${item.groupname}?`)) {
          if (item.count > 0) {
            this.alert = true;
            this.alertType = 'error';
            this.alertMessage = `Cannot delete profile used by ${
              item.count
            } user(s).`;
          }
          try {
            await this.$axios.post('profiles/delete-profile', {
              name: item.groupname,
            });
            this.alert = true;
            this.alertType = 'success';
            this.alertMessage = `Profile ${item.groupname} deleted!`;
            const idx = this.profiles.indexOf(item);
            this.profiles.splice(idx, 1);
          } catch (e) {
            console.error(e);
          }
        }
      },
      close() {
        this.showProfile = false;
        this.cleanUpForm();
      },
    },
    async asyncData({ app }) {
      const { data } = await app.$axios.post('profiles/list-profiles');

      return {
        profiles: data.pageData,
      };
    },
  };
</script>

<style lang="css" scoped>
  .clickable {
    cursor: pointer;
  }
</style>

