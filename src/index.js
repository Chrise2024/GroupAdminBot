import WebSocket from 'ws';
import { initOPList } from './utils/op.js';
import { initConfig,getConfig } from './utils/config.js';
import { getPermissionLevel } from './utils/index.js';
import { parseArgs } from './command/arg.js';
import { executeCommand } from './command/index.js';
import { msgFilter } from './utils/messagefilter.js';

initConfig()
const config = getConfig();

initOPList(getConfig().groupIds);
const ws = new WebSocket(config.wsUrl);

ws.on('open', () => {
    console.log('Connected to WebSocket server,port:15002');
});

ws.on('error', (error) => {
    console.log(error);
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

ws.on('message', (data) => {
    const body = JSON.parse(data.toString());
    if (
        body.post_type === 'message' &&
        body.message_type === 'group' &&
        config.groupIds.indexOf((body.group_id).toString()) !== -1
    ){
        msgFilter(body);
        msgHandler(body);
    }
});

async function msgHandler(body){
    if ((body.message[0].type === 'text' && body.message[0].data.text.startsWith('/')) ||
    (body.message[0].type === 'reply' && body.message[3].type === 'text' && body.message[3].data.text.startsWith('/'))
    ){
        const messgaeSegments = body.message;
        if (messgaeSegments.length <= 4){
            const groupId = (body.group_id).toString();
            const userId = (body.user_id).toString();
            const PermissionLevel = getPermissionLevel(groupId,userId);
            const Args = parseArgs(body);
            if (Args.statue){
                executeCommand(Args,PermissionLevel);
            }
        }
    }
}