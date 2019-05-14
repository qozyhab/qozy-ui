import axios from "axios"


export class Client {
    constructor(apiUrl) {
        this.apiUrl = apiUrl
    }

    async _get(path, params=null) {
        const result = await axios.get(this.apiUrl + path, {
            params: params
        })

        if (result.status !== 200) {
            throw new Exception(result.data)
        }

        return result.data
    }

    async _post(path, params=null, payload=null) {
        const result = await axios.post(this.apiUrl + path, JSON.stringify(payload))

        if (result.status !== 200) {
            throw new Exception(result.data)
        }

        return result.data
    }

    async _put(path, params=null, payload=null) {
        const result = await axios.put(this.apiUrl + path, JSON.stringify(payload))

        if (result.status !== 200) {
            throw new Exception(result.data)
        }

        return result.data
    }

    async _patch(path, params=null, payload=null) {
        const result = await axios.patch(this.apiUrl + path, JSON.stringify(payload))

        if (result.status !== 200) {
            throw new Exception(result.data)
        }

        return result.data
    }

    async _delete(path, params=null, payload=null) {
        const result = await axios.delete(this.apiUrl + path, {
            params: params
        }, payload)

        if (result.status !== 200) {
            throw new Exception(result.data)
        }

        return result.data
    }

    async getBridge(bridgeId) {
        const bridge = await this._get(`/bridges/${bridgeId}`)

        return new Bridge(
            this,
            bridge["id"],
            bridge["active"],
            bridge["vendorPrefix"],
            bridge["instanceId"],
            bridge["settingsSchema"],
            bridge["settings"]
        )
    }

    async getBridges() {
        const bridges = await this._get("/bridges", {expand: true})

        const result = []
        for (let bridgeId in bridges) {
            result.push(
                new Bridge(
                    this,
                    bridges[bridgeId]["id"],
                    bridges[bridgeId]["active"],
                    bridges[bridgeId]["vendorPrefix"],
                    bridges[bridgeId]["instanceId"],
                    bridges[bridgeId]["settingsSchema"],
                    bridges[bridgeId]["settings"]
                )
            )
        }

        return result
    }

    async getBridgeTypes() {
        return await this._get("/bridges/types")
    }

    async createBridge(bridgeType) {
        const bridgeId = await this._post("/bridges", null, bridgeType)

        return await this.getBridge(bridgeId)
    }

    async getThing(thingId) {
        const thing = await this._get(`/things/${thingId}`)

        const result = new Thing(
            this,
            thing["id"],
            thing["name"],
            thing["bridge_id"],
            thing["tags"],
        )

        for (let channelName in thing["channels"]) {
            const channel = thing["channels"][channelName]

            result.channels[channelName] = new Channel(
                this,
                result,
                channel["id"],
                channel["name"],
                channel["sensor"],
                channel["type"],
                channel["value"],
            )
        }

        return result
    }

    async getThings() {
        const things = await this._get("/things", {expand: true})

        const result = []
        for (let thingId in things) {
            const thing = things[thingId]

            const resultThing = new Thing(
                this,
                thing["id"],
                thing["name"],
                thing["bridge_id"],
                thing["tags"],
            )

            for (let channelName in thing["channels"]) {
                const channel = thing["channels"][channelName]

                resultThing.channels[channelName] = new Channel(
                    this,
                    resultThing,
                    channel["id"],
                    channel["name"],
                    channel["sensor"],
                    channel["type"],
                    channel["value"],
                )
            }

            result.push(resultThing)
        }

        return result
    }

    async getNotifications() {
        const notifications = await this._get("/notifications")

        const result = []
        for (let notification of notifications) {
            result.push(
                new Notification(
                    this,
                    notification["contextId"],
                    notification["type"],
                    notification["dismissable"],
                    notification["created"],
                    notification["title"],
                    notification["summary"],
                )
            )
        }

        return result
    }

    async scanThings() {
        return await this._get("/things/scan")
    }

    async findThings() {
        return await this._get("/things/find")
    }

    async getRules() {
        const rules = await this._get("/rules", {expand: true})

        const result = []
        for (let ruleId in rules) {
            const rule = rules[ruleId]

            result.push(
                new Rule(
                    this,
                    rule["id"],
                    rule["type"],
                    rule["name"],
                    rule["condition"],
                    rule["script"]
                )
            )
        }

        return result
    }

