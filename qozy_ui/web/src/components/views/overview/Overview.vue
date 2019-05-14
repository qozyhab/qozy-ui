<template>
    <div class="overview">
        <transition name="fade">
            <div class="row" v-if="dashboards.length > 0">
                <div class="col-12">
                    <h2>Dashboards</h2>
                </div>

                <div class="col-sm-6 col-lg-4 col-xl-3 overview-card" v-for="dashboard in dashboards" :key="dashboard.id">
                    <dashboard :dashboard-id="dashboard"></dashboard>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div class="row mt-5" v-if="notifications.length > 0">
                <div class="col-12">
                    <h2>Notifications</h2>
                </div>

                <div class="col-sm-6 col-lg-4 col-xl-3 overview-card" v-for="notification in notifications" :key="notification.created">
                    <div class="card horizontal h-100">
                        <div class="header w-30 flex-fixed bg-highlight2" style="background-color: #FCD02C">
                            <div class="background-icon">
                                <icon icon="envelope"></icon>
                            </div>
                        </div>
                        <div class="content">
                            <div class="h3">{{notification.title}}</div>
                            <p>{{notification.summary}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import axios from "axios"

    import Client from "@/QozyClient.js"

    import Dashboard from "./Dashboard.vue"
    import Expression from "@/components/expression/Expression.vue"

    export default {
        name: 'overview',
        components: {Expression, Dashboard},
        data() {
            return {
                "dashboards": [],
                "notifications": [],
            }
        },
        methods: {
            async removeDashboard(dashboard) {
                await axios.delete(`/ui/api/dashboard${dashboard}`)

                this.dashboards.splice(this.dashboards.indexOf(dashboard), 1)
            },
            async addDashboard() {
                const result = await axios.post("/ui/api/dashboard", {"name": "TODO!"})
                this.dashboards.push(result.data)
            }
        },
        async mounted() {
            let result = await axios.get("/ui/api/dashboard")
            this.dashboards = result.data

            this.notifications = await Client.getNotifications()
        }
    }
</script>

<style lang="scss">

</style>
