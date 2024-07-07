import { checkUid,isAdmin,getPermissionLevel } from "../utils/index.js";
import { commandlog ,commandlogperm} from "../utils/log.js";
import { addOP, removeOP,getOPList } from "../utils/op.js";
import { setGroupAdmin, discardGroupAdmin,setGroupSpecialTitle,recallGroupMsg,getMsg,setGroupBan,setGroupKick,getGroupMember,sendPlainMsg } from "../utils/netapi.js";
import { printHelpText } from "./help.js";

export function executeCommand(args,PermissionLevel) {
    console.log(`Caller Permission Level: ${PermissionLevel}`);
    if (args.command === "/titleself") {
        commandlog(args.command,args.groupid,args.caller,args.param);
        setGroupSpecialTitle(args.groupid,args.caller,args.param[0]);
    }
    else if (args.command === "/gettalktive") {
        commandlog(args.command,args.groupid,args.caller,args.param);
    }
    else if( args.command === "/help"){
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (args.param.length === 0){
            printHelpText(args.groupid);
        }
        else if (args.param.length === 1){
            printHelpText(args.groupid,args.param[0]);
        }
        else{
            console.log("Invalid Command");}
    }
    else if( args.command === "/listop"){
        commandlog(args.command,args.groupid,args.caller,args.param);
        const opList = getOPList(args.groupid);
        let outStr = '';
        for (let i in opList){
            let memInfo = getGroupMember(args.groupid,opList[i]);
            outStr += `${memInfo.data.nickname}<${memInfo.data.user_id}>,`;
        }
        if (outStr.length > 0){
            console.log(outStr);
            sendPlainMsg(args.groupid,outStr);
        }
        else{
            console.log("No OPs");
            sendPlainMsg(args.groupid,"No OPs");
        }
    }
    else if (args.command === "/ban") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        const targetPermissionLevel = getPermissionLevel(args.groupid,args.param[0]);
        if (PermissionLevel > targetPermissionLevel){
            if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0]) ){
                if (!Number.isNaN(parseInt(args.param[1])) && parseInt(args.param[1]) < 2592000){
                    setGroupBan(args.groupid,args.param[0],args.param[1]);
                    return true;
                }
                else{
                    console.log("Invalid Duration");
                    return false;
                }
            }
            else{
                console.log("Invalid UID");
                return false;
            }
        }
        else{
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
    }
    else if (args.command === "/kick") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        const targetPermissionLevel = getPermissionLevel(args.groupid,args.param[0]);
        if (PermissionLevel > targetPermissionLevel){
            if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0]) ){
                setGroupKick(args.groupid,args.param[0]);
                return true;
            }
            else{
                console.log("Invalid UID");
                return false;
            }
        }
        else{
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
    }
    else if (args.command === "/recall") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (getMsg(args.param[0]).status !== 'failed' && getMsg(args.param[1]).status !== 'failed'){
            const targetPermissionLevel = getPermissionLevel(args.groupid,(getMsg(args.param[0]).data.sender.user_id).toString());
            if (PermissionLevel > targetPermissionLevel){
                    recallGroupMsg(args.param[0]);
                    recallGroupMsg(args.param[1]);
                
            }
            else{
                commandlogperm(args.command,args.groupid,args.caller);
            }
        }
        else{
            console.log("Invalid Message ID");
        }
        
    }
    else if (args.command === "/atall") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
    }
    else if (args.command === "/settitle") {
        if (PermissionLevel < 1){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0])){
            setGroupSpecialTitle(args.groupid,args.param[0],args.param[1]);
            return true;
        }
        else{
            console.log("Invalid UID");
            return false
        }
    }
    else if (args.command === "/op") {
        if (PermissionLevel < 2){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0])){
            addOP(args.groupid,args.param[0]);
            return true;
        }
        else{
            console.log("Invalid UID");
            return false
        }
    }
    else if (args.command === "/deop") {
        if (PermissionLevel < 2){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0])){
            removeOP(args.groupid,args.param[0]);
            return true;
        }
        else{
            console.log("Invalid UID");
            return false
        }
    }
    else if (args.command === "/setadmin") {
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0])){
            if (isAdmin(args.groupid,args.param[0])){
                console.log(`User ${args.param[0]} is already admin`);
                return false;
            }
            else{
                setGroupAdmin(args.groupid,args.param[0]);
                console.log(`Set ${args.param[0]} Group Admin`);
                return true;
            }
        }
        else{
            console.log("Invalid UID");
            return false
        }
    }
    else if (args.command === "/deadmin"){
        if (PermissionLevel < 3){
            commandlogperm(args.command,args.groupid,args.caller);
            return false;
        }
        commandlog(args.command,args.groupid,args.caller,args.param);
        if (!Number.isNaN(parseInt(args.param[0])) && checkUid(args.groupid,args.param[0])){
            if (!isAdmin(args.groupid,args.param[0])){
                console.log(`User ${args.param[0]} is not admin`);
                return false;
            }
            else{
                discardGroupAdmin(args.groupid,args.param[0]);
                console.log(`Discard ${args.param[0]} Group Admin`);
                return true;
            }
        }
        else{
            console.log("Invalid UID");
            return false
        }
    }
    else{
        console.log("Unknown command");
        return false;
    }
}

export default {
    executeCommand
}