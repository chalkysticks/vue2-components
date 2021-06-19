
// Theme
// ---------------------------------------------------------------------------

import '../node_modules/@chalkysticks/sass/dist/app.css';


// Components
// ---------------------------------------------------------------------------

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App)
    .use(router)
    .mount('#app');
