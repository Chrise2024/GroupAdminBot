import { getMsg } from "../utils/netapi.js";

export function parseArgs(body){
    const message = body.message;
    let args = {};
    if(message.length === 1){
        let temp = message[0].data.text.split(" ");
        if (temp.length > 3){
            return {error: "Unproper arguments",statue:false};
        }
        else if (temp.length === 1){
            try{
                args['command'] = temp[0];
                args['param'] = [];
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
            catch(err){
                console.log(err);
                return {error: "Unproper arguments",statue:false};
            }
        }
        else if (temp.length === 2){
            try{
                args['command'] = temp[0];
                args['param'] = [temp[1]];
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
            catch(err){
                console.log(err);
                return {error: "Unproper arguments",statue:false};
            }
        }
        else if (temp.length === 3){
            if (!Number.isNaN(parseInt(temp[1]))){
                args['command'] = temp[0];
                args['param'] = [temp[1],temp[2]];
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
            else{
                return {error: "Unproper arguments",statue:false}
            }
        }
    }
    else if (message.length === 2){
        try{
            if (message[0].type === 'text' && message[1].type === 'at'){
                args['command'] = (message[0].data.text).trim();
                args['param'] = [(message[1].data.qq).toString()];
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
            else{
                return {error: "Unproper arguments",statue:false};
            }
        }
        catch(err){
            console.log(err);
            return {error: "Unproper arguments",statue:false};
        }
    }
    else if (message.length === 3){
        try{
            if (message[0].type !== 'text' && message[1].type !== 'at' && message[2].type !== 'text'){
                return {error: "Unproper arguments",statue:false};
            }
            else {
                args['command'] = (message[0].data.text).trim();
                args['param'] = [(message[1].data.qq).toString()];
                let tvar = (message[2].data.text).trim();
                if (tvar .length > 0){
                    args['param'].push((message[2].data.text).trim());
                }
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
        }
        catch(err){
            console.log(err);
            return {error: "Unproper arguments",statue:false};
        }
    }
    else if (message.length === 4){
        try{
            if (message[0].type === 'reply' && message[3].type === 'text'){
                //console.log(getMsg(message[0].data.id));
                args['command'] = message[3].data.text;
                args['param'] = [(getMsg(message[0].data.id).data.message_id).toString(),(body.message_id).toString()];
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
            else if (message[0].type === 'text' && message[1].type === 'at' && message[3].type === 'text'){
                args['command'] = (message[0].data.text).trim();
                args['param'] = [(message[1].data.qq).toString(),(message[3].data.text).trim()];
                args['caller'] = (body.user_id).toString();
                args['groupid'] = (body.group_id).toString();
                args['statue'] = true;
                return args;
            }
        }
        catch(err){
            console.log(err);
            return {error: "Unproper arguments",statue:false};
        }
    }
    else{
        return {error: "Unproper arguments",statue:false};
    }
}

export default{
    parseArgs
}