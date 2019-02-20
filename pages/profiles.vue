<template>
  <v-layout row wrap>
    <!-- List of currently existing profiles -->
    <v-flex xs5 sm5 md5>
      <v-card class="primary" style="max-width: 99%;">
        <!-- Profile list button header -->
        <v-layout>
          <v-flex>
            <v-btn
              color="accent"
              @click="
                cleanUpForm();
                showProfile = 'currentProfile';
              "
              >New profile</v-btn
            >
            <v-btn
              color="accent"
              @click="
                cleanUpForm();
                showProfile = 'profileWizard';
              "
              >Profile Wizard</v-btn
            >
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="getProfiles"
          :loading="loading"
          :rows-per-page-items="pagination"
          item-key="groupname"
          class="elevation-5"
        >
          <template slot="items" slot-scope="props">
            <tr
              :active="props.item.groupname === getCurrentProfileName"
              class="clickable"
              @click="fetchProfile(props.item.groupname)"
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
                    >delete</v-icon
                  >
                  <span
                    >Delete this profile. <br />If this profile is used by any
                    subscriber you have un-assign it first.
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
      <v-layout v-if="showProfile == 'currentProfile'" dark>
        <v-card color="secondary" dark>
          <v-card-title class="headline primary accent--text" primary-title>
            <v-layout row>
              <v-flex>Profile:</v-flex>
              <v-flex>{{ getProfileName }}</v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout>
                <v-text-field
                  v-model="getProfileName"
                  label="Profile name"
                  outline
                ></v-text-field>
              </v-layout>

              <v-layout v-for="cp in getProfile" :key="cp.attribute" row>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field
                    v-model="cp.attribute"
                    label="Attribute"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field
                    v-model="cp.op"
                    label="Op"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field
                    v-model="cp.value"
                    label="Value"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex ma-1 xs1 sm1 md1 class="justify-center layout px-0">
                  <v-tooltip top>
                    <v-icon
                      slot="activator"
                      color="accent"
                      @click="removeRow(cp)"
                      >delete_sweep</v-icon
                    >
                    <span>Remove this row</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout row mt-5>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field
                    v-model="currentProfileRow.attribute"
                    label="Attribute"
                  ></v-text-field>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-select
                    v-model="currentProfileRow.op"
                    :items="ops"
                    label="Op"
                  ></v-select>
                </v-flex>
                <v-flex ma-1 xs3 md3 sm3>
                  <v-text-field
                    v-model="currentProfileRow.value"
                    label="Value"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 sm1 md1 class="justify-center layout px-0">
                  <v-tooltip top>
                    <v-icon slot="activator" color="success" @click="addRow()">
                      add_circle</v-icon
                    >

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
      <v-layout v-else-if="showProfile == 'profileWizard'">
        <v-card color="secondary" dark>
          <v-card-title class="headline primary accent--text" primary-title>
            <v-layout row>
              <v-flex>New Profile</v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout wrap>
                <v-flex sm12 md12 xs12>
                  <v-text-field
                    v-model="wizard.profileName"
                    label="Profile name"
                  ></v-text-field>
                </v-flex>
                <v-flex sm12 md12 xs12>
                  <v-select
                    v-model="wizard.serviceId"
                    :items="serviceProviders"
                    label="Service provider (ASP)"
                  ></v-select>
                </v-flex>
                <v-flex sm12 md12 xs12>
                  <v-select
                    v-model="wizard.qosProfile"
                    :items="qosProfiles"
                    label="BNG QoS profile"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer> </v-spacer>
            <v-btn color="accent" @click="close()">Cancel</v-btn>
            <v-btn color="accent" @click="submitWizard()">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

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
      serviceProviders: [
        { text: 'Siro', value: 5000 },
        { text: 'Openeir', value: 5001 },
      ],
      qosProfiles: [
        { text: 'U4-1', value: 'U4-1' },
        { text: 'U7-1', value: 'U7-1' },
        { text: 'U10-1', value: 'U10-1' },
        { text: 'U12-1', value: 'U12-1' },
        { text: 'U15-3', value: 'U15-3' },
        { text: 'U18-5', value: 'U18-5' },
        { text: 'U18-7', value: 'U18-7' },
        { text: 'U20-8', value: 'U20-8' },
        { text: 'U20-10', value: 'U20-10' },
        { text: 'U25-7', value: 'U25-7' },
        { text: 'U28-16', value: 'U28-16' },
        { text: 'U30-8', value: 'U30-8' },
        { text: 'U34-16', value: 'U34-16' },
        { text: 'U40-10', value: 'U40-10' },
        { text: 'U40-16', value: 'U40-16' },
        { text: 'U43-16', value: 'U43-16' },
        { text: 'U50-15', value: 'U50-15' },
        { text: 'U50-20', value: 'U50-20' },
        { text: 'U60-20', value: 'U60-20' },
        { text: 'U70-20', value: 'U70-20' },
        { text: 'U80-20', value: 'U80-20' },
        { text: 'U85-20', value: 'U85-20' },
        { text: 'U90-20', value: 'U90-20' },
        { text: 'SU150-30', value: 'SU150-30' },
        { text: 'SU350-70', value: 'SU350-70' },
        { text: 'SU600-120', value: 'SU600-120' },
        { text: 'SU1G-200-P', value: 'SU1G-200-P' },
        { text: 'SU150-30-P', value: 'SU150-30-P' },
        { text: 'SU350-70-P', value: 'SU350-70-P' },
        { text: 'SU600-120-P', value: 'SU600-120-P' },
        { text: 'SU1G-200-P', value: 'SU1G-200-P"' },
      ],
      currentProfileRow: {},
      showProfile: '',
      loading: false,
      wizard: {
        profileName: '',
        serviceId: '',
        qosProfile: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      getProfiles: 'profile/getProfiles',
      getProfile: 'profile/getProfile',
      getCurrentProfileName: 'profile/getCurrentProfileName',
      getResult: 'profile/getResult',
    }),

    getProfileName: {
      get: function() {
        return this.getCurrentProfileName;
      },
      set: function(name) {
        this.$store.commit('profile/SET_PROFILE_NAME', name);
      },
    },
  },
  methods: {
    cleanUpForm() {
      this.$store.commit('profile/SET_PROFILE', []);
    },
    addRow() {
      this.$store.commit('profile/ADD_ROW', this.currentProfileRow);
      this.currentProfileRow = {};
    },
    removeRow(row) {
      this.$store.commit('profile/REMOVE_ROW', row);
    },
    async fetchProfile(name) {
      await this.$store.dispatch('profile/fetchProfile', name);
      this.showProfile = 'currentProfile';
    },
    async saveProfile() {
      await this.$store.dispatch('profile/saveProfile');
      this.$snotify[this.getResult.result](
        this.getResult.message,
        this.getResult.title
      );
      this.close();
    },
    async deleteProfile(item) {
      this.$snotify.confirm(
        `Do you really wish to remove ${item.groupname}?`,
        'Confirm',
        {
          buttons: [
            {
              text: 'Yes',
              action: async toast => {
                if (item.count > 0) {
                  this.$snotify['warning'](
                    'Cannot remove profile that has been assigned to subscriber.',
                    'Profile in use!'
                  );
                } else {
                  await this.$store.dispatch('profile/deleteProfile', item);
                  this.$snotify[this.getResult.result](
                    this.getResult.message,
                    this.getResult.title
                  );
                }
                this.$snotify.remove(toast.id);
              },
              bold: false,
            },
            {
              text: 'No',
              action: toast => {
                this.$snotify.remove(toast.id);
              },
              bold: true,
            },
          ],
        }
      );
    },
    async submitWizard() {
      await this.$store.dispatch('profile/submitWizard', this.wizard);
      this.$snotify[this.getResult.result](
        this.getResult.message,
        this.getResult.title
      );
    },
    close() {
      this.showProfile = '';
      this.cleanUpForm();
    },
  },
  async fetch({ store }) {
    await store.dispatch('profile/fetchProfiles');
  },
};
</script>

<style lang="css" scoped>
.clickable {
  cursor: pointer;
}
</style>
