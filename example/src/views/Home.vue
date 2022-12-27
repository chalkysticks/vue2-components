<template>
    <div class="view-home">
        <h1>Hello World</h1>

        <section class="level-0">
            <header>
                <h2>Branding</h2>
            </header>

            <section class="level-1">
                <header>
                    <h3>Badges</h3>
                </header>
                <div>
                    <BrandingBadge size="sm" mode="dark" />
                    <BrandingBadge size="sm" mode="light" />
                </div>
                <div>
                    <BrandingBadge size="md" mode="dark" />
                    <BrandingBadge size="md" mode="light" />
                </div>
                <div>
                    <BrandingBadge size="lg" mode="dark" />
                    <BrandingBadge size="lg" mode="light" />
                </div>
            </section>

            <section class="level-1">
                <header>
                    <h3>Standard Branding</h3>
                </header>
                <div class="d-flex">
                    <BrandingStandard class="background-chalky-white p-3" mode="dark" />
                    <BrandingStandard class="background-chalky-blue p-3" mode="light" />
                </div>
            </section>
        </section>

        <section class="level-0">
            <header>
                <h2>Authentication</h2>
            </header>
            <section class="level-1">
                <header>
                    <h3>Login Header</h3>
                </header>
                <div>
                    <AuthenticationNavigation />
                </div>
            </section>
            <section class="level-1">
                <header>
                    <h3>Standard Login</h3>
                </header>
                <div>
                    <AuthenticationBasicLogin />
                </div>
            </section>
            <section class="level-1">
                <header>
                    <h3>Social Login</h3>
                </header>
                <div>
                    <AuthenticationSocialLogin />
                </div>
            </section>
            <section class="level-0">
                <AuthenticationAuthPanel />
            </section>
        </section>
    </div>
</template>

<script lang="ts">
    import { ViewBase } from '@chalkysticks/vue2';
    import { Component } from 'vue-property-decorator';

    @Component
    export default class Home extends ViewBase {
    }
</script>

<style lang="scss">
    .view-home {
        margin: 0 auto;
        max-width: 1024px;
        padding: 2rem;
        text-align: left;

        .level-0 {
            margin: 2rem 0;
            padding: 2rem 0;
        }

        .level-1 {
            margin: 2rem 0;
            padding-left: 300px;

            > header {
                float: left;
                margin-left: -300px;
            }
        }

        h2 {
            color: #D1D1D1;
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.05rem;
            text-transform: uppercase;
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 500;
            letter-spacing: -0.05rem;
        }
    }
</style>
