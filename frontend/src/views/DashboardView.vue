<script setup>
import { ref } from 'vue'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Search, 
  Filter, 
  SlidersHorizontal,
  MoreHorizontal,
  Utensils,
  Film,
  ShoppingBag
} from 'lucide-vue-next'

const stats = ref([
  { title: 'Total Balance', value: '$24,500', change: '+8% from last month', isPositive: true },
  { title: 'Monthly Income', value: '$8,200', change: 'Stable growth', isPositive: true },
  { title: 'Monthly Expenses', value: '$5,400', change: '-3% reduced spending', isPositive: false },
  { title: 'Savings Growth', value: '$2,800', change: 'Goal: $5,000', isPositive: true }
])

const transactions = ref([
  { logo: '🎨', name: 'Figma Pro', date: 'Mar 28, 08:36', type: 'Send', amount: '-$8,20.00', status: 'Complete', statusClass: 'badge-success' },
  { logo: '▶️', name: 'Youtube', date: 'Mar 27, 09:12', type: 'Send', amount: '-$15.00', status: 'Pending', statusClass: 'badge-warning' },
  { logo: '👤', name: 'Lassy Chester', date: 'Mar 26, 10:54', type: 'Receive', amount: '$8,200.00', status: 'Complete', statusClass: 'badge-success' },
  { logo: '☕', name: 'Coffee Shop', date: 'Mar 25, 08:25', type: 'Send', amount: '-$60.00', status: 'Failed', statusClass: 'badge-danger' }
])

const spendingCategories = ref([
  { name: 'Food', pct: '19%', color: '#ff5733' },
  { name: 'Rent', pct: '27%', color: '#f87171' },
  { name: 'Transport', pct: '8%', color: '#38bdf8' },
  { name: 'Others', pct: '12%', color: '#3b82f6' },
  { name: 'Utilities', pct: '10%', color: '#a855f7' },
  { name: 'Shopping', pct: '15%', color: '#fb923c' }
])

const budgets = ref([
  { name: 'Food', usage: '70%', icon: Utensils },
  { name: 'Entertainment', usage: '90%', icon: Film },
  { name: 'Shopping', usage: '75%', icon: ShoppingBag }
])
</script>

