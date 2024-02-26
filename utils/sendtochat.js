require('dotenv').config();
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../models/UserDb');

// Configurações do cliente e MongoDB
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const channelId = process.env.CHANNEL;
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Error connecting to MongoDB', err));

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function dropCollection() {
    try {
        await mongoose.connection.db.dropCollection('users');
        console.log('Coleção "users" foi dropada com sucesso.');
    } catch (error) {
        console.error('Erro ao dropar a coleção "users":', error);
    }
}

async function sendUserEmbed(user) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const now = new Date();
    const dateString = now.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const embed = new MessageEmbed()
        .setAuthor({ name: user.usuario, iconURL: user.avatar })
        .setThumbnail(user.avatar)
        .addFields(
            { name: 'User', value: `@${user.usuario}\n\`${user.id_usuario}\``, inline: true },
            { name: 'Badges', value: user.badges.join(' '), inline: true },
            { name: 'Servidor', value: `${user.serv}\n\`${user.id_serv}\`` },
            { name: 'Nitro', value: `${user.boost}\n\`${user.premiumSince}\`` }
        )
        .setColor(`#${randomColor}`)
        .setFooter({ text: `Data de envio: ${dateString} às ${timeString}` });

    const button = new MessageButton()
        .setStyle('LINK')
        .setURL(`https://discord.com/users/${user.id_usuario}`)
        .setLabel('Ver Perfil');

    const channel = await client.channels.fetch(channelId).catch(console.error);
    if (channel) {
        await channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(button)] })
            .catch(error => console.error("Erro ao enviar embed:", error));
        console.log(`Mensagem enviada para o usuário: ${user.usuario}`);
    } else {
        console.error('Canal não encontrado.');
    }
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        const users = await User.find();
        for (const user of users) {
            await sendUserEmbed(user);
            await sleep(2000); 
        }
        await dropCollection();
    } catch (error) {
        console.error('Error retrieving users from DB:', error);
    }
});

client.login(process.env.TOKENBOT);
