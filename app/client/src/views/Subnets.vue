<template>
  <v-layout column align-center fill-height>
    <v-card>
      <v-card-title>
        <v-tabs
          v-model="currentTab"
          color="secondary"
          dark
          slider-color="accent"
          style="min-width: 100%"
        >
          <v-tab v-for="section in getSections" :key="section.id" ripple>
            {{ section.name }}
          </v-tab>
          <v-tab-item v-for="section in getSections" :key="section.id">
            <v-card>
              <v-card-title>
                <strong>Description: </strong>
                <span>{{ section.description }}</span>
              </v-card-title>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card-title>
      <SubnetShow
        v-if="getSections.length > 0"
        :section-id="getSectionId"
      ></SubnetShow>
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import SubnetShow from '../components/SubnetShow.vue';

export default {
  components: {
    SubnetShow,
  },
  data() {
    return {
      currentTab: 0,
    };
  },
  computed: {
    ...mapGetters({
      getSections: 'subnets/getSections',
    }),
    getSectionId() {
      const section = this.getSections[this.currentTab];
      return section ? section.id : 0;
    },
  },
  watch: {},
  async mounted() {
    await this.$store.dispatch('subnets/authenticate');
    await this.$store.dispatch('subnets/fetchSections');
  },
  beforeDestroy() {},
  methods: {},
};
</script>

<style scoped></style>
