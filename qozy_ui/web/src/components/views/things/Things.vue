<template>
    <div class="things row">
        <div class="col-lg-2">
            <div class="card">
                <nav>
                    <ul class="menu vertical">
                        <li @click="scan()">
                            <icon icon="search" fixed-width></icon>
                            Discover new Things

                            <icon v-if="scanning" icon="spinner" spin fixed-width class="pull-right"></icon>
                        </li>
                        <li @click="find()">
                            <icon icon="compass" fixed-width></icon>
                            Find Things

                            <icon v-if="finding" icon="spinner" spin fixed-width class="pull-right"></icon>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="col-lg-10">
            <div class="row">
                <div class="col-12">
                    <transition-group name="fade" tag="div">
                        <thing v-for="thing in things" :key="thing.id" :thing="thing" class="mb-2" @remove="removeThing(thing)"></thing>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Client from "@/QozyClient.js"

    import Thing from "./Thing.vue"
    import {Toast} from "@/utils.js"

    export default {
        name: 'things',
        components: {Thing},
        data() {
            return {
                things: [],
                scanning: false,
                finding: false,
            }
        },
        methods: {
            async scan() {
                this.scanning = true

                const newThings = await Client.scanThings()
                this.things = await Client.getThings()

                this.scanning = false

                if (newThings > 0) {
                    Toast("Found " + newThings + " new things")
                } else {
                    Toast("No new things found")
                }
            },
            async find() {
                this.finding = true

                await Client.findThings()
                this.things = await Client.getThings()

                this.finding = false
            },
            async removeThing(thing) {
                await thing.remove()

                this.things = await Client.getThings()
            }
        },
        async mounted() {
            this.things = await Client.getThings()
        }
    }
</script>

<style lang="scss">

</style>
