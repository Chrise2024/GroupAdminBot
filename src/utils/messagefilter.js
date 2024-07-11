import { recallGroupMsg,setGroupBan,sendPlainMsg } from "./netapi.js";

const filterWords = [
    '裙号',
    '重要通知',
    '招暑假工',
    '校园墙',
    '五社',
    '五中社区',
    '五中校友社区',
    '五光吾行'
]

export async function msgFilter(data) {
    console.log(data);
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
    if (ret){
        await recallGroupMsg(messageId);
        setGroupBan(groupId, userId, 600);
        await sendPlainMsg(groupId,'检测到违禁词,禁言10分钟');
        return;
    }
}

export default{
    msgFilter
}