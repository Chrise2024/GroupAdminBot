import { getOPList } from "./op.js";
import { getAdminList,getGroupMember } from "./netapi.js";
import { getConfig } from "./config.js";

function isPrivileged(groupId,userId){
    return isOP(groupId,userId) || isAdmin(groupId,userId) || isCommander(userId);
}

function isOP(groupId,userId){
    const opList = getOPList(groupId) || [];
    if (opList.length === 0) return false;
    return opList.includes(userId);
}

export function isAdmin(groupId,userId){
    const adminList = getAdminList(groupId) || [];
    if (adminList.length === 0) return false;
    return adminList.includes(userId);
}

function isCommander(userId){
    const CommanderList = getConfig().Commanders || [];
    if (CommanderList.length === 0) return false;
    return CommanderList.includes(userId);
}

export function getPermissionLevel(groupId,userId){
    if (isCommander(userId)) return 3;
    if (isAdmin(groupId,userId)) return 2;
    if (isOP(groupId,userId)) return 1;
    return 0;
}

export function checkUid(groupId,userId){
    const memberInfo = getGroupMember(groupId,userId);
    if (memberInfo.status === 'failed') return false;
    return true;
}

export default{
    isAdmin,
    getPermissionLevel,
    checkUid
}