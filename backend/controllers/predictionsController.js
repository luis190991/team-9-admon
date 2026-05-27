const teams = require('../data/teams.json');

const getStrength = (id) => {
  const team = teams.find(t => t.id === id);
  return team ? team.strength : 50;
};

exports.predict = (req, res) => {
  const { home, away } = req.query;

  if (!home || !away) {
    return res.status(400).json({ error: 'Se requieren los parámetros home y away' });
  }

  const homeTeam = teams.find(t => t.id === home);
  const awayTeam = teams.find(t => t.id === away);

  if (!homeTeam || !awayTeam) {
    return res.status(404).json({ error: 'Equipo no encontrado' });
  }

  const homeStr = getStrength(home) + 5; // ventaja de local
  const awayStr = getStrength(away);
  const drawWeight = 18;
  const total = homeStr + awayStr + drawWeight;

  let homeWin = Math.round((homeStr / total) * 100);
  let awayWin = Math.round((awayStr / total) * 100);
  let draw = 100 - homeWin - awayWin;

  // Ajuste menor aleatorio para simular incertidumbre del modelo
  const noise = () => Math.floor(Math.random() * 5) - 2;
  homeWin = Math.max(5, Math.min(85, homeWin + noise()));
  awayWin = Math.max(5, Math.min(85, awayWin + noise()));
  draw = Math.max(5, 100 - homeWin - awayWin);

  let prediction, confidence;
  if (homeWin >= awayWin && homeWin >= draw) {
    prediction = 'home_win';
    confidence = homeWin;
  } else if (awayWin > homeWin && awayWin >= draw) {
    prediction = 'away_win';
    confidence = awayWin;
  } else {
    prediction = 'draw';
    confidence = draw;
  }

  confidence = Math.min(92, Math.max(38, confidence));

  res.json({
    homeTeamId: home,
    awayTeamId: away,
    homeTeam: homeTeam.name,
    awayTeam: awayTeam.name,
    homeWinProbability: homeWin,
    drawProbability: draw,
    awayWinProbability: awayWin,
    prediction,
    confidence,
    modelVersion: 'mock-v1.0',
    factors: [
      'Resultados históricos entre selecciones',
      'Forma reciente (últimos 5 partidos)',
      'Ventaja de local',
      'Diferencia en ranking FIFA',
    ],
  });
};
