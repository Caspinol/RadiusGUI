<template>
  <v-layout>
    <v-flex mb-1>
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>Alert settings</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-layout ml-3>
              <v-form>
                <v-layout row>
                  <v-flex lg3 md3 sm3 mr-1>
                    <v-select
                      v-model="alert.settings.notification_method"
                      :items="alert.notification_method"
                      label="Notification method"
                      required
                    >
                    </v-select>
                  </v-flex>
                  <v-flex lg6 md6 sm6 mr-1>
                    <v-text-field
                      v-model="alert.settings.destination"
                      :rules="alert.emailRules"
                      label="Destination"
                      required
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex lg6 md6 sm6 mr-1>
                    <v-text-field
                      v-model="alert.settings.origin_email"
                      :rules="alert.emailRules"
                      label="Alert origin"
                      required
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex lg6 md6 sm6 mr-1>
                    <v-select
                      v-model="alert.settings.polling_frequency"
                      :items="alert.polling_frequency"
                      label="Polling frequency"
                      required
                    >
                    </v-select>
                  </v-flex>
                  <v-flex lg4 md4 sm4 mr-1>
                    <v-text-field
                      v-model="alert.settings.warning"
                      :rules="alert.warningFieldRules"
                      label="Warning level"
                      required
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex lg4 md4 sm4 mr-1>
                    <v-text-field
                      v-model="alert.settings.critical"
                      :rules="alert.criticalFieldRules"
                      label="Critical level"
                      required
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex lg12 md12 sm12>
                    <v-text-field
                      v-model="alert.settings.email_subject"
                      label="Email subject"
                      counter="128"
                      filled
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex lg12 md12 sm12>
                    <v-textarea
                      v-model="alert.settings.email_content"
                      label="Email notification body"
                      counter="1024"
                      rows="10"
                      filled
                    >
                    </v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-btn color="error" @click="submitSettings">
                      Submit
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>Profile settings</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content> </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>General settings</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content> </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      alert: {
        settings: {},
        notification_method: [{ text: 'Email', value: 'email' }],
        polling_frequency: [
          { text: 'Every 1 min', value: '0 * * * * *' },
          { text: 'Every 10 min', value: '0 */10 * * * *' },
          { text: 'Every 30 min', value: '0 */30 * * * *' },
          { text: 'Every 1 hour', value: '0 0 * * * *' },
          { text: 'Every 3 hour', value: '0 0 */3 * * *' },
          { text: 'Every day at midnight', value: '0 0 0 * * *' },
          { text: 'Every day at noon', value: '0 0 12 * * *' },
        ],
        warningFieldRules: [
          (v) => !!v || 'Please specify warning level!',
          (v) =>
            v < this.alert.settings.critical ||
            'Warning level cannot be higher than Critical level!',
          (v) => v > 0 || 'Value must be positive!',
        ],
        criticalFieldRules: [
          (v) => !!v || 'Please specify critical level!',
          (v) =>
            v > this.alert.settings.warning ||
            'Critical level cannot be lower than warning level!',
          (v) => v > 0 || 'Value must be positive!',
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      getAlertSettings: 'alerts/getSettings',
    }),
  },
  watch: {},
  mounted() {},
  async created() {
    await this.$store.dispatch('alerts/fetchAlertSettings');

    this.alert.settings = this.getAlertSettings;
  },
  beforeDestroy() {},
  methods: {
    async submitSettings() {
      await this.$store.dispatch(
        'alerts/saveAlertSettings',
        this.alert.settings
      );
    },
  },
};
</script>

<style scoped></style>
