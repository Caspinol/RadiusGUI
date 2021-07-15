import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#060606',
        secondary: '#7e7e7e',
        accent: '#c62828',
      },
    },
  },
  icons: { iconfont: 'md' },
});

export default vuetify;
