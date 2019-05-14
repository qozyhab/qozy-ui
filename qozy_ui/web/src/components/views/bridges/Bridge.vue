<template>
    <div class="bridge">
        <div class="card horizontal" v-if="bridge">
            <div class="header w-10 flex-fixed bg-highlight">
                <div class="background-icon" style="font-size: 2rem;">
                    {{bridge.vendorPrefix}}
                </div>
            </div>
            <div class="content">
                <strong v-popper:bottom-end="'menu'" class="pull-right cursor-pointer"><icon icon="ellipsis-v" fixed-width></icon></strong>
                <div ref="menu" class="dropdown">
                    <ul class="menu vertical">
                        <li>
                            <span v-if="!bridge.active" @click="activate()"><icon icon="play-circle" fixed-width></icon> Activate</span>
                            <span v-else @click="deactivate()"><icon icon="stop-circle" fixed-width></icon> Deactivate</span>
                        </li>
                        <router-link tag="li" :to="{name: 'bridge_settings', params: {bridgeId: bridge.id}}">
                            <icon icon="cogs" fixed-width></icon> Settings
                        </router-link>
                        <li @click="remove()"><icon icon="trash" fixed-width></icon> Remove</li>
                    </ul>
                </div>

                <div class="h4">{{bridge.id}}</div>

                <ul>
                    <li>
                        Running
                        <span v-if="running" class="color-okay"><icon icon="check"></icon></span>
                        <span v-else class="color-bad"><icon icon="times"></icon></span>
                    </li>
                    <li>
                        Active
                        <span v-if="bridge.active" class="color-okay"><icon icon="check"></icon></span>
                        <span v-else class="color-bad"><icon icon="times"></icon></span>
                    </li>
                    <li>Things: {{things.length}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {Bridge} from "@/QozyClient.js"
    import {Confirm} from "@/utils.js"

    export default {
        name: 'bridges',
        props: {
            bridge: {
                type: Bridge,
                required: true
            }
        },
        data() {
            return {
                running: null,
                things: []
            }
        },
        methods: {
            async activate() {
                await this.bridge.activate()
            },
            async deactivate() {
                await this.bridge.deactivate()
            },
            async remove() {
                if (await Confirm("Remove Bridge", "Are you sure to remove Bridge " + this.bridge.id + "?")) {
                    this.$emit('remove')
                }
            }
        },
        async mounted() {
            this.running = await this.bridge.isRunning()
            this.things = await this.bridge.getThings()
        },
    }
</script>

<style lang="scss">

</style>
