<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
      class="accent"
      dark
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title
              dark
              v-text="item.title"
            />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      dark
      class="primary"
    >
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon
          color="accent"
          v-html="miniVariant ? 'chevron_right' : 'chevron_left'"
        />
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon color="accent">web</v-icon>
      </v-btn>
      <v-toolbar-title
        class="accent--text"
        v-text="title"
      />
      <v-spacer></v-spacer>
      <SrvCheck></SrvCheck>
      <DBCheck></DBCheck>
    </v-toolbar>
    <v-content>
      <v-container
        fill-height
        fluid
      >
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      app
      class="pl-5 primary accent--text"
    >
      <span>&copy; Krzysztof Grobelak 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  import DBCheck from "@/components/DBCheck";
  import SrvCheck from "@/components/SrvCheck";

  export default {
    components: {
      DBCheck,
      SrvCheck
    },
    data() {
      return {
        clipped: false,
        drawer: true,
        items: [
          { icon: "dashboard", title: "Dashboard", to: "/" },
          { icon: "supervised_user_circle", title: "Users", to: "/users" },
          { icon: "list", title: "Profiles", to: "/profiles" },
          { icon: "donut_large", title: "IP pools", to: "/ippools" },
          { icon: "how_to_reg", title: "Accounting", to: "/accounting" },
          { icon: "subtitles", title: "NAS", to: "/nas" }
        ],
        miniVariant: true,
        title: "RadiusGUI"
      };
    }
  };
</script>
