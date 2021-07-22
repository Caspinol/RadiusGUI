<template>
  <v-layout>
    <v-card>
      <v-layout>
        <v-dialog v-model="dialog" max-width="400px" dark>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="accent" class="mb-2">Add user</v-btn>
          </template>

          <v-card color="secondary" dark>
            <v-card-title class="headline primary accent--text" primary-title>
              Login</v-card-title
            >
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="username"
                      label="Username"
                      required
                      :error-messages="usernameErrors"
                      @change="$v.username.$touch()"
                      @blur="$v.username.$touch()"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="password"
                      label="Password"
                      required
                      type="password"
                      :error-messages="passwordErrors"
                      @change="$v.password.$touch()"
                      @blur="$v.password.$touch()"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="repeat_password"
                      label="Repeat password"
                      required
                      type="password"
                      :error-messages="repeatPasswordErrors"
                      @change="$v.repeat_password.$touch()"
                      @blur="$v.repeat_password.$touch()"
                    />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="close">Close</v-btn>
              <v-btn color="accent" @click="saveItem">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="getLogins"
        :server-items-length="getLoginsCount"
        :loading="getLoading"
        item-key="username"
        class="elevation-5"
      />
    </v-card>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, sameAs } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
export default {
  mixins: [validationMixin],
  validations: {
    username: { required, minLength: minLength(3) },
    password: { required, minLength: minLength(8) },
    repeat_password: { required, sameAsPassword: sameAs('password') },
  },
  data() {
    return {
      headers: [
        {
          text: 'Username',
          value: 'username',
          class: ['secondary', 'accent--text'],
        },
        {
          text: 'Action',
          value: '',
          class: ['secondary', 'accent--text'],
          sortable: false,
        },
      ],
      dialog: false,
      username: '',
      password: '',
      repeat_password: '',
    };
  },
  computed: {
    ...mapGetters({
      getLogins: 'login/get_logins',
      getLoginsCount: 'login/get_logins_count',
      getLoading: 'getLoading',
    }),

    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push('Field required');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required');
      !this.$v.password.minLength &&
        errors.push('Password must have at least 8 characters');
      return errors;
    },
    repeatPasswordErrors() {
      const errors = [];
      if (!this.$v.repeat_password.$dirty) return errors;
      !this.$v.repeat_password.sameAsPassword &&
        errors.push('Passwords must match');
      return errors;
    },
  },
  async created() {
    await this.$store.dispatch('login/get_logins');
  },
  methods: {
    close() {
      this.$v.$reset();
      this.dialog = false;
      this.username = '';
    },
    async saveItem() {
      this.$v.$touch();
      await this.$store.dispatch('login/register', {
        username: this.username,
        password: this.password,
      });
      this.close();
    },
  },
};
</script>