<template>
  <div class="dashboard-container">
    <!-- Top 4 Summary Cards -->
    <div class="top-cards-grid">
      <!-- Total Balance -->
      <div class="light-card summary-card">
        <div class="card-top">
          <span class="card-title">Total Balance</span>
          <DollarSign :size="16" class="icon-muted" />
        </div>
        <div class="card-body">
          <div class="amount-wrap">
            <h2>{{ stats[0].value }}</h2>
            <span class="sub-text positive">{{ stats[0].change }}</span>
          </div>
          <!-- Sparkline graphic SVG mockup -->
          <svg class="sparkline" viewBox="0 0 80 30">
            <path d="M0,25 Q15,5 30,20 T60,10 T80,5" fill="none" stroke="#ff5733" stroke-width="2.5" />
          </svg>
        </div>
      </div>

      <!-- Monthly Income -->
      <div class="light-card summary-card">
        <div class="card-top">
          <span class="card-title">Monthly Income</span>
          <TrendingUp :size="16" class="icon-muted" />
        </div>
        <div class="card-body">
          <div class="amount-wrap">
            <h2>{{ stats[1].value }}</h2>
            <span class="sub-text">{{ stats[1].change }}</span>
          </div>
          <div class="mini-bar-group">
            <div class="mini-bar filled" style="height: 24px;"></div>
            <div class="mini-bar filled" style="height: 20px;"></div>
            <div class="mini-bar" style="height: 14px;"></div>
            <div class="mini-bar" style="height: 18px;"></div>
          </div>
        </div>
      </div>

      <!-- Monthly Expenses -->
      <div class="light-card summary-card">
        <div class="card-top">
          <span class="card-title">Monthly Expenses</span>
          <TrendingDown :size="16" class="icon-muted" />
        </div>
        <div class="card-body">
          <div class="amount-wrap">
            <h2>{{ stats[2].value }}</h2>
            <span class="sub-text negative">{{ stats[2].change }}</span>
          </div>
          <div class="mini-bar-group">
            <div class="mini-bar coral" style="height: 12px;"></div>
            <div class="mini-bar coral" style="height: 18px;"></div>
            <div class="mini-bar coral" style="height: 28px;"></div>
            <div class="mini-bar coral" style="height: 22px;"></div>
          </div>
        </div>
      </div>

      <!-- Savings Growth -->
      <div class="light-card summary-card">
        <div class="card-top">
          <span class="card-title">Savings Growth</span>
          <PiggyBank :size="16" class="icon-muted" />
        </div>
        <div class="card-body">
          <div class="amount-wrap">
            <h2>{{ stats[3].value }}</h2>
            <span class="sub-text">{{ stats[3].change }}</span>
          </div>
          <div class="histogram-graphic">
            <span style="height: 60%"></span>
            <span style="height: 80%"></span>
            <span style="height: 40%"></span>
            <span style="height: 90%"></span>
            <span style="height: 70%"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid Content: Middle Charts & Right Column Sidebar -->
    <div class="dashboard-grid">
      <!-- Left 2 Columns -->
      <div class="left-section">
        <!-- 2 Chart Cards Row -->
        <div class="charts-row">
          <!-- Income vs Expenses -->
          <div class="light-card chart-card">
            <div class="chart-header">
              <div>
                <h3>Income vs Expenses</h3>
                <p class="sub-desc">6-month overview</p>
              </div>
              <select class="pill-select">
                <option>Monthly</option>
              </select>
            </div>
            <!-- Interactive Line Chart Visualization -->
            <div class="line-chart-area">
              <svg viewBox="0 0 320 140" class="chart-svg">
                <!-- Grid Lines -->
                <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" stroke-dasharray="4" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="#f1f5f9" stroke-dasharray="4" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#f1f5f9" stroke-dasharray="4" />

                <!-- Income line (Teal/Green) -->
                <path d="M 20,80 Q 70,75 120,60 T 220,50 T 300,20" fill="none" stroke="#10b981" stroke-width="2.5" />
                <circle cx="120" cy="60" r="4" fill="#10b981" />
                <circle cx="300" cy="20" r="4" fill="#10b981" />

                <!-- Expense line (Coral) -->
                <path d="M 20,110 Q 70,105 120,95 T 220,85 T 300,60" fill="none" stroke="#ff5733" stroke-width="2.5" />
                <circle cx="120" cy="95" r="4" fill="#ff5733" />
                <circle cx="300" cy="60" r="4" fill="#ff5733" />
              </svg>
              <div class="months-label">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>
          </div>

          <!-- Cash Flow Bar Chart -->
          <div class="light-card chart-card">
            <div class="chart-header">
              <div>
                <h3>Cash Flow</h3>
                <p class="sub-desc">Monthly net cash flow</p>
              </div>
              <select class="pill-select">
                <option>Monthly</option>
              </select>
            </div>
            <!-- Bar Chart Visual -->
            <div class="bar-chart-area">
              <div class="bars-flex">
                <div class="bar-col"><div class="bar-fill pattern"></div><span>Jan</span></div>
                <div class="bar-col"><div class="bar-fill pattern"></div><span>Feb</span></div>
                <div class="bar-col"><div class="bar-fill active-bar"></div><span class="active-month">Mar</span></div>
                <div class="bar-col"><div class="bar-fill pattern"></div><span>Apr</span></div>
                <div class="bar-col"><div class="bar-fill pattern"></div><span>May</span></div>
                <div class="bar-col"><div class="bar-fill pattern"></div><span>Jun</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Latest Transactions Table Card -->
        <div class="light-card transactions-card">
          <div class="table-top">
            <div>
              <h3>Latest Transactions</h3>
              <p class="sub-desc">Monitor your recent financial activities</p>
            </div>

            <div class="table-controls">
              <div class="search-input-box">
                <Search :size="14" class="icon-muted" />
                <input type="text" placeholder="Search..." />
              </div>
              <button class="pill-btn"><Filter :size="14" /><span>Filter</span></button>
              <button class="pill-btn"><SlidersHorizontal :size="14" /><span>Sort by</span></button>
            </div>
          </div>

          <table class="clean-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date & time</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(txn, i) in transactions" :key="i">
                <td>
                  <div class="name-cell">
                    <span class="logo-emoji">{{ txn.logo }}</span>
                    <span class="font-semibold">{{ txn.name }}</span>
                  </div>
                </td>
                <td class="text-muted">{{ txn.date }}</td>
                <td class="text-muted">{{ txn.type }}</td>
                <td class="font-semibold" :class="txn.amount.startsWith('-') ? 'text-dark' : 'text-primary'">
                  {{ txn.amount }}
                </td>
                <td>
                  <span class="badge" :class="txn.statusClass">{{ txn.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Spending Breakdown & Budget Planner -->
      <div class="right-section">
        <!-- Spending Breakdown (Donut Chart) -->
        <div class="light-card side-widget">
          <div class="widget-header">
            <div>
              <h3>Spending Breakdown</h3>
              <p class="sub-desc">Expense distribution</p>
            </div>
            <MoreHorizontal :size="18" class="icon-muted" />
          </div>

          <div class="donut-area">
            <div class="donut-graphic">
              <svg viewBox="0 0 100 100" class="donut-svg">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ff5733" stroke-width="18" stroke-dasharray="60 180" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f87171" stroke-width="18" stroke-dasharray="50 180" stroke-dashoffset="-60" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" stroke-width="18" stroke-dasharray="40 180" stroke-dashoffset="-110" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#a855f7" stroke-width="18" stroke-dasharray="30 180" stroke-dashoffset="-150" />
              </svg>
              <div class="donut-center">
                <span class="center-pct">100%</span>
                <span class="center-label">Total</span>
              </div>
            </div>
          </div>

          <div class="legend-grid">
            <div v-for="(item, idx) in spendingCategories" :key="idx" class="legend-item">
              <div class="legend-left">
                <span class="dot" :style="{ backgroundColor: item.color }"></span>
                <span>{{ item.name }}</span>
              </div>
              <span class="legend-pct">{{ item.pct }}</span>
            </div>
          </div>
        </div>

        <!-- Budget Planner Widget -->
        <div class="light-card side-widget">
          <div class="widget-header">
            <div>
              <h3>Budget Planner</h3>
              <p class="sub-desc">Set monthly budgets and track usage</p>
            </div>
            <MoreHorizontal :size="18" class="icon-muted" />
          </div>

          <div class="budget-list">
            <div v-for="(b, i) in budgets" :key="i" class="budget-item">
              <div class="budget-top">
                <div class="budget-title">
                  <component :is="b.icon" :size="16" class="icon-muted" />
                  <span>{{ b.name }}</span>
                </div>
                <span class="budget-pct">{{ b.usage }}</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-fill" :style="{ width: b.usage }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.summary-card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.icon-muted {
  color: var(--text-muted);
}

.card-body {
  margin-top: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.amount-wrap h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}

.sub-text {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.sub-text.positive { color: var(--accent-green); }
.sub-text.negative { color: var(--primary); }

.sparkline {
  width: 70px;
  height: 28px;
}

.mini-bar-group {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.mini-bar {
  width: 8px;
  background: #cbd5e1;
  border-radius: 4px;
}
.mini-bar.filled { background: var(--primary); }
.mini-bar.coral { background: #f87171; }

.histogram-graphic {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
}

.histogram-graphic span {
  width: 5px;
  background: #ff5733;
  opacity: 0.7;
  border-radius: 2px;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2.3fr 1fr;
  gap: 20px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}

.chart-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-header, .widget-header, .table-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-header h3, .widget-header h3, .table-top h3 {
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--text-primary);
}

.sub-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.pill-select {
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.75rem;
  background: var(--bg-card);
  color: var(--text-secondary);
}

.line-chart-area {
  margin-top: 10px;
}

.chart-svg {
  width: 100%;
  height: 120px;
}

.months-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--text-muted);
  padding: 0 10px;
  margin-top: 4px;
}

.bars-flex {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  padding: 0 10px;
  margin-top: 10px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--text-muted);
  height: 100%;
  justify-content: flex-end;
}

.bar-fill {
  width: 24px;
  border-radius: 6px;
}

.bar-fill.pattern {
  height: 80px;
  background: repeating-linear-gradient(
    45deg,
    #f1f5f9,
    #f1f5f9 4px,
    #e2e8f0 4px,
    #e2e8f0 8px
  );
}

.bar-fill.active-bar {
  height: 95px;
  background: var(--primary);
}

.active-month {
  color: var(--primary);
  font-weight: 700;
}

/* Transactions Card */
.transactions-card {
  display: flex;
  flex-direction: column;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
}

.search-input-box input {
  border: none;
  background: transparent;
  width: 80px;
  font-size: 0.75rem;
}

.pill-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-card);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.clean-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.82rem;
  margin-top: 10px;
}

.clean-table th {
  color: var(--text-muted);
  font-weight: 600;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-light);
}

.clean-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-light);
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-emoji {
  width: 28px;
  height: 28px;
  background: var(--bg-input);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.font-semibold { font-weight: 700; }
.text-muted { color: var(--text-secondary); }
.text-primary { color: var(--primary); }
.text-dark { color: var(--text-primary); }

/* Right Section Widgets */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.donut-area {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.donut-graphic {
  position: relative;
  width: 130px;
  height: 130px;
}

.donut-svg {
  transform: rotate(-90deg);
}

.donut-center {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.center-pct {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.center-label {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
}

.legend-left {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-pct {
  font-weight: 700;
  color: var(--text-primary);
}

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
}

.budget-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.budget-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
}

.budget-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.budget-pct {
  font-weight: 700;
  color: var(--text-secondary);
}

.progress-bar-bg {
  height: 6px;
  background: var(--bg-input);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 10px;
}
</style>
