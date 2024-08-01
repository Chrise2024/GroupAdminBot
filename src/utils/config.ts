import fs from 'fs';
import path from 'path';
import { configSchema,defaultConfig } from './dataSchema.js';

const rootPath = path.resolve('./');
const configPath = path.join(rootPath, 'config.json');

export function initConfig(){
    if(!fs.existsSync(configPath)){
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
    }
    else{
        try{
            let curConfig:configSchema = JSON.parse(fs.readFileSync(configPath).toString());
        }
        catch(err){
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
        }
    }
}

export function getConfig():configSchema{
   let config:configSchema = JSON.parse(fs.readFileSync(configPath).toString());
   return config;
}

export async function setConfig(config:configSchema,entry:string,content:any){
    let configMap:Map<string,any> = new Map(Object.entries(config));
    if (configMap.has(entry)){
        configMap.set(entry,content);
        fs.writeFileSync(configPath, JSON.stringify(Object.fromEntries(configMap.entries())));
    }
    else{
        console.log(`Unknown Entry`);
    }
}

export default {
    getConfig,
    initConfig
}