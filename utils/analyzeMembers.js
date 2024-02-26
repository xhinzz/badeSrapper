const fetch = require('node-fetch');
const UserDb = require('../models/UserDb');
const colors = {
    blue: '\x1b[34m',
    red: '\x1b[31m',
    green: '\x1b[32m',
};

async function analyzeMembers(client, guildId, token) {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
        console.log('O bot não está em nenhum servidor.');
        return;
    }

    const members = await guild.members.fetch();
    const nonBotMembers = members.filter(member => !member.user.bot);
    const totalMembers = nonBotMembers.size;
    let processedMembers = 0;

    for (const member of nonBotMembers) {
        setTimeout(async () => {

            processedMembers++;
            const percentage = (processedMembers / totalMembers) * 100;

            let membro = await client.users.fetch(member[1].user.id);
            let user = membro

            async function fetchUser(id) {
                try {
                const response = await fetch(
                    `https://discord.com/api/v9/users/${membro.id}/profile?with_mutual_guilds=true&with_mutual_friends_count=false&guild_id=${guild.id}`,
                    {
                        headers: {
                            Authorization: process.env.TOKEN
                        }
                    }
                );
                return response;
            } catch (err) {
                console.error(`Error fetching user: ${id}, ${err.message}`);
                // Handle fetch errors or rethrow if you want to handle it in the outer catch
                throw err; // Rethrow if you want to handle this in the outer try/catch
            }
        }
            let check = await fetchUser(user.id);
            if (check.status === 200) {
                let User = await check.json();
            
                const hasEarlySupporter = User.badges.some(badge => badge.id === 'early_supporter');
                const hasBotDeveloper = User.badges.some(badge => badge.id === 'verified_developer');
                const hasHypeSquadEvents = User.badges.some(badge => badge.id === 'hypesquad');
                const hasModerator = User.badges.some(badge => badge.id === 'certified_moderator');
                const hasBugHunter = User.badges.some(badge => badge.id === 'bug_hunter_lvl1');
                const hasBugHunterLvl2 = User.badges.some(badge => badge.id === 'bug_hunter_lvl2');
                const haslevel4 = User.badges.some(badge => badge.id === 'guild_booster_lvl4');
                const haslevel5 = User.badges.some(badge => badge.id === 'guild_booster_lvl5');
                const haslevel6 = User.badges.some(badge => badge.id === 'guild_booster_lvl6');
                const haslevel7 = User.badges.some(badge => badge.id === 'guild_booster_lvl7');
                const haslevel8 = User.badges.some(badge => badge.id === 'guild_booster_lvl8');
                const haslevel9 = User.badges.some(badge => badge.id === 'guild_booster_lvl9');
                const hasnitro = User.badges.some(badge => badge.id === 'premium');

                const badgeChecks = {
                    'early_supporter': hasEarlySupporter,
                    'verified_developer': hasBotDeveloper,
                    'hypesquad': hasHypeSquadEvents,
                    'certified_moderator': hasModerator,
                    'bug_hunter_lvl1': hasBugHunter,
                    'bug_hunter_lvl2': hasBugHunterLvl2,
                    'guild_booster_lvl4': haslevel4,
                    'guild_booster_lvl5': haslevel5,
                    'guild_booster_lvl6': haslevel6,
                    'guild_booster_lvl7': haslevel7,
                    'guild_booster_lvl8': haslevel8,
                    'guild_booster_lvl9': haslevel9,
                };

            if (hasEarlySupporter || hasBotDeveloper || hasHypeSquadEvents || hasModerator || hasBugHunter || hasBugHunterLvl2 ||  hasModerator  ||  haslevel4 || haslevel5 || haslevel6 || haslevel7 || haslevel8 || haslevel9 ) {

                const badgesEmojis = {
                    'early_supporter': '<:pig:1186538598590324816>',
                    'verified_developer': '<:dev:1186538592449876009>',
                    'hypesquad': '<:events:1186538594857406545>',
                    'MODERATOR': '<:dc_mod:1188750994503376926>',
                    'BUGHUNTER_LEVEL_1': '<:bug_hunter_1:1188750996634087445>',
                    'BUGHUNTER_LEVEL_2': '<:bug_hunter_2:1188750993236701224>',
                    'STAFF': 'Team User',
                    'guild_booster_lvl1': '<:boost_level_1:1188902740613681193>',
                    'guild_booster_lvl2': '<:boost_level_2:1188902742991839343>',
                    'guild_booster_lvl3': '<:boost_level_3:1188902738923372585>',
                    'guild_booster_lvl4': '<:boostlvl4:1186538581771178045>',
                    'guild_booster_lvl5': '<:boostlvl5:1186538583436304445>',
                    'guild_booster_lvl6': '<:boostlvl6:1186538585709617163>',
                    'guild_booster_lvl7': '<:boostlvl7:1186538587181826188>',
                    'guild_booster_lvl8': '<:boostlvl8:1186538589669036114>',
                    'guild_booster_lvl9': '<:boostlvl9:1186538591019597875> '
                };
                let badgesString = User.badges && User.badges.length > 0
                ? User.badges
                    .filter(badge => badgeChecks[badge.id]) 
                    .map(badge => badgesEmojis[badge.id] || badge.id)
                    .join(' ')
                : 'Nenhuma badge';            

                let nitroSub = ' '
                if(User.premium_type === 2) {
                    nitroSub = 'Boost'
                } else if(User.premium_type === 1){
                    nitroSub = 'Classic'
                } else {
                    nitroSub = 'No subscription'
                }

                var nistroStringFormat;

                if(!hasnitro) {
                    nistroStringFormat = ' '
                 } else {
                    nistroStringFormat = User.badges.find(badge => badge.id === "premium").description;
                    console.log(nistroStringFormat)
                }

                const newUser = new UserDb({
                    id_usuario: User.user.id,
                    usuario: User.user.username,
                    serv: guild.name,
                    id_serv: guild.id,
                    avatar: user.displayAvatarURL({ dynamic: true, size: 1024 }),
                    badges: badgesString,
                    boost: nitroSub,
                    premiumSince: nistroStringFormat

                  });
            
                  await newUser.save().catch(err => console.error('Error saving user:', err));
                  console.log('Saving user:', newUser);
                console.log(`${colors.green}[!] ${User.user.username} | Badges: ${badgesString} | Progresso: ${percentage.toFixed(2)}%`);

            } else {

                console.log(`${colors.red}[x] ${User.user.username} | Badges: ❌ | Progresso: ${percentage.toFixed(2)}%`);
            }
    } else {
            console.error(`Failed to fetch user: ${user.id}, status code: ${check.status}`);
    }
            if (processedMembers === totalMembers) {

                console.log(`${colors.blue} [!] Análise concluída. Iniciando o envio das embed!`);
                require('./sendtochat.js');
                // await sleep(4000);
                // process.exit(0);
            }

        },processedMembers * 2000); 
        await new Promise(resolve => setTimeout(resolve, 2000))
    }
}

module.exports = { analyzeMembers };
