<template>
    <div class="bridge-settings-json" v-if="bridge">
        <textarea v-model="settingsJson" spellcheck="false"></textarea>
        <button @click="saveSettings(JSON.parse(settingsJson))" class="primary">Save</button>
    </div>
</template>

<script>
    import Client from "@/QozyClient.js"

    import JsonSchemaForm from "@/components/JsonSchema/JsonSchemaForm.vue"

    export default {
        name: 'BridgeSettingsJson',
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
                settingsJson: null
            }
        },
        methods: {
            async saveSettings(settings) {
                await this.bridge.setSettings(settings)
            }
        },
        async mounted() {
            this.bridge = await Client.getBridge(this.bridgeId)
            this.settingsJson = JSON.stringify(this.bridge.settings, null, 4)
        },
    }
</script>

<style lang="scss">
    .bridge-settings-json {
        textarea {
            resize: none;
            height: 800px;
        }
    }
</style>
