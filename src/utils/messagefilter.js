import { recallGroupMsg,setGroupBan,sendPlainMsg } from "./netapi.js";
import { getPermissionLevel } from "./index.js";

const filterWords = [];

export async function msgFilter(data) {
    const groupId = (data.group_id).toString();
    const userId = (data.user_id).toString();
    const PermissionLevel = getPermissionLevel(groupId, userId);
    const messageId = (data.message_id).toString();
    const textContent = data.raw_message;
    let ret = false;
    for (let i in filterWords) {
        if (textContent.includes(filterWords[i])) {
            ret = true;
            break;
        }
    }
    if (ret && PermissionLevel < 1){
        await recallGroupMsg(messageId);
        setGroupBan(groupId, userId, 600);
        await sendPlainMsg(groupId,'检测到违禁词,禁言10分钟');
        return;
    }
}

export default{
    msgFilter
}