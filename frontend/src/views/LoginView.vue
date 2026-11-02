<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Building2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-vue-next'

const email = ref('jordan@cashly.com')
const password = ref('password123')
const loading = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  await authStore.login(email.value, password.value)
  router.push('/')
  loading.value = false
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <Building2 :size="28" />
        </div>
        <h1>Cashly</h1>
        <p>Manage your finance</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>

            <input type="email" v-model="email" placeholder="jordan@cashly.com" required class="input" />

        </div>

        <div class="form-group">
          <label>Password</label>

            <input type="password" v-model="password" placeholder="••••••••" required class="input" />

        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span>Sign In</span>
          <ArrowRight :size="18" />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-main);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 36px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  width: 48px;
  height: 48px;
  background: var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  color: white;
}

.login-header h1 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
}

.login-header p {
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.btn-block {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
}
</style>
