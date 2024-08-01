export function commandlog(command:string,group:string,caller:string) {
    console.log(`[${new Date().toLocaleString()}]Command ${command} called in group ${group},caller:<${caller}>`);
}

export function commandlogperm(command:string,group:string,caller:string){
    console.log(`[${new Date().toLocaleString()}]Not enough permission,Command: ${command} ,group: ${group} ,caller:<${caller}>`);
}

export default {
    commandlog,
    commandlogperm
}