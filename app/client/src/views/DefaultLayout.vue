<template>
  <v-app>
    <Notification></Notification>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :mini-variant.sync="miniVariant"
      fixed
      class="accent"
      dark
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-html="item.icon" v-on="on" />
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title dark v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left class="primary">
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon
          color="accent"
          v-html="miniVariant ? 'chevron_right' : 'chevron_left'"
        />
      </v-btn>
      <v-app-bar-title class="accent--text" v-text="title" />
      <v-spacer></v-spacer>
      <DBCheck></DBCheck>
      <HostCheck></HostCheck>
    </v-app-bar>
    <v-main>
      <v-container fill-height fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer app class="pl-5 primary accent--text">
      <span>&copy; Krzysztof Grobelak 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import DBCheck from '@/components/DBCheck';
import HostCheck from '@/components/HostCheck';
import Notification from '@/components/Notification';

export default {
  components: {
    DBCheck,
    HostCheck,
    Notification,
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      items: [
        { icon: 'dashboard', title: 'Dashboard', to: '/' },
        { icon: 'supervised_user_circle', title: 'Users', to: '/users' },
        { icon: 'list', title: 'Profiles', to: '/profiles' },
        { icon: 'donut_large', title: 'IP pools', to: '/ippools' },
        { icon: 'pie_chart', title: 'Subnets', to: '/subnets' },
        { icon: 'how_to_reg', title: 'Accounting', to: '/accounting' },
        { icon: 'subtitles', title: 'NAS', to: '/nas' },
        { icon: 'history', title: 'Changelog', to: '/changelog' },
      ],
      miniVariant: true,
      title: 'RadiusGUI',
    };
  },
};
</script>
