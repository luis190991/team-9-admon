const express = require('express');
const cors = require('cors');
const config = require('./config');
const healthRoutes = require('./routes/health');
const teamsRoutes = require('./routes/teams');
const matchesRoutes = require('./routes/matches');
const predictionsRoutes = require('./routes/predictions');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/predict', predictionsRoutes);

app.listen(config.port, () => {
  console.log(`PrediGoal AI backend corriendo en puerto ${config.port}`);
});

module.exports = app;
