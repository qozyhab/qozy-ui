<template>
    <div class="rules row">
        <div class="col-lg-2">
            <div class="card">
                <nav>
                    <ul class="menu vertical">
                        <li v-popper:bottom="'add-types'" class="relative">
                            <icon icon="plus-circle" fixed-width></icon> Add rule

                            <div ref="add-types" class="dropdown w-100">
                                <ul class="menu vertical">
                                    <li @click="createScriptRule()"><icon icon="code" fixed-width></icon> Script</li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="col-lg-10">
            <div class="row">
                <div class="col-12">
                        <rule v-for="rule in rules" :key="rule.id" :rule="rule" class="mb-2" @remove="removeRule(rule)"></rule>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Client from "@/QozyClient.js"

    import Rule from "./Rule.vue"

    export default {
        name: "Rules",
        components: {Rule},
        data() {
            return {
                rules: [],
            }
        },
        methods: {
            async createScriptRule() {
                await Client.createRule()

                this.rules = await Client.getRules()
            },
            async removeRule(rule) {
                await rule.remove()

                this.rules = await Client.getRules()
            }
        },
        async mounted() {
            this.rules = await Client.getRules()
        }
    }
</script>

<style lang="scss">

</style>
