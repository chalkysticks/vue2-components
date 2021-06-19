
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewHome from '../views/Home.vue';
import ViewTvVideoTheater from '../views/TV/VideoTheater.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'ViewHome',
        component: ViewHome,
    },
    {
        path: '/tv/video-theater',
        name: 'ViewTvVideoTheater',
        component: ViewTvVideoTheater,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
