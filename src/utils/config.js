import fs from 'fs';
import path from 'path';

const rootPath = path.resolve('./');
const cfgPath = path.join(rootPath, 'config.json');

const cfgSchema = {
    "httpUrl": "",
    "wsUrl": "",
    "groupIds":[],
    "Commanders":[],
    "commands" :[
        "/help",
        "/titleself",
        "/ban",
        "/kick",
        "/recall",
        "/settitle",
        "/op",
        "/deop",
        "/setadmin",
        "/deadmin",
        "/enable",
        "/disable"
    ],
    "disabledCmd":[]
}

export function initConfig(){
    if(!fs.existsSync(cfgPath)){
        fs.writeFileSync(cfgPath, JSON.stringify(cfgSchema));
    }
}

export function getConfig(){
   let cfgJSON = JSON.parse(fs.readFileSync(cfgPath).toString());
   //cfgJSON.groupIds.map( id => id.toString());
   return cfgJSON;
}

export async function setConfig(cfgJSON,entry,content){
    if (cfgJSON[entry]){
        cfgJSON[entry] = content;
        fs.writeFileSync(cfgPath, JSON.stringify(cfgJSON));
    }
    else{
        console.log(`Unknown Entry`);
    }
}

export default {
    getConfig,
    initConfig
}