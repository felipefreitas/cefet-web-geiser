var hbs = require('handlebars');
var fs = require('fs');
var express = require('express'),
    app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var jogadores = JSON.parse(fs.readFileSync('server/data/jogadores.json'));
var jogos = JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'));

var db = {
  'jogadores': jogadores,
  'jogos': jogos
};

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');
app.set('views', './server/views/');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.get('/', function (req, res) {
    res.render('index', db.jogadores);
});


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:numero_identificador/', function (req, res) {
  let id = req.params['numero_identificador'];
  let player = db.jogadores.players.filter(player => player.steamid === id)[0];
  if (player) {
      player.plays = db.jogos[id];
      player.plays.games = player.plays.games.map(game => {
        game.playtime_forever_hour = (game.playtime_forever / 60).toFixed(1);
        return game;
      });
      player.plays.game_unplayed = player.plays.games.filter(game => game.playtime_forever < 1).length;
      player.plays.games = player.plays.games.sort((gamea, gameb) => {
        return (gamea.playtime_forever - gameb.playtime_forever) *-1;
      }).slice(1,6);
      player.favorite = player.plays.games[0];
  }
  res.render('jogador', player);
});

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client'));

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
var port = 3000;
app.listen(port);
