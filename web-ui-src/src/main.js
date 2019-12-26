import Vue from 'vue';
import App from './App.vue';

import './plugins/element.js';

import VueCodemirror from 'vue-codemirror';
// require styles
import 'codemirror/lib/codemirror.css';

Vue.config.productionTip = false;
// you can set default global options and events when use
Vue.use(VueCodemirror);

new Vue({
  render: h => h(App)
}).$mount('#app');
