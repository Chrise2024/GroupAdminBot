export function commandlog(command,group,caller,param) {
    console.log(`Command ${command} called in group ${group},[caller:${caller},param:${param}]`);
}

export function commandlogperm(command,group,caller){
    console.log(`Not enough permission[Command: ${command} ,group: ${group} ,caller:${caller}]`);
}

export default {
    commandlog,
    commandlogperm
}