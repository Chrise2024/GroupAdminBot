import { checkUid,isAdmin,getPermissionLevel } from "../utils/index.js";
import { commandlog ,commandlogperm} from "../utils/log.js";
import { addOP, removeOP,getOPList } from "../utils/op.js";
import { setGroupAdmin, discardGroupAdmin,setGroupSpecialTitle,recallGroupMsg,getMsg,setGroupBan,setGroupKick,getGroupMember,sendPlainMsg,restart } from "../utils/netapi.js";
import { printHelpText } from "./help.js";
import { getConfig,setConfig } from "../utils/config.js";
import { argSchema } from "../utils/dataSchema.js";

const cmdList = getConfig().commands;
var disableList = getConfig().disabledCmd;

export async function executeCommand(args:argSchema) {
    const PermissionLevel = args.permissionLevel;
    console.log(`Caller Permission Level: ${PermissionLevel}`);
    console.log(JSON.stringify(args));
    if (cmdList.indexOf(args.command) === -1) {
        sendPlainMsg(args.groupId,`未知指令 ${args.command}`);
        console.log("Unknown command");
        return;
    }
    else if (disableList.indexOf(args.command) !== -1) {
        sendPlainMsg(args.groupId,"该指令已被禁用");
        console.log("Command disabled");
        return;
    }
    else if (args.command === "titleself") {
        commandlog(args.command,args.groupId,args.caller);
        await setGroupSpecialTitle(args.groupId,args.caller,args.param[0]);
        return;
    }
    else if (args.command === "gettalktive") {
        commandlog(args.command,args.groupId,args.caller);
        return;
    }
    else if( args.command === "help"){
        commandlog(args.command,args.groupId,args.caller);
        if (args.param.length === 0){
            printHelpText(args.groupId);
            return;
        }
        else if (args.param.length === 1){
            printHelpText(args.groupId,args.param[0]);
            return;
        }
        else{
            sendPlainMsg(args.groupId,"无效指令");
            console.log("Invalid Command");
            return;
        }
    }
    else if( args.command === "listop"){
        commandlog(args.command,args.groupId,args.caller);
        const opList = getOPList(args.groupId);
        let outStr = '';
        for (let i in opList){
            let memInfo = await getGroupMember(args.groupId,opList[i]);
            if (memInfo.status === 'failed'){
                continue;
            }
            else{
                outStr += `${memInfo.data.nickname}<${memInfo.data.user_id}>,`;
            }
        }
        if (outStr.length > 0){
            console.log(outStr);
            sendPlainMsg(args.groupId,outStr);
            return;
        }
        else{
            console.log("No OPs");
            sendPlainMsg(args.groupId,"No OPs");
            return;
        }
    }
    else if (args.command === "ban") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupId,args.caller);
            sendPlainMsg(args.groupId,"权限等级不足");
            return false;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0]) ){
            const targetPermissionLevel = await getPermissionLevel(args.groupId,args.param[0]);
            if (PermissionLevel > targetPermissionLevel){
                if (!Number.isNaN(parseInt(args.param[1])) && parseInt(args.param[1]) < 2592000){
                    setGroupBan(args.groupId,args.param[0],parseInt(args.param[1]));
                    return;
                }
                else{
                    sendPlainMsg(args.groupId,"无效的时长");
                    console.log("Invalid Duration");
                    return;
                }
            }
            else{
                sendPlainMsg(args.groupId,"权限等级不足");
                return;
            }
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
        
    }
    else if (args.command === "kick") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupId,args.caller);
            sendPlainMsg(args.groupId,"权限等级不足");
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0]) ){
            const targetPermissionLevel = await getPermissionLevel(args.groupId,args.param[0]);
            if (PermissionLevel > targetPermissionLevel){
                setGroupKick(args.groupId,args.param[0]);
                return;
            }
            else{
                sendPlainMsg(args.groupId,"权限等级不足");
                return;
            }
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
        
    }
    else if (args.command === "recall") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupId,args.caller);
            sendPlainMsg(args.groupId,"权限等级不足");
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        const message = await getMsg(args.param[0]);
        if ((await getMsg(args.param[0])).status !== 'failed' && message.status !== 'failed'){
            const targetPermissionLevel = await getPermissionLevel(args.groupId,(message.data.sender.user_id).toString());
            if (PermissionLevel > targetPermissionLevel){
                recallGroupMsg(args.param[0]);
                recallGroupMsg(args.param[1]);
                return;
            }
            else{
                sendPlainMsg(args.groupId,"权限等级不足");
                return;
            }
        }
        else{
            sendPlainMsg(args.groupId,"无效的消息ID");
            console.log("Invalid Message ID");
            return;
        }
        
    }
    else if (args.command === "atall") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupId,args.caller);
            return false;
        }
        commandlog(args.command,args.groupId,args.caller);
    }
    else if (args.command === "settitle") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupId,args.caller);
            sendPlainMsg(args.groupId,"权限等级不足");
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0])){
            setGroupSpecialTitle(args.groupId,args.param[0],args.param[1]);
            return;
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
    }
    else if (args.command === "op") {
        if (PermissionLevel < 2){
            commandlogperm(args.command,args.groupId,args.caller);
            sendPlainMsg(args.groupId,"权限等级不足");
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0])){
            const memInfo = await getGroupMember(args.groupId,args.param[0]);
            if (memInfo.status === 'failed'){return;}
            if (addOP(args.groupId,args.param[0])){
                sendPlainMsg(args.groupId,`已将[${memInfo.data.nickname}]<${memInfo.data.user_id}>设为群管`);
            }
            return;
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
    }
    else if (args.command === "deop") {
        if (PermissionLevel < 2){
            commandlogperm(args.command,args.groupId,args.caller);
            sendPlainMsg(args.groupId,"权限等级不足");
            return
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0])){
            
            const memInfo = await getGroupMember(args.groupId,args.param[0]);
            if (memInfo.status === 'failed'){return;}
            if (removeOP(args.groupId,args.param[0])){
                sendPlainMsg(args.groupId,`已取消[${memInfo.data.nickname}]<${memInfo.data.user_id}>群管身份`);
            }
            return;
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
    }
    else if (args.command === "setadmin") {
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupId,args.caller);
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0])){
            if (await isAdmin(args.groupId,args.param[0])){
                console.log(`User ${args.param[0]} is already admin`);
                return;
            }
            else{
                setGroupAdmin(args.groupId,args.param[0]);
                console.log(`Set ${args.param[0]} Group Admin`);
                return;
            }
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
    }
    else if (args.command === "deadmin"){
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupId,args.caller);
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (!Number.isNaN(parseInt(args.param[0])) && await checkUid(args.groupId,args.param[0])){
            if (!isAdmin(args.groupId,args.param[0])){
                console.log(`User ${args.param[0]} is not admin`);
                return;
            }
            else{
                discardGroupAdmin(args.groupId,args.param[0]);
                console.log(`Discard ${args.param[0]} Group Admin`);
                return;
            }
        }
        else{
            sendPlainMsg(args.groupId,"无效的 UID");
            console.log("Invalid UID");
            return;
        }
    }
    else if (args.command === "enable") {
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupId,args.caller);
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (args.param[0] !== "enable" && args.param[0] !== "disable"){
            if (cmdList.indexOf(args.param[0]) !== -1){
                if (disableList.indexOf(args.param[0]) !== -1){
                    disableList.splice(disableList.indexOf(args.param[0]),1);
                    setConfig(getConfig(),"disabledCmd",disableList);
                    return;
                }
                else{
                    console.log("Command already enabled");
                    return;
                }
            }
            else{
                console.log("Command not found");
                return;
            }
        }
        else{
            console.log("Cannot opreate this command");
            return;
        }

    }
    else if (args.command === "disable") {
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupId,args.caller);
            return;
        }
        commandlog(args.command,args.groupId,args.caller);
        if (args.param[0] !== "enable" && args.param[0] !== "disable"){
            if (cmdList.indexOf(args.param[0]) !== -1){
                if (disableList.indexOf(args.param[0]) === -1){
                    disableList.push(args.param[0]);
                    setConfig(getConfig(),"disabledCmd",disableList);
                    return;
                }
                else{
                    console.log("Command already disabled");
                    return;
                } 
            }
            else{
                console.log("Command not found");
                return;
            }
        }
        else{
            console.log("Cannot opreate this command");
            return;
        }
    }
    else if (args.command === "restart") {
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupId,args.caller);
            return;
        }
        restart();
    }
    else{
        console.log("Unknown command");
        return false;
    }
}

export default {
    executeCommand
}