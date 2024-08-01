import fs from 'fs';
import path from 'path';

const rootPath = path.resolve('./');
const cfgPath = path.join(rootPath, 'OPList.json');

export function initOPList(groupIds:Array<string>){
    if (!fs.existsSync(cfgPath)) {
        const initMap:Map<string,Array<string>> = new Map();
        for (let i in groupIds) {
            initMap.set(groupIds[i], []);
        }
        fs.writeFileSync(cfgPath, JSON.stringify(Object.fromEntries(initMap.entries())));
    }
    else{
        const cfgMap:Map<string,Array<string>> = new Map(Object.entries(JSON.parse(fs.readFileSync(cfgPath).toString())));
        for (let i in groupIds){
            if (!cfgMap.has(groupIds[i])){
                cfgMap.set(groupIds[i], []);
            }
        }
        fs.writeFileSync(cfgPath, JSON.stringify(Object.fromEntries(cfgMap.entries())));
    }
}

export function getOPList(groupId:string) {
    const cfgJSON = JSON.parse(fs.readFileSync(cfgPath).toString());
    if (!cfgJSON[groupId]){return [];}
    return cfgJSON[groupId];
}

export function addOP(groupId:string,user:string){
    let cfgJSON = JSON.parse(fs.readFileSync(cfgPath).toString());
    if (!cfgJSON[groupId]){
        console.log(`Group ${groupId} is undefined`);
        return false;
    }
    else{
        let OPList = getOPList(groupId);
        if(OPList.indexOf(user) === -1){
            OPList.push(user);
            cfgJSON[groupId] = OPList;
            fs.writeFileSync(cfgPath, JSON.stringify(cfgJSON));
            console.log(`Added ${user} to OP list`);
            return true;
        }
        else{
            console.log(`${user} is already in OP list`);
            return false;
        }
    }
}

export function removeOP(groupId:string,user:string){
    let cfgJSON = JSON.parse(fs.readFileSync(cfgPath).toString());
    if (!cfgJSON[groupId]){
        console.log(`Group ${groupId} is undefined`);
        return false;
    }
    else{
        let OPList = cfgJSON[groupId];
        if(OPList.indexOf(user) !== -1){
            OPList.splice(OPList.indexOf(user), 1);
            cfgJSON[groupId] = OPList;
            fs.writeFileSync(cfgPath, JSON.stringify(cfgJSON));
            console.log(`Removed ${user} from OP list`);
            return true;
        }
        else{
            console.log(`${user} is not in OP list`);
            return false;
        }
    }
}

export default{
    initOPList,
    getOPList,
    addOP,
    removeOP
}