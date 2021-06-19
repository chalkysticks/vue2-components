<template>
    <div class="home">
        <div>
            <BrandingBadge size="sm" mode="dark" />
            <BrandingBadge size="sm" mode="light" />
        </div>
        <div>
            <BrandingBadge mode="dark" />
            <BrandingBadge mode="light" />
        </div>
        <div>
            <BrandingBadge size="lg" mode="dark" />
            <BrandingBadge size="lg" mode="light" />
        </div>
        <div class="d-flex">
            <BrandingStandard class="background-chalky-white p-3" mode="dark" />
            <BrandingStandard class="background-chalky-blue p-3" mode="light" />
        </div>

        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import { BrandingBadge, BrandingStandard } from '@chalkysticks/vue3';
    import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

    @Options({
        components: {
            BrandingBadge,
            BrandingStandard,
        },
    })
    export default class Home extends Vue {}
</script>
