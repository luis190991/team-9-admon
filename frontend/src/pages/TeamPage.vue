<template>
  <div v-if="team" class="team-page">
    <RouterLink to="/" class="back-link">← Volver a todos los equipos</RouterLink>

    <div class="team-header">
      <div class="team-flag-wrap">
        <img :src="team.flagUrl" :alt="team.name" class="team-flag" @error="onFlagError" />
        <span v-if="team.isHost" class="host-tag">Sede</span>
      </div>
      <div class="team-title">
        <h1>{{ team.name }}</h1>
        <div class="team-badges">
          <span class="badge confederation">{{ team.confederation }}</span>
          <span class="badge group">Grupo {{ team.group }}</span>
          <span class="badge strength">Fortaleza: {{ team.strength }}/100</span>
        </div>
      </div>
    </div>

    <section class="matches-section">
      <h2>Partidos en fase de grupos</h2>

      <div v-if="loadingMatches" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando partidos...</p>
      </div>

      <div v-else-if="matches.length === 0" class="empty-state">
        No se encontraron partidos para este equipo.
      </div>

      <div v-else class="matches-list">
        <div v-for="match in sortedMatches" :key="match.id" class="match-card">
          <div class="match-round">Jornada {{ match.round }} · Grupo {{ match.group }}</div>

          <div class="match-teams">
            <div class="match-team" :class="{ highlight: match.homeTeamId === team.id }">
              <img
                :src="getTeamFlag(match.homeTeamId)"
                :alt="getTeamName(match.homeTeamId)"
                class="match-flag"
                @error="onFlagError"
              />
              <span class="match-team-name">{{ getTeamName(match.homeTeamId) }}</span>
            </div>
            <div class="match-vs">VS</div>
            <div class="match-team away" :class="{ highlight: match.awayTeamId === team.id }">
              <span class="match-team-name">{{ getTeamName(match.awayTeamId) }}</span>
              <img
                :src="getTeamFlag(match.awayTeamId)"
                :alt="getTeamName(match.awayTeamId)"
                class="match-flag"
                @error="onFlagError"
              />
            </div>
          </div>

          <div class="match-meta">
            <span class="match-date">📅 {{ formatDate(match.date) }}</span>
            <span class="match-venue">📍 {{ match.venue }}</span>
          </div>

          <div class="prediction-section">
            <div v-if="loadingPred[match.id]" class="pred-loading">
              <div class="spinner small"></div>
              <span>Calculando predicción...</span>
            </div>

            <div v-else-if="predictions[match.id]" class="prediction-result">
              <div class="pred-header">
                <span class="ai-label">🤖 Predicción IA</span>
                <span class="model-tag">{{ predictions[match.id].modelVersion }}</span>
              </div>

              <div class="pred-outcome">
                <span class="pred-badge" :class="getPredClass(predictions[match.id].prediction)">
                  {{ getPredLabel(predictions[match.id], match) }}
                </span>
                <span class="confidence">
                  Confianza:
                  <strong>{{ predictions[match.id].confidence }}%</strong>
                </span>
              </div>

              <div class="probabilities">
                <div class="prob-row">
                  <span class="prob-label">{{ getTeamName(match.homeTeamId) }}</span>
                  <div class="prob-bar-bg">
                    <div
                      class="prob-bar home"
                      :style="{ width: predictions[match.id].homeWinProbability + '%' }"
                    ></div>
                  </div>
                  <span class="prob-pct">{{ predictions[match.id].homeWinProbability }}%</span>
                </div>
                <div class="prob-row">
                  <span class="prob-label">Empate</span>
                  <div class="prob-bar-bg">
                    <div
                      class="prob-bar draw"
                      :style="{ width: predictions[match.id].drawProbability + '%' }"
                    ></div>
                  </div>
                  <span class="prob-pct">{{ predictions[match.id].drawProbability }}%</span>
                </div>
                <div class="prob-row">
                  <span class="prob-label">{{ getTeamName(match.awayTeamId) }}</span>
                  <div class="prob-bar-bg">
                    <div
                      class="prob-bar away"
                      :style="{ width: predictions[match.id].awayWinProbability + '%' }"
                    ></div>
                  </div>
                  <span class="prob-pct">{{ predictions[match.id].awayWinProbability }}%</span>
                </div>
              </div>

              <div class="factors">
                <span class="factors-label">Factores analizados:</span>
                <div class="factors-list">
                  <span v-for="f in predictions[match.id].factors" :key="f" class="factor-chip">
                    {{ f }}
                  </span>
                </div>
              </div>
            </div>

            <button v-else class="pred-btn" @click="loadPrediction(match)">
              🤖 Obtener predicción de IA
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="notFound" class="not-found">
    <span>⚠️</span>
    <p>Equipo no encontrado.</p>
    <RouterLink to="/" class="back-link">Volver al inicio</RouterLink>
  </div>

  <div v-else class="loading-state full">
    <div class="spinner"></div>
    <p>Cargando equipo...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTeam, getMatchesByTeam, getTeams, getPrediction } from '../services/api'

