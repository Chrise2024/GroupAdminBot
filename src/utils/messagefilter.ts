import { recallGroupMsg,setGroupBan,sendPlainMsg } from "./netapi.js";
import { getPermissionLevel } from "./index.js";
import { msgBodySchema } from "./dataSchema.js";

const filterWords:Array<string> = [];

export async function msgFilter(data:msgBodySchema) {
    const groupId = (data.group_id).toString();
    const userId = (data.user_id).toString();
    const messageId = (data.message_id).toString();
    const textContent = data.raw_message;
    let ret = false;
    for (let i in filterWords) {
        if (textContent.includes(filterWords[i])) {
            ret = true;
            break;
        }
    }
    if (ret && await getPermissionLevel(groupId, userId) < 1){
        await recallGroupMsg(messageId);
        setGroupBan(groupId, userId, 600);
        await sendPlainMsg(groupId,'检测到违禁词,禁言10分钟');
        return;
    }
}

export default{
    msgFilter
}