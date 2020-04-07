const channelUtils = require('../utils/channelutils')
const {prefix} = require('../config.json');
module.exports = {
    name: 'help',
    description: 'Skriver alle gyldige kommandoer',
    aliases: ['commands'],
    usage: '[kommando]',
    execute(message, args) {
        const data = [];
        const {commands} = message.client;

        if (!args.length) {
            data.push("FORMBOT v.1.0");
            data.push("Kommandoer:");
            data.push(commands.filter(cmd => !cmd.hidden).map(command => command.name).join(', '));
            data.push("\nSkriv " + prefix + "help [kommando] for at få information om en specifik kommando!");
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply("Jeg har sendt dig en DM med alle kommandoer");
                })
                .catch(error => {
                    console.error("Kunne ikke sende DM til " + message.author.tag + '\n', error)
                    message.reply("Jeg kan ikke sende dig en DM - Har du dem deaktiveret?");
                });
        }
        const name = args[0].toLowerCase();

        //Matches command if not hidden
        const command = commands.filter(cmd => !cmd.hidden).get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply("Det er ikke en gyldig kommando!");
        }

        data.push("**Navn:** " + command.name + "\n");

        if (command.aliases) data.push("**Aliasser:** " +  command.aliases.join(", ") +  "\n");
        if (command.usage) data.push("**Brug:** " + prefix + command.name + command.usage + "\n");
        if (command.description) data.push("**Beskrivelse:** " + command.description + "\n");
        channelUtils.sendMessage(message.channel, data.join(""));
    }
};
