import fs from 'fs';
import path from 'path';

const rootPath = path.resolve('./');
const cfgPath = path.join(rootPath, 'OPList.json');

export function initOPList(groupIds){
    //console.log(groupIds);
    if (!fs.existsSync(cfgPath)) {
        const initJSON = {}
        for (let i in groupIds) {
            initJSON[groupIds[i]]=[];
        }
        fs.writeFileSync(cfgPath, JSON.stringify(initJSON));
    }
    else{
        const cfgJSON = JSON.parse(fs.readFileSync(cfgPath).toString());
        for (let i in groupIds){
            if (!cfgJSON[groupIds[i]]){
                cfgJSON[groupIds[i]] = [];
            }
        }
        fs.writeFileSync(cfgPath, JSON.stringify(cfgJSON));
    }
}

export function getOPList(groupId) {
    const cfgJSON = JSON.parse(fs.readFileSync(cfgPath).toString());
    return cfgJSON[groupId];
}

export function addOP(groupId,user){
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

export function removeOP(groupId,user){
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