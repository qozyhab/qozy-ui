<template>
    <div>
        <component v-if="ruleComponent" :is="ruleComponent" :rule="rule"></component>
    </div>
</template>

<script>
    import Client from "@/QozyClient.js"

    import ScriptRule from "./ScriptRule.vue";

    const ruleComponents = {
        "ScriptRule": ScriptRule,
    }

    export default {
        name: "Rule",
        props: {
            ruleId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                rule: null,
            }
        },
        computed: {
            ruleComponent() {
                if (this.rule && this.rule.type in ruleComponents) {
                    return ruleComponents[this.rule.type]
                }

                return null
            }
        },
        async mounted() {
            this.rule = await Client.getRule(this.ruleId)
        }
    }
</script>

<style lang="scss">

</style>
