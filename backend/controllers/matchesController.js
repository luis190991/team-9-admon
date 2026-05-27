const matches = require('../data/matches.json');

exports.getAllMatches = (_req, res) => {
  res.json(matches);
};

exports.getMatchesByTeam = (req, res) => {
  const teamMatches = matches.filter(
    m => m.homeTeamId === req.params.teamId || m.awayTeamId === req.params.teamId
  );
  res.json(teamMatches);
};
