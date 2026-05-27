const teams = require('../data/teams.json');

exports.getAllTeams = (_req, res) => {
  res.json(teams);
};

exports.getTeamById = (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });
  res.json(team);
};
