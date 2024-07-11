import request from 'request';
import sync_request from 'sync-request';
import {getConfig} from './config.js';

const httpUrl = getConfig().httpUrl;

export async function sendPlainMsg(groupId,text) {
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
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/send_group_msg',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data);
            }
        });
        return;
    }
    catch(err){
        console.log(err);
    }
}

export async function setGroupBan(groupId,userId,duration){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'duration' :duration
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/set_group_ban',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data);
            }
        });
        return;
    }
    catch(err){
        console.log(err);
    }
}

export function getAdminList(groupId){
    try{
        const res = sync_request('POST',httpUrl + '/get_group_member_list',{
            json:{
                group_id: groupId,
                no_cache: true,
              }
        });
        const memberList = JSON.parse(res.getBody('utf8'))['data'];
        //console.log(memberList);
        let AdminList = [];
        for (let i in memberList){
            if(memberList[i]['role'] === 'admin' || memberList[i]['role'] === 'owner'){
                AdminList.push(memberList[i]['user_id']);
            }
        }
        return AdminList.map( x => x.toString());
    }
    catch(err){
        console.log(err);
        return [];
    }
    
}

export async function setGroupKick(groupId,userId,reject = false){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'reject_add_request' :reject
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/set_group_kick',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data)
            }
        });
        return;
    }
    catch(err){
        console.log(err);
    }
}

export async function recallGroupMsg(msgId,groupId = null,userId = null){
    try{
        let msgData = {
            'message_id': msgId
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/delete_msg',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data);
            }
        });
    }
    catch(err){
        console.log(err);
    }
}

export function getMsg(msgId){
    try{
        const res = sync_request('POST',httpUrl + '/get_msg',{
            json:{
                'message_id': msgId
            }
        });
        return JSON.parse(res.getBody('utf8')) || {'data' :{'message_id': null}};
    }
    catch(err){
        console.log(err);
        return {'data' :{'message_id': null}};
    }
}

export async function setGroupSpecialTitle(groupId,userId,title){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'special_title' :title
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/set_group_special_title',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data);
            }
        });
    }
    catch (err){
        console.log(err);
    }
}

export async function setGroupAdmin(groupId,userId){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'enable'  :true
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/set_group_admin',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data);
            }
        });
    }
    catch (err){
        console.log(err);
    }
}

export async function discardGroupAdmin(groupId,userId){
    try{
        let msgData = {
            'group_id': groupId,
            'user_id' :userId,
            'enable'  :false
        };
        let options = {
            headers: {"Connection": "close"},
            url: httpUrl + '/set_group_admin',
            method: 'POST',
            json:true,
            body: msgData
        };
        request(options, (error, response, data)=>{
            if (data.status !== 'ok'){
                console.log(data);
            }
        });
    }
    catch (err){
        console.log(err);
    }
}

export function getGroupMember(groupId,userId){
    try{
        const res = sync_request('POST',httpUrl + '/get_group_member_info',{
            json:{
                'group_id' : groupId,
                'user_id'  : userId,
                'no_cache' : false
            }
        });
        return JSON.parse(res.getBody('utf8')) || {"status" :'failed'};
    }
    catch(err){
        console.log(err);
        return {"status" :'failed'};
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
    getGroupMember
}