const route = useRoute()
const team = ref(null)
const notFound = ref(false)
const matches = ref([])
const allTeams = ref([])
const loadingMatches = ref(true)
const predictions = ref({})
const loadingPred = ref({})

const sortedMatches = computed(() =>
  [...matches.value].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const getTeamData = (id) => allTeams.value.find(t => t.id === id)
const getTeamName = (id) => getTeamData(id)?.name || id
const getTeamFlag = (id) => getTeamData(id)?.flagUrl || ''

const onFlagError = (e) => { e.target.style.visibility = 'hidden' }

const formatDate = (str) => {
  return new Date(str).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const getPredLabel = (pred, match) => {
  if (pred.prediction === 'home_win') return `Gana ${getTeamName(match.homeTeamId)}`
  if (pred.prediction === 'away_win') return `Gana ${getTeamName(match.awayTeamId)}`
  return 'Empate'
}

const getPredClass = (pred) => ({
  'home_win': 'win',
  'away_win': 'win',
  'draw': 'draw',
}[pred] || '')

const loadPrediction = async (match) => {
  loadingPred.value[match.id] = true
  try {
    const { data } = await getPrediction(match.homeTeamId, match.awayTeamId)
    predictions.value[match.id] = data
  } catch (err) {
    console.error('Error obteniendo predicción:', err)
  } finally {
    loadingPred.value[match.id] = false
  }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const [teamRes, matchesRes, teamsRes] = await Promise.all([
      getTeam(id),
      getMatchesByTeam(id),
      getTeams(),
    ])
    team.value = teamRes.data
    matches.value = matchesRes.data
    allTeams.value = teamsRes.data

    matchesRes.data.forEach(m => loadPrediction(m))
  } catch (err) {
    if (err.response?.status === 404) notFound.value = true
    console.error('Error cargando datos del equipo:', err)
  } finally {
    loadingMatches.value = false
  }
})
</script>

<style scoped>
.team-page {
  padding-bottom: 40px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 28px;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--gold);
}

.team-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 40px;
  padding: 28px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.team-flag-wrap {
  position: relative;
  flex-shrink: 0;
}

.team-flag {
  width: 140px;
  height: 95px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.host-tag {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gold);
  color: #0a1628;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 10px;
  text-transform: uppercase;
  white-space: nowrap;
}

.team-title h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 14px;
}

.team-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge.confederation {
  background: rgba(201, 162, 39, 0.15);
  color: var(--gold);
  border: 1px solid rgba(201, 162, 39, 0.3);
}

.badge.group {
  background: var(--navy-light);
  color: var(--text);
}

.badge.strength {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.matches-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text);
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.match-card {
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color 0.2s;
}

.match-card:hover {
  border-color: rgba(201, 162, 39, 0.3);
}

.match-round {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
  font-weight: 600;
}

.match-teams {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.match-team {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.match-team.away {
  justify-content: flex-end;
}

.match-team.highlight .match-team-name {
  color: var(--gold);
  font-weight: 700;
}

.match-flag {
  width: 36px;
  height: 24px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}

.match-team-name {
  font-size: 0.95rem;
  font-weight: 600;
}

.match-vs {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  padding: 6px 14px;
  background: var(--navy-light);
  border-radius: 6px;
  white-space: nowrap;
}

.match-meta {
  display: flex;
  gap: 20px;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.prediction-section {
  border-top: 1px solid var(--border);
  padding-top: 18px;
}

.pred-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.pred-btn {
  width: 100%;
  padding: 10px;
  background: rgba(201, 162, 39, 0.1);
  border: 1px dashed rgba(201, 162, 39, 0.4);
  border-radius: 8px;
  color: var(--gold);
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.pred-btn:hover {
  background: rgba(201, 162, 39, 0.2);
  border-style: solid;
}

.pred-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ai-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
}

.model-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--navy-light);
  padding: 2px 8px;
  border-radius: 10px;
}

.pred-outcome {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.pred-badge {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.pred-badge.win {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.pred-badge.draw {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.confidence {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.confidence strong {
  color: var(--text);
}

.probabilities {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.prob-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prob-label {
  width: 130px;
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.prob-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--navy-light);
  border-radius: 4px;
  overflow: hidden;
}

.prob-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.prob-bar.home { background: linear-gradient(90deg, #22c55e, #16a34a); }
.prob-bar.draw { background: linear-gradient(90deg, #eab308, #ca8a04); }
.prob-bar.away { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }

.prob-pct {
  width: 36px;
  font-size: 0.78rem;
  color: var(--text);
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}

.factors {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.factors-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.factors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.factor-chip {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--navy-light);
  padding: 2px 8px;
  border-radius: 10px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
  color: var(--text-muted);
}

.loading-state.full {
  padding: 80px 0;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--navy-light);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.small {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.not-found {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .team-header {
    flex-direction: column;
    text-align: center;
  }

  .team-badges {
    justify-content: center;
  }

  .match-team-name {
    font-size: 0.8rem;
  }

  .prob-label {
    width: 90px;
  }
}
</style>
