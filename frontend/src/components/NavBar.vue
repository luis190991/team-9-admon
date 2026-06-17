<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">
      <span class="logo">⚽</span>
      <div class="brand-text">
        <span class="brand-name">PrediGoal <span class="ai">AI</span></span>
        <span class="brand-sub">Mundial FIFA 2026</span>
      </div>
    </RouterLink>

    <div class="nav-links">
      <RouterLink to="/" class="nav-link" active-class="active" exact>Equipos</RouterLink>
      <RouterLink to="/matches" class="nav-link" active-class="active">Partidos</RouterLink>
    </div>

    <div class="nav-right">
      <span class="status-dot" :class="{ active: apiOk }"></span>
      <span class="status-label">{{ apiOk ? 'API Online' : 'Conectando...' }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHealth } from '../services/api'

const apiOk = ref(false)

onMounted(async () => {
  try {
    await getHealth()
    apiOk.value = true
  } catch {
    apiOk.value = false
  }
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a2f5e 0%, #0d1f42 100%);
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gold);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.logo {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px rgba(201, 162, 39, 0.5));
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}

.ai {
  color: var(--gold);
}

.brand-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
}

.nav-link.active {
  color: var(--gold);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  transition: background 0.3s;
}

.status-dot.active {
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.status-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .navbar {
    padding: 12px 16px;
  }

  .brand-sub,
  .status-label {
    display: none;
  }

  .logo {
    font-size: 1.6rem;
  }

  .brand-name {
    font-size: 1.1rem;
  }
}
</style>
