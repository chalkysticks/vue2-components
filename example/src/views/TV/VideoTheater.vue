<template>
    <div class="theater">
        <div class="d-flex">
            <TvVideoTheater ref="videoTheater" />

            <p>
                {{ title }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import { TvVideoTheater } from '@chalkysticks/vue3';
    import { CollectionSchedule, ModelSchedule } from '@chalkysticks/sdk-tv';

    @Options({
        components: {
            TvVideoTheater,
        },
    })
    export default class ViewTvVideoTheater extends Vue {
        /**
         * Reference to video theater
         *
         * @type TvVideoTheater
         */
        public get videoTheater(): TvVideoTheater {
            return this.$refs.videoTheater as TvVideoTheater;
        }

        /**
         * Get tiel of video
         *
         * @type string
         */
        public title: string = '';

        /**
         * Mounted
         *
         * @return void
         */
        mounted() {
            this.fetchSchedule();
        }

        /**
         * Fetch Schedule
         *
         * @return void
         */
        public fetchSchedule(): void {
            const collection: CollectionSchedule = new CollectionSchedule;

            collection
                .fetch()
                .then(() => {
                    this.videoTheater.setBySchedule(collection);

                    this.title = collection.getCurrentVideo().getTitle();
                });
        }
    }
</script>

<style lang="scss">
    .chalky.tv-videotheater {
        pointer-events: none;
        width: 80vw;
    }
</style>