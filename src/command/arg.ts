import { getMsg } from "../utils/netapi.js";
import { argSchema,msgBodySchema,msgSegmentSchema,defaultArg } from "../utils/dataSchema.js";
import Config from "./index.js";
import {getPermissionLevel} from "../utils/index.js";

export async function parseArgs(commandPrefix:string,body:msgBodySchema){
    if (!body.message){ return defaultArg; }
    const permissionLevel = await getPermissionLevel((body.group_id).toString(),(body.user_id).toString());
    const messageArray:Array<msgSegmentSchema> = body.message;
    let args:argSchema = defaultArg;
    if(messageArray.length === 1 && messageArray[0].data.text && messageArray[0].data.text.startsWith(commandPrefix)){
        let temp = messageArray[0].data.text.split(" ");
        if (temp.length > 3){
            return defaultArg;
        }
        else if (temp.length === 1){
            try{
                args['command'] = temp[0];
                args['param'] = [];
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
            catch(err){}
            return args;
        }
        else if (temp.length === 2){
            try{
                args['command'] = temp[0];
                args['param'] = [temp[1]];
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
            catch(err){}
            return args;
        }
        else if (temp.length === 3){
            if (!Number.isNaN(parseInt(temp[1]))){
                args['command'] = temp[0];
                args['param'] = [temp[1],temp[2]];
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
            return args;
        }
        else{
            return defaultArg;
        }
    }
    else if (messageArray.length === 2){
        try{
            if (messageArray[0].type === 'text' && messageArray[1].type === 'at'){
                if (!(messageArray[0].data.text && messageArray[1].data.qq)){
                    return defaultArg;
                }
                args['command'] = (messageArray[0].data.text).trim();
                args['param'] = [(messageArray[1].data.qq).toString()];
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
        }
        catch(err){}
        return args;
    }
    else if (messageArray.length === 3){
        try{
            if (messageArray[0].type !== 'text' && messageArray[1].type !== 'at' && messageArray[2].type !== 'text'){
                return defaultArg;
            }
            else {
                if (!(messageArray[0].data.text && messageArray[1].data.qq && messageArray[2].data.text)){
                    return defaultArg;
                }
                args['command'] = (messageArray[0].data.text).trim();
                args['param'] = [(messageArray[1].data.qq).toString()];
                let tvar = (messageArray[2].data.text).trim();
                if (tvar.length > 0){
                    args['param'].push((messageArray[2].data.text).trim());
                }
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
        }
        catch(err){}
        return args;
    }
    else if (messageArray.length === 4){
        try{
            if (messageArray[0].type === 'reply' && messageArray[3].type === 'text'){
                if ((!messageArray[3].data.text || !messageArray[0].data.id)){
                    return defaultArg;
                }
                args['command'] = messageArray[3].data.text;
                args['param'] = [((await getMsg(messageArray[0].data.id)).data.message_id).toString(),(body.message_id).toString()];
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
            else if (messageArray[0].type === 'text' &&messageArray[1].type === 'at' && messageArray[3].type === 'text'){
                if (!(messageArray[0].data.text && messageArray[1].data.qq && messageArray[3].data.text)){
                    return defaultArg;
                }
                args['command'] = (messageArray[0].data.text).trim();
                args['param'] = [(messageArray[1].data.qq).toString(),(messageArray[3].data.text).trim()];
                args['caller'] = (body.user_id).toString();
                args['permissionLevel'] = permissionLevel
                args['groupId'] = (body.group_id).toString();
                args['msgId'] = (body.message_id).toString();
                args['status'] = true;
            }
        }
        catch(err){}
        return args;
    }
    else{
        return defaultArg;
    }
}

export default{
    parseArgs
}