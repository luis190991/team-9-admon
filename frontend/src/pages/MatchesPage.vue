<template>
  <div class="matches-page">
    <header class="page-header">
      <h1>Calendario de <span class="highlight">Partidos</span></h1>
      <p>72 partidos de la fase de grupos — Mundial FIFA 2026</p>
    </header>

    <div class="filters">
      <select v-model="selectedGroup" class="group-select">
        <option value="">Todos los grupos</option>
        <option v-for="g in groups" :key="g" :value="g">Grupo {{ g }}</option>
      </select>
      <select v-model="selectedRound" class="round-select">
        <option value="">Todas las jornadas</option>
        <option value="1">Jornada 1</option>
        <option value="2">Jornada 2</option>
        <option value="3">Jornada 3</option>
      </select>
      <button v-if="selectedGroup || selectedRound" class="reset-btn" @click="resetFilters">
        Limpiar filtros
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando partidos...</p>
    </div>

    <template v-else>
      <div v-for="(groupMatches, groupName) in groupedMatches" :key="groupName" class="group-block">
        <h2 class="group-title">
          <span class="group-label">Grupo {{ groupName }}</span>
          <span class="match-count">{{ groupMatches.length }} partidos</span>
        </h2>

        <div class="match-list">
          <div
            v-for="match in groupMatches"
            :key="match.id"
            class="match-row"
          >
            <div class="match-round-badge">J{{ match.round }}</div>

            <RouterLink :to="`/team/${match.homeTeamId}`" class="team-side home">
              <span class="team-name">{{ getTeamName(match.homeTeamId) }}</span>
              <img
                :src="getTeamFlag(match.homeTeamId)"
                :alt="getTeamName(match.homeTeamId)"
                class="flag"
                @error="onFlagError"
              />
            </RouterLink>

            <div class="vs-block">
              <span class="vs">VS</span>
              <span class="match-date">{{ formatDate(match.date) }}</span>
            </div>

            <RouterLink :to="`/team/${match.awayTeamId}`" class="team-side away">
              <img
                :src="getTeamFlag(match.awayTeamId)"
                :alt="getTeamName(match.awayTeamId)"
                class="flag"
                @error="onFlagError"
              />
              <span class="team-name">{{ getTeamName(match.awayTeamId) }}</span>
            </RouterLink>

            <div class="venue-col">
              <span class="venue">{{ match.venue }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="Object.keys(groupedMatches).length === 0" class="empty-state">
        <p>No hay partidos con ese filtro.</p>
        <button class="reset-btn" @click="resetFilters">Ver todos</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMatches, getTeams } from '../services/api'

const matches = ref([])
const allTeams = ref([])
const loading = ref(true)
const selectedGroup = ref('')
const selectedRound = ref('')

const groups = computed(() => [...new Set(matches.value.map(m => m.group))].sort())

const getTeamData = (id) => allTeams.value.find(t => t.id === id)
const getTeamName = (id) => getTeamData(id)?.name || id
const getTeamFlag = (id) => getTeamData(id)?.flagUrl || ''

const onFlagError = (e) => { e.target.style.visibility = 'hidden' }

const formatDate = (str) => {
  return new Date(str).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

const filteredMatches = computed(() => {
  return matches.value.filter(m => {
    const matchGroup = !selectedGroup.value || m.group === selectedGroup.value
    const matchRound = !selectedRound.value || String(m.round) === selectedRound.value
    return matchGroup && matchRound
  })
})

const groupedMatches = computed(() => {
  const result = {}
  for (const m of filteredMatches.value) {
    if (!result[m.group]) result[m.group] = []
    result[m.group].push(m)
  }
  for (const g of Object.keys(result)) {
    result[g].sort((a, b) => a.round - b.round || new Date(a.date) - new Date(b.date))
  }
  return result
})

const resetFilters = () => {
  selectedGroup.value = ''
  selectedRound.value = ''
}

onMounted(async () => {
  try {
    const [matchesRes, teamsRes] = await Promise.all([getMatches(), getTeams()])
    matches.value = matchesRes.data
    allTeams.value = teamsRes.data
  } catch (err) {
    console.error('Error cargando partidos:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.matches-page {
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.highlight {
  color: var(--gold);
}

.page-header p {
  color: var(--text-muted);
  font-size: 1rem;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
}

.group-select,
.round-select {
  padding: 10px 14px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.group-select:focus,
.round-select:focus {
  border-color: var(--gold);
}

.group-select option,
.round-select option {
  background: var(--navy-mid);
}

.reset-btn {
  padding: 10px 16px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--gold);
  font-size: 0.88rem;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--navy-mid);
}

.group-block {
  margin-bottom: 36px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.group-label {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--gold);
}

.match-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--navy-mid);
  padding: 2px 8px;
  border-radius: 10px;
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.match-row {
  display: grid;
  grid-template-columns: 28px 1fr 120px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: border-color 0.2s;
}

.match-row:hover {
  border-color: rgba(201, 162, 39, 0.3);
}

.match-round-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--navy-light);
  padding: 2px 5px;
  border-radius: 6px;
  text-align: center;
}

.team-side {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: color 0.2s;
}

.team-side:hover .team-name {
  color: var(--gold);
}

.team-side.home {
  justify-content: flex-end;
}

.team-side.away {
  justify-content: flex-start;
}

.team-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  transition: color 0.2s;
}

.flag {
  width: 32px;
  height: 22px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.vs-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.vs {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--navy-light);
  padding: 3px 10px;
  border-radius: 6px;
}

.match-date {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.venue-col {
  min-width: 0;
}

.venue {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 200px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: var(--text-muted);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--navy-light);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .match-row {
    grid-template-columns: 24px 1fr 90px 1fr;
    gap: 8px;
  }

  .venue-col {
    display: none;
  }

  .team-name {
    font-size: 0.78rem;
  }
}

@media (max-width: 500px) {
  .match-row {
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto auto;
  }

  .match-round-badge {
    display: none;
  }

  .venue-col {
    display: none;
  }
}
</style>
