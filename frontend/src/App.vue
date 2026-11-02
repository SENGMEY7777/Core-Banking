<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { 
  LayoutGrid, 
  RefreshCw, 
  Lightbulb, 
  BarChart2, 
  Target, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Building2,
  Wallet,
  Send,
  Fingerprint,
  ShieldCheck
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-layout">
    <!-- Top Header -->
    <header class="top-header">
      <div class="header-left">
        <div class="brand-logo">
          <div class="logo-box">
            <Building2 :size="20" />
          </div>
          <div class="brand-names">
            <h2>Cashly</h2>
            <span class="sub">Manage your finance</span>
          </div>
        </div>
      </div>

      <div class="header-center">
        <button class="add-btn" title="Quick Add">
          <Plus :size="18" />
        </button>

        <div class="user-pill">
          <img :src="authStore.user?.avatar" alt="User Avatar" class="avatar" />
          <div class="user-meta">
            <p class="user-name">{{ authStore.user?.name || 'Jordan Lee' }}</p>
            <p class="user-role">{{ authStore.user?.role || 'CEO Assistant' }}</p>
          </div>
        </div>
      </div>

      <div class="header-right">
        <div class="search-bar">
          <Search :size="16" class="search-icon" />
          <input type="text" placeholder="Start searching here..." />
        </div>
      </div>
    </header>

    <div class="body-container">
      <!-- Icon Navigation Bar -->
      <aside class="icon-nav">
        <div class="nav-group">
          <router-link to="/" class="nav-icon" :class="{ active: route.path === '/' }" title="Dashboard">
            <LayoutGrid :size="20" />
          </router-link>

          <router-link to="/accounts" class="nav-icon" :class="{ active: route.path === '/accounts' }" title="Accounts & Transactions">
            <Wallet :size="20" />
          </router-link>

          <router-link to="/transfers" class="nav-icon" :class="{ active: route.path === '/transfers' }" title="Transfers & Payments">
            <Send :size="20" />
          </router-link>

          <router-link to="/biometrics" class="nav-icon" :class="{ active: route.path === '/biometrics' }" title="Biometric Security">
            <Fingerprint :size="20" />
          </router-link>

          <router-link to="/admin" class="nav-icon" :class="{ active: route.path === '/admin' }" title="Admin & Audit">
            <ShieldCheck :size="20" />
          </router-link>
        </div>

        <div class="nav-footer">
          <button class="nav-icon" title="Settings">
            <Settings :size="20" />
          </button>
          <button @click="handleLogout" class="nav-icon logout-icon" title="Logout">
            <LogOut :size="20" />
          </button>
        </div>
      </aside>

      <!-- Main Content Container -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-main);
}

.top-header {
  height: 72px;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 38px;
  height: 38px;
  background: var(--primary);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-names h2 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}

.brand-names .sub {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.header-center {
  display: flex;
  align-items: center;
  gap: 16px;
}

.add-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.add-btn:hover {
  background: #e2e8f0;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  background: var(--bg-input);
  border-radius: 30px;
  border: 1px solid var(--border-light);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.user-meta .user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}

.user-meta .user-role {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.header-right {
  display: flex;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-light);
  padding: 8px 16px;
  border-radius: 20px;
  width: 260px;
}

.search-bar input {
  background: transparent;
  border: none;
  font-size: 0.82rem;
  color: var(--text-primary);
  width: 100%;
}

.search-icon {
  color: var(--text-muted);
}

.body-container {
  display: flex;
  flex: 1;
}

.icon-nav {
  width: 72px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
}

.nav-group, .nav-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.nav-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  background: transparent;
}

.nav-icon:hover {
  background: var(--bg-input);
  color: var(--text-primary);
}

.nav-icon.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 87, 51, 0.3);
}

.logout-icon:hover {
  background: #fee2e2;
  color: #ef4444;
}

.main-content {
  flex: 1;
  padding: 28px 36px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}
</style>
