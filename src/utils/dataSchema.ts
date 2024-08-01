export interface configSchema extends Object {
    "httpUrl": string,
    "wsUrl": string,
    "groupIds": Array<string>,
    "Commanders": Array<string>,
    "commands": Array<string>,
    "disabledCmd": Array<string>
    "commandPrefix": string
}

export const defaultConfig = {
    "httpUrl": "",
    "wsUrl": "",
    "groupIds":[],
    "Commanders":[],
    "commands":[],
    "disabledCmd":[],
    "commandPrefix": "/"
}

export interface argSchema extends Object {
    "command": string,
    "param": Array<string>,
    "caller": string,
    "permissionLevel": number,
    "groupId": string,
    "msgId": string,
    "status": boolean
}

export const defaultArg = {
    "command": "",
    "param": [],
    "caller": "",
    "permissionLevel":0,
    "groupId": "",
    "msgId": "string",
    "status": false
}

export interface msgSegmentSchema extends Object {
    "type": string,
    "data":msgDataSchema
}

interface msgDataSchema {
    "text"?: string,
    "id"?: string,
    "file"?: string,
    "qq"?: string,
    "type"?: string,
    "url"?: string,
    "title"?: string,
    "data"?:string
}

export interface msgBodySchema extends Object {
    "time":number,
    "post_type":string,
    "message_type":string,
    "group_id":number,
    "user_id":number,
    "message_id":number,
    "message":Array<msgSegmentSchema>,
    "raw_message":string,
}