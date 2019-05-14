<template>
    <div class="bridges row">
            <div class="col-lg-2">
                <div class="card">
                    <nav>
                        <ul class="menu vertical">
                            <li v-for="bridgeType in bridgeTypes" :key="bridgeType" @click="addBridge(bridgeType)">
                                <icon icon="plus-circle"></icon>

                                {{bridgeType}}
                            </li>
                            <li>Install new</li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="col-lg-10">
                <div class="row">
                    <div class="col-12">
                        <transition-group name="fade" tag="div">
                            <bridge v-for="bridge in bridges" :key="bridge.id" :bridge="bridge" class="mb-2" @remove="removeBridge(bridge)"></bridge>
                        </transition-group>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    import Client from "@/QozyClient.js"
    import Bridge from "./Bridge.vue"

    export default {
        name: 'bridges',
        components: {Bridge},
        data() {
            return {
                bridgeTypes: [],
                bridges: []
            }
        },
        methods: {
            async addBridge(bridgeType) {
                await Client.createBridge(bridgeType)

                this.bridges = await Client.getBridges()
            },
            async removeBridge(bridge) {
                await bridge.remove()

                this.bridges = await Client.getBridges()
            }
        },
        async mounted() {
            this.bridges = await Client.getBridges()
            this.bridgeTypes = await Client.getBridgeTypes()
        }
    }
</script>

<style lang="scss">

</style>
