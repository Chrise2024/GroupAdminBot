# GroupAdminBot

A cold QQ bot that provide some group admin functions and add non-admin "group admin",Group OP.

## Note
This is bot's ts version. Js version will be deprecated.

## Environment

- Node.js (>= 20)
- A running OneBot implementation which supports `set_group_special_title` (e.g. Lagrange.OneBot, OpenShamrock)
- the bot should be running on group owner's account or admin's account

## Usage

### Scopes

Only available in groups specified in the `config.json` file.

### Commands

#### Permission Level 0:
- `/titleself [Title]` - Set self's group title. The title should be no longer than 18 bytes. One Chinese character in UTF-8 occupies 3 bytes, so a title in Chinese should be no longer than 6 Chinese characters.
- `/help`      - View the usage of this bot.
- `/help [command]`      - View the usage of certain commands(command name without '/').
- `/listop`    - View the list of group admin
#### Permission Level 1:
- `/ban [QID|at] [duration]`- ban.The druration's unit is second.0 duration means unban.
- `/kick [QID|at]`      - Kick out group.
- `/settitle [QID|at] [Title]`  - Set member's group title.
- `/recall`    - Recall message.You need to reply to the message you want to recall with the command and delete the at together with reply.
#### Permission Level 2:
- `/op`        - Set group op.
- `/deop`      - Cancle group op.
#### Permission Level 3:
- `/setadmin`  - Set group admin.
- `/deadmin`   - Cancel group admin.
- `/enable`    - Enable function
- `/disable`   - Disable function

#### Permission Level Reference
- 3: Commanders in `config.json`
- 2: Group Owner & Admin
- 1: Group OP
- 0: Group Member
High permission level can execute low or equal permission level commands.Such as group op can execute `ban`,`recall` and `help` command.

## Deployment

Clone this repository and run `npm i` to install dependencies.

Next execute `npm run build` to build the bot.

Then execute `npm run start` to start the bot.

`config.json` contains bot's config.The file is like:

```json
{
    "httpUrl": "",
    "wsUrl": "",
    "groupIds":[],
    "Commanders":[],
    "commands":[],
    "disabledCmd":[]
}
```
- `httpUrl`:the http server url of of your OneBot service.
- `wsUrl`:The (Forward) WebSocket URL of your OneBot service.
- `groupIds`:`string array`, the list of group id that this bot will work on.
- `Commanders`:`string array`, is the list of commanders' qq id.
- `commands` : `string array`, is the list of commands that is avaliable.
- `disabledCmd` : `string array`, is the list of commands that is disabled.

`OPList.json` contains the list of group op.The file is like:
```json
{
    "[groupid]": ["[qqid1]", "[qqid2]"]
}
```
