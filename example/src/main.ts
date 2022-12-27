
// Theme
// ---------------------------------------------------------------------------

import '../node_modules/@chalkysticks/sass/dist/app.css';


// Components
// ---------------------------------------------------------------------------

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ChalkySticks from '@chalkysticks/vue2';

Vue.config.silent = true;
Vue.config.productionTip = false;

Vue.use(ChalkySticks, {
    api_url: 'http://localhost:3333',
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
