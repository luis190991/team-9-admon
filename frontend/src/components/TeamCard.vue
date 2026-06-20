<template>
  <RouterLink :to="`/team/${team.id}`" class="team-card">
    <button
      class="fav-btn"
      :class="{ active: isFavorite(team.id) }"
      :title="isFavorite(team.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
      @click="toggleFavorite(team.id, $event)"
    >
      {{ isFavorite(team.id) ? '★' : '☆' }}
    </button>
    <div class="flag-wrapper">
      <img
        :src="team.flagUrl"
        :alt="`Bandera de ${team.name}`"
        loading="lazy"
        @error="onFlagError"
      />
      <span v-if="team.isHost" class="host-badge">Sede</span>
    </div>
    <div class="team-info">
      <span class="team-name">{{ team.name }}</span>
      <span class="team-meta">
        <span class="confederation">{{ team.confederation }}</span>
        <span class="group-badge">Grupo {{ team.group }}</span>
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { useFavorites } from '../composables/useFavorites'

defineProps({ team: Object })

const { isFavorite, toggleFavorite } = useFavorites()

const onFlagError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 12px 14px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: all 0.2s ease;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.team-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 60%, rgba(201, 162, 39, 0.04));
  pointer-events: none;
}

.team-card:hover {
  background: var(--navy-light);
  border-color: var(--gold);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(201, 162, 39, 0.15);
}

.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-muted);
  padding: 2px 4px;
  line-height: 1;
  transition: color 0.2s, transform 0.15s;
  z-index: 2;
}

.fav-btn:hover {
  transform: scale(1.3);
}

.fav-btn.active {
  color: var(--gold);
}

.flag-wrapper {
  width: 80px;
  height: 54px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--navy-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.flag-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.host-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--gold);
  color: #0a1628;
  font-size: 0.55rem;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px 0 0 0;
  text-transform: uppercase;
}

.team-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.team-name {
  font-size: 0.82rem;
  font-weight: 600;
  text-align: center;
  color: var(--text);
  line-height: 1.2;
}

.team-meta {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.confederation {
  font-size: 0.65rem;
  color: var(--gold);
  font-weight: 600;
}

.group-badge {
  font-size: 0.62rem;
  color: var(--text-muted);
  background: var(--navy-light);
  padding: 1px 6px;
  border-radius: 10px;
}
</style>
