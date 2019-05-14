<template>
    <div class="bridge-settings-form" v-if="bridge">
        <json-schema-form v-model="settings" :schema="bridge.settingsSchema"></json-schema-form>
        <button @click="saveSettings(settings)">Save</button>
    </div>
</template>

<script>
    import Client from "@/QozyClient.js"

    import JsonSchemaForm from "@/components/JsonSchema/JsonSchemaForm.vue"

    export default {
        name: 'BridgeSettingsForm',
        components: {JsonSchemaForm},
        props: {
            bridgeId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                bridge: null,
                settings: null
            }
        },
        methods: {
            async saveSettings(settings) {
                await this.bridge.setSettings(settings)
            }
        },
        async mounted() {
            this.bridge = await Client.getBridge(this.bridgeId)
            this.settings = this.bridge.settings
        },
    }
</script>

<style lang="scss">

</style>
