import axios, { AxiosResponse } from 'axios';
import {getConfig} from './config.js';

const httpUrl = getConfig().httpUrl

export async function sendPlainMsg(groupId:string,text:string) {
    try{
        let msgData = {
            'group_id': groupId,
            "message":[
                {
                    "type" : "text",
                    "data" : {
                        "text": text
                    }
                }
            ]
        };
        axios.post(httpUrl + '/send_group_msg', msgData);
        return;
    }
    catch(err){
        console.log(err);
    }
}

export async function setGroupBan(groupId:string,userId:string,duration:number){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'duration' :duration
        };
        axios.post(httpUrl + '/set_group_ban', msgData);
    }
    catch(err){
        console.log(err);
    }
}

export function getAdminList(groupId:string){
    try{
    }
    catch(err){
        console.log(err);
        return [];
    }
    
}

export async function setGroupKick(groupId:string,userId:string,reject = false){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'reject_add_request' :reject
        };
        axios.post(httpUrl + '/set_group_kick',msgData);
    }
    catch(err){
        console.log(err);
    }
}

export async function recallGroupMsg(msgId:string,groupId:string = "",userId:string = ""){
    try{
        let msgData = {
            'message_id': msgId
        };
        axios.post(httpUrl + '/delete_msg',msgData);
    }
    catch(err){
        console.log(err);
    }
}

export async function getMsg(msgId:string){
    try{
        let msgData = {
            'message_id': msgId
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/get_msg',
            method: 'POST',
            json:true,
            data: msgData
        };
        const res = (await axios.post(httpUrl + '/get_msg',msgData)).data;
        return res || {'data' :{'message_id': null}};
    }
    catch(err){
        console.log(err);
        return {'data' :{'message_id': null}};
    }
}

export async function setGroupSpecialTitle(groupId:string,userId:string,title:string){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'special_title' :title
        };
        await axios.post(httpUrl + '/set_group_special_title',msgData);
    }
    catch (err){
        console.log(err);
    }
}

export async function setGroupAdmin(groupId:string,userId:string){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'enable'  :true
        };
        axios.post(httpUrl + '/set_group_admin',msgData);
    }
    catch (err){
        console.log(err);
    }
}

export async function discardGroupAdmin(groupId:string,userId:string){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'enable'  :false
        };
        axios.post(httpUrl + '/set_group_admin',msgData);
    }
    catch (err){
        console.log(err);
    }
}

export async function getGroupMember(groupId:string,userId:string){
    try{
        let msgData = {
            'group_id' : groupId,
            'user_id'  : userId,
            'no_cache' : false
        };
        let res = (await axios.post(httpUrl + '/get_group_member_info',msgData)).data;
        return res || {"status" :'failed'};
    }
    catch(err){
        console.log(err);
        return {"status" :'failed'};
    }
}

export async function restart(){
    try{
        let msgData = {
            'delay':2000
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/set_restart',
            method: 'POST',
            json:true,
            body: msgData
        };
        axios.post(httpUrl + '/set_restart',msgData);
    }
    catch (err){
        console.log(err);
    }
}

export default{
    sendPlainMsg,
    setGroupBan,
    getAdminList,
    setGroupKick,
    recallGroupMsg,
    getMsg,
    setGroupSpecialTitle,
    setGroupAdmin,
    getGroupMember,
    restart
}