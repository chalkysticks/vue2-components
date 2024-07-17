import ChalkySticks from './index';
import Example from './Example.vue';
import Vue from 'vue';

Vue.config.silent = true;
Vue.config.productionTip = false;

Vue.use(ChalkySticks, {
	google: {
		maps: {
			api_key: 'AIzaSyD9_wCYmN1dEk8LgO42RbrkfnurD1GPQ7s',
		},
	},
	sdk: {
		api_url: 'https://api.chalkysticks.com',
	},
});

new Vue({
	render: (h) => h(Example),
}).$mount('#app');
