<template>
    <div class="rule">
        <div class="card horizontal" v-if="rule">
            <div class="header w-10 flex-fixed bg-highlight-3">
                <div class="background-icon" style="font-size: 2rem;">
                    {{rule.type}}
                </div>
            </div>
            <div class="content">
                <strong v-popper:bottom-end="'menu'" class="pull-right cursor-pointer"><icon icon="ellipsis-v" fixed-width></icon></strong>

                <div ref="menu" class="dropdown">
                    <ul class="menu vertical">
                        <li @click="remove()"><icon icon="trash" fixed-width></icon> Remove</li>
                    </ul>
                </div>

                <h4><router-link :to="{name: 'rule', params: {ruleId: rule.id}}">{{rule.name || rule.id}}</router-link></h4>
                <small v-if="rule.name">{{rule.id}}</small>
            </div>
        </div>
    </div>
</template>

<script>
    import {Rule} from "@/QozyClient.js"

    import EditableText from "@/components/EditableText.vue"
    import ChannelValue from "@/components/ChannelValue.vue"

    import {Confirm} from "@/utils.js"

    export default {
        name: "Rule",
        components: {EditableText, ChannelValue},
        props: {
            rule: {
                type: Rule,
                required: true
            }
        },
        methods: {
            async remove() {
                if (await Confirm("Remove Rule", "Are you sure to remove Rule " + this.rule.id + "?")) {
                    this.$emit('remove')
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
