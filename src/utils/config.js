import fs from 'fs';
import path from 'path';

const rootPath = path.resolve('./');
const cfgPath = path.join(rootPath, 'config.json');

const cfgSchema = {
    "httpUrl": "",
    "wsUrl": "",
    "groupIds":[],
    "Commanders":[]
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

export default {
    getConfig,
    initConfig
}