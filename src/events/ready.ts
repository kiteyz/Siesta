import Client from '../client'

export default class {

    client: Client

  constructor(client: Client) {
    this.client = client;
  }

  async run() {

    var tabela = [
      { name: `🎶 Vem ouvir uma música comigo ^^`, type: "STREAMING" },
      { name: `🫂 ${this.client.users.cache.size} usuários`, type: "WATCHING" },
      { name: `😈 ${this.client.guilds.cache.size} servidores`, type: "LISTENING" },
      { name: `🧚‍♀️ Venha se divertir comigo`, type: "PLAYING" },
    ];

    var tabela2 = [
      { local: `./src/assets/images/avatar/1.jpg` },
      { local: `./src/assets/images/avatar/2.jpg` },
      { local: `./src/assets/images/avatar/3.jpg` },
      { local: `./src/assets/images/avatar/4.jpg` },
      { local: `./src/assets/images/avatar/5.jpg` },
      { local: `./src/assets/images/avatar/6.jpg` }
    ]
    setInterval(() => {
      var randomStatus = tabela[Math.floor(Math.random() * tabela.length)];
      this.client.user!.setActivity(randomStatus.name);
    }, 10 * 1000);

    setInterval(() => {
      var randomAvatar = tabela2[Math.floor(Math.random() * tabela2.length)]

      this.client.user!.setAvatar(randomAvatar.local)
    }, 300 * 1000)

    this.client.user!.setStatus("idle");

    console.log(this.client.color.blue(`[Shiota] - Iniciada com sucesso.`))

    this.client.music.init(this.client.user!.id)
  }
};