    async getRule(ruleId) {
        const rule = await this._get(`/rules/${ruleId}`)

        return new Rule(
            this,
            rule["id"],
            rule["type"],
            rule["name"],
            rule["condition"],
            rule["script"]
        )
    }

    async createRule() {
        const ruleId = await this._post("/rules")

        return await this.getRule(ruleId)
    }
}

export class Bridge {
    constructor(client, id, active, vendorPrefix, instanceId, settingsSchema, settings) {
        this.client = client
        this.id = id
        this.active = active
        this.vendorPrefix = vendorPrefix
        this.instanceId = instanceId
        this.settingsSchema = settingsSchema
        this.settings = settings
    }

    async getThings() {
        const things = await this.client._get(`/bridges/${this.id}/things`)

        const result = []
        for (let thingId in things) {
            const thing = things[thingId]

            const resultThing = new Thing(
                this,
                thing["id"],
                thing["name"],
                thing["bridge_id"],
                thing["tags"],
            )

            for (let channelName in thing["channels"]) {
                const channel = thing["channels"][channelName]

                resultThing.channels[channelName] = new Channel(
                    this,
                    resultThing,
                    channel["id"],
                    channel["name"],
                    channel["sensor"],
                    channel["type"],
                    channel["value"],
                )
            }

            result.push(resultThing)
        }

        return result
    }

    async isRunning() {
        return await this.client._get(`/bridges/${this.id}/running`)
    }

    async setSettings(settings) {
        await this.client._put(
            `/bridges/${this.id}/settings`,
            null,
            settings
        )

        this.settings = settings

        return true
    }

    async remove() {
        return await this.client._delete(`/bridges/${this.id}`)
    }

    async activate() {
        await this.client._post(`/bridges/${this.id}/activate`)

        this.active = true

        return true
    }

    async deactivate() {
        await this.client._post(`/bridges/${this.id}/deactivate`)

        this.active = false

        return true
    }
}

export class Thing {
    constructor(client, id, name, bridgeId, tags) {
        this.client = client
        this.id = id
        this.name = name
        this.bridgeId = bridgeId
        this.tags = tags
        this.channels = {}
    }

    async isOnline() {
        return await this.client._get(`/things/${this.id}/online`)
    }

    async setName(name) {
        const result = await this.client._put(`/things/${this.id}/name`, null, name)

        if (result) {
            this.name = name

            return true
        }

        return false
    }

    hasName() {
        return this.name !== null
    }

    async getBridge() {
        return await this.client.bridge(this.bridgeId)
    }

    channel(name) {
        return this.channels[name]
    }

    async remove() {
        return await this.client._delete(`/things/${this.id}`)
    }
}

export class Channel {
    constructor(client, thing, id, name, sensor, type, value) {
        this.client = client
        this.thing = thing
        this.id = id
        this.name = name
        this.sensor = sensor
        this.type = type
        this.value = value
    }

    async apply(value) {
        return await this.client._put(
            `/things/${this.thing.id}/channels/${this.name}`,
            null,
            value
        )
    }
}

export class Notification {
    constructor(client, contextId, type, dismissable, created, title, summary) {
        this.client = client
        this.contextId = contextId
        this.type = type
        this.dismissable = dismissable
        this.created = created
        this.title = title
        this.summary = summary
    }
}

export class Rule {
    constructor(client, id, type, name, condition, script) {
        this.client = client
        this.id = id
        this.type = type
        this.name = name
        this.condition = condition
        this.script = script
    }

    async setName(name) {
        await this.client._patch(`/rules/${this.id}`, null,{name: name})

        this.name = name
    }

    async save() {
        await this.client._patch(`/rules/${this.id}`, null,{condition: this.condition, script: this.script})
    }

    async remove() {
        return await this.client._delete(`/rules/${this.id}`)
    }

    async checkCondition() {
        return await this.client._get(`/rules/${this.id}/condition`)
    }

    async execute() {
        return await this.client._get(`/rules/${this.id}/execute`)
    }
}

export default new Client("/api")
