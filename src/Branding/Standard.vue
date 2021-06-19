<template>
    <div class="chalky branding-standard branding-logo-text" :class="className">
        <h2>ChalkySticks</h2>
    </div>
</template>

<script lang="ts">
    import Base from '../Core/Base';
    import { Options } from 'vue-class-component';
    import { Prop } from 'vue-property-decorator';

    @Options({})
    export default class BrandingStandard extends Base {
        /**
         * Class Name
         *
         * @type string
         */
        public get className(): string {
            return [
                this.mode === 'dark' ? 'on-light' : 'on-dark',
                'size-' + this.size,
            ].join(' ');
        }

        /**
         * Mode
         * e.g. dark, light
         *
         * @type string
         */
        @Prop({
            type: String,
        })
        public mode: string = 'dark';

        /**
         * Size of badge
         * e.g. sm, md, lg
         *
         * @type string
         */
        @Prop({
            type: String,
        })
        public size: string = 'sm';
    }
</script>

<style lang="scss">
    .chalky.branding-standard {

    }
</style>
