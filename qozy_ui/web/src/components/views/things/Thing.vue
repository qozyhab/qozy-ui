<template>
    <div class="thing">
        <div class="card horizontal" v-if="thing">
            <div class="header w-10 flex-fixed bg-highlight-2">
                <div class="background-icon" style="font-size: 2rem;">
                </div>
            </div>
            <div class="content">
                <strong v-popper:bottom-end="'menu'" class="pull-right cursor-pointer"><icon icon="ellipsis-v" fixed-width></icon></strong>

                <div ref="menu" class="dropdown">
                    <ul class="menu vertical">
                        <li @click="remove()"><icon icon="trash" fixed-width></icon> Remove</li>
                    </ul>
                </div>

                <div class="h4">
                    <editable-text :value="thing.name" :placeholder="thing.id" @input="updateName($event)"></editable-text>
                </div>
                <small v-if="thing.name">{{thing.id}}</small>

                <ul>
                    <li v-for="channel in thing.channels" :key="channel.name">
                        <span v-if="online">
                            {{channel.name}}:
                            <channel-value v-if="online" :thing-id="thing.id" :channel="channel.name"></channel-value>
                        </span>
                        <span v-else>
                            {{channel.name}}
                        </span>
                    </li>
                </ul>

                <ul>
                    <li>
                        <span v-if="online">Online <icon icon="check" class="color-okay"></icon></span>
                        <span v-else>Offline <icon icon="times" class="color-bad"></icon></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {Thing} from "@/QozyClient.js"
    import EditableText from "@/components/EditableText.vue"
    import ChannelValue from "@/components/ChannelValue.vue"

    import {Confirm} from "@/utils.js"

    export default {
        name: 'thing',
        components: {EditableText, ChannelValue},
        props: {
            thing: {
                type: Thing,
                required: true
            }
        },
        data() {
            return {
                online: null
            }
        },
        methods: {
            async remove() {
                if (await Confirm("Remove Thing", "Are you sure to remove Thing " + this.thingId + "?")) {
                    this.$emit('remove')
                }
            },
            async updateName(value) {
                await this.thing.setName(value)
            }
        },
        async mounted() {
            this.online = await this.thing.isOnline()
        },
    }
</script>

<style lang="scss">

</style>
