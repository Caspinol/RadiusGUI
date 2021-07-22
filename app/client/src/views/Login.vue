<template>
  <v-app>
    <Notification></Notification>
    <v-main>
      <v-container>
        <v-row mt-6 justify="center">
          <v-col cols="6">
            <v-card>
              <v-card-title>Log in</v-card-title>
              <v-card-text>
                <v-form class="pb-2">
                  <v-row class="mx-2">
                    <v-text-field
                      v-model="username"
                      placeholder="Username"
                    ></v-text-field>
                  </v-row>
                  <v-row class="mx-2">
                    <v-text-field
                      v-model="password"
                      type="password"
                      placeholder="Password"
                    ></v-text-field>
                  </v-row>
                  <v-row justify="end" class="mx-2">
                    <v-btn color="accent" @click="login">Login</v-btn>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container></v-main
    >
  </v-app>
</template>

<script>
import Notification from '../components/Notification.vue';
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  validations: {
    username: { required, minLength: minLength(3) },
    password: { required, minLength: minLength(8) },
  },
  components: { Notification },
  data() {
    return { username: '', password: '' };
  },
  methods: {
    async login() {
      this.$v.$touch();
      this.$store
        .dispatch('login/login', {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$router.push('/');
        });
    },
  },
};
</script>
