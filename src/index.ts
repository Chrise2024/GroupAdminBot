import WebSocket from 'ws';
import { initOPList } from './utils/op.js';
import { initConfig,getConfig } from './utils/config.js';
import { msgBodySchema,msgSegmentSchema,configSchema, argSchema } from './utils/dataSchema.js';

initConfig();
console.log('Config loaded');
const Config:configSchema = getConfig();
initOPList(Config.groupIds);
const ws = new WebSocket(Config.wsUrl);

import { parseArgs } from './command/arg.js';
import { executeCommand } from './command/index.js';
import { msgFilter } from './utils/messagefilter.js';

ws.on('open', () => {
    console.log('Connected to WebSocket server,Url: ' + Config.wsUrl);
});

ws.on('error', (error) => {
    console.log(error);
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

ws.on('message',async (data) => {
    try{
        const body:msgBodySchema = JSON.parse(data.toString());
        if (
            body.post_type === 'message' &&
            body.message_type === 'group' &&
            Config.groupIds.indexOf((body.group_id).toString()) !== -1
        ){
            //msgFilter(body);
            msgHandler(body);
        }
    }
    catch(err){
        console.log(err);
    }
    
});

async function msgHandler(body:msgBodySchema){
    try{
        const messgaeSegments:Array<msgSegmentSchema> = body.message;
        if (
            (messgaeSegments[0].type === 'text' &&
            messgaeSegments[0].data.text &&
            messgaeSegments[0].data.text.startsWith(Config.commandPrefix)) || 
            (messgaeSegments[0].type === 'reply' &&
            messgaeSegments[3].type === 'text' &&
            messgaeSegments[3].data.text &&
            messgaeSegments[3].data.text.startsWith(Config.commandPrefix))
            ){
            if (messgaeSegments.length <= 4){
                const Args:argSchema = await parseArgs(Config.commandPrefix,body);
                if (Args.status){
                    await executeCommand(Args);
                }
            }
        }
    }
    catch(err){
        console.log(err);
    }
}