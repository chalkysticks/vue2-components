import ChalkySticks from './index';
import Example from './Example.vue';
import Vue from 'vue';

Vue.config.silent = true;
Vue.config.productionTip = false;

Vue.use(ChalkySticks, {
	api_url: 'http://localhost:3333',
});

new Vue({
	render: (h) => h(Example),
}).$mount('#app');
