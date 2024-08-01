import { sendPlainMsg } from "../utils/netapi.js";

const rootHelpText = 
`---------------help---------------
指令列表：
权限等级0：
    /titleself - 设置自己的群头衔
    /help      - 查看帮助
    /listop    - 查看群管列表
权限等级1：
    /ban       - 禁言
    /kick      - 踢出群
    /settitle  - 设置成员的群头衔
    /recall    - 撤回消息
权限等级2：
    /op        - 设置群管
    /deop      - 取消群管
权限等级3：
    /setadmin  - 设置管理员
    /deadmin   - 取消管理员
    /enable    - 启用功能
    /disable   - 禁用功能
权限等级：
    群员0，群管1，管理员2，后台3
    仅可以使用权限等级不大于自身权限等级的指令
    使用/help+具体指令查看使用方法
    e.g. /help titleself
 `
const helptitleself = 
`---------------help---------------
权限等级0
/titleself - 设置自己的群头衔
使用方法：/titleself <群头衔>
e.g. /titleself 菜就多练
注意，群头衔最多6个汉字或18个英文字符，可以混排，但是容易产生乱码
`
const helpban = 
`---------------help---------------
权限等级1
/ban - 禁言
使用方法：/ban <@成员|对应成员的QQ号> <时间(单位秒)>
e.g. /ban @xxx 3600 或 /ban 123456789 3600
注意，时长为0的禁言为解除禁言，仅可以禁言权限等级低于自己的成员
`
const helpkick = 
`---------------help---------------
权限等级1
/kick - 踢出群
使用方法：/kick <@成员|对应成员的QQ号>
e.g. /kick @xxx 或 /kick 123456789
注意，仅可以踢出权限等级低于自己的成员
`
const helpsettitle = 
`---------------help---------------
权限等级1
/settitle - 设置成员的群头衔
使用方法：/settitle <@成员|对应成员的QQ号> <群头衔>
e.g. /settitle @xxx 菜就多练 或 /settitle 123456789 菜就多练
注意，群头衔最多6个汉字或18个英文字符，可以混排，但是容易产生乱码
`
const helprecall = 
`---------------help---------------
权限等级1
/recall - 撤回消息
使用方法：用 /recall 回复想撤回的消息(需要删除回复自带的at)
注意：仅可以撤回权限等级低于自己的成员的消息
`
const helpop =
 `---------------help---------------
 权限等级2
/op - 设置群管
使用方法：/op <@成员|对应成员的QQ号>
e.g. /op @xxx 或 /op 123456789
`
const helpdeop = 
`---------------help---------------
权限等级2
/deop - 取消群管
使用方法：/deop <@成员|对应成员的QQ号>
e.g. /deop @xxx 或 /deop 123456789
`

export function printHelpText(groupid:string,targetCommand:string = ""){
    if (targetCommand === ""){
        sendPlainMsg(groupid,rootHelpText);
    }
    else{
        if (targetCommand == "titleself"){
            sendPlainMsg(groupid, helptitleself);
        }
        else if (targetCommand == "ban"){
            sendPlainMsg(groupid, helpban);
        }
        else if (targetCommand == "kick"){
            sendPlainMsg(groupid, helpkick);
        }
        else if (targetCommand == "settitle"){
            sendPlainMsg(groupid, helpsettitle);
        }
        else if (targetCommand == "recall"){
            sendPlainMsg(groupid, helprecall);
        }
        else if (targetCommand == "op"){
            sendPlainMsg(groupid, helpop);
        }
        else if (targetCommand == "deop"){
            sendPlainMsg(groupid, helpdeop);
        }
        else{
            sendPlainMsg(groupid, "指令不存在");
        }
    }
}

export default{
    printHelpText
}