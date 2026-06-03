<template>
  <div class="home-page">
    <header class="page-header">
      <h1>Equipos del Mundial <span class="highlight">FIFA 2026</span></h1>
      <p>Selecciona un equipo para ver sus partidos y predicciones de IA</p>
      <div class="header-stats" v-if="!loading">
        <span class="stat">{{ teams.length }} equipos</span>
        <span class="sep">·</span>
        <span class="stat">12 grupos</span>
        <span class="sep">·</span>
        <span class="stat">72 partidos fase de grupos</span>
      </div>
    </header>

    <div class="filters">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar equipo..."
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
      </div>
      <select v-model="selectedConf" class="conf-select">
        <option value="">Todas las confederaciones</option>
        <option v-for="c in confederations" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="selectedGroup" class="group-select">
        <option value="">Todos los grupos</option>
        <option v-for="g in groups" :key="g" :value="g">Grupo {{ g }}</option>
      </select>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando equipos...</p>
    </div>

    <template v-else>
      <div class="results-info" v-if="searchQuery || selectedConf || selectedGroup">
        <span>{{ filteredTeams.length }} equipo{{ filteredTeams.length !== 1 ? 's' : '' }} encontrado{{ filteredTeams.length !== 1 ? 's' : '' }}</span>
        <button class="reset-filters" @click="resetFilters">Limpiar filtros</button>
      </div>

      <div v-if="filteredTeams.length" class="teams-grid">
        <TeamCard v-for="team in filteredTeams" :key="team.id" :team="team" />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">🔍</span>
        <p>No se encontraron equipos con ese criterio.</p>
        <button class="reset-filters" @click="resetFilters">Ver todos</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TeamCard from '../components/TeamCard.vue'
import { getTeams } from '../services/api'

const teams = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedConf = ref('')
const selectedGroup = ref('')

const confederations = computed(() => [...new Set(teams.value.map(t => t.confederation))].sort())
const groups = computed(() => [...new Set(teams.value.map(t => t.group))].sort())

const filteredTeams = computed(() => {
  return teams.value.filter(t => {
    const q = searchQuery.value.toLowerCase()
    const matchName = t.name.toLowerCase().includes(q)
    const matchConf = !selectedConf.value || t.confederation === selectedConf.value
    const matchGroup = !selectedGroup.value || t.group === selectedGroup.value
    return matchName && matchConf && matchGroup
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedConf.value = ''
  selectedGroup.value = ''
}

onMounted(async () => {
  try {
    const { data } = await getTeams()
    teams.value = data
  } catch (err) {
    console.error('Error cargando equipos:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 36px;
}

.page-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.2;
}

.highlight {
  color: var(--gold);
}

.page-header p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 16px;
}

.header-stats {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.sep {
  color: var(--border);
}

.stat {
  color: var(--gold);
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.search-wrapper {
  flex: 1;
  min-width: 220px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 0.9rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 11px 40px 11px 38px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--gold);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  padding: 4px;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: var(--text);
}

.conf-select,
.group-select {
  padding: 11px 14px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.conf-select:focus,
.group-select:focus {
  border-color: var(--gold);
}

.conf-select option,
.group-select option {
  background: var(--navy-mid);
}

.results-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.reset-filters {
  background: none;
  border: 1px solid var(--border);
  color: var(--gold);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.reset-filters:hover {
  background: var(--navy-mid);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
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

.empty-icon {
  font-size: 2.5rem;
}
</style>
