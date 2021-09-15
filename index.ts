import { config } from 'dotenv'
import { connect } from 'mongoose'
import Main from './src/structures/Client'

config();

const client = new Main({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
    ],
    allowedMentions: { parse: ["users"], repliedUser: true },
});

connect(process.env.MONGO_CONNECT as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(client.color.blue(`[DataBase] - Iniciada com sucesso.`))
}).catch(e => {
  console.error(client.color.red(`[DataBase] - Ocorreu um erro: ${e}`))
})

client.onLoad(client)

client.login(process.env.TOKEN as string)