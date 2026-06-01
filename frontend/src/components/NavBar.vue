<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">
      <span class="logo">⚽</span>
      <div class="brand-text">
        <span class="brand-name">PrediGoal <span class="ai">AI</span></span>
        <span class="brand-sub">Mundial FIFA 2026</span>
      </div>
    </RouterLink>
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
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
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

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>
