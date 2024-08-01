import { getOPList } from "./op.js";
import { getAdminList,getGroupMember } from "./netapi.js";
import { getConfig } from "./config.js";

function isPrivileged(groupId:string,userId:string){
    return isOP(groupId,userId) || isAdmin(groupId,userId) || isCommander(userId);
}

function isOP(groupId:string,userId:string){
    const opList = getOPList(groupId) || [];
    if (opList.length === 0) return false;
    return opList.includes(userId);
}

export async function isAdmin(groupId:string,userId:string){
    const menber = await getGroupMember(groupId,userId);
    if (menber.role == 'member') return false;
    return true;
}

function isCommander(userId:string){
    const CommanderList = getConfig().Commanders || [];
    if (CommanderList.length === 0) return false;
    return CommanderList.includes(userId);
}

export async function getPermissionLevel(groupId:string,userId:string){
    if (isCommander(userId)) return 3;
    if (await isAdmin(groupId,userId)) return 2;
    if (isOP(groupId,userId)) return 1;
    return 0;
}

export async function checkUid(groupId:string,userId:string){
    const memberInfo = await getGroupMember(groupId,userId);
    if (memberInfo.status === 'failed') return false;
    return true;
}

export default{
    isAdmin,
    getPermissionLevel,
    checkUid
}