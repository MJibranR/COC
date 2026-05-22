<template>
  <div class="admin-container">
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-card">
        <div class="login-icon">C</div>
        <h2>Admin Access</h2>
        <p>Enter password to continue</p>
        <form @submit.prevent="login">
          <input type="password" v-model="password" placeholder="Enter admin password">
          <button type="submit">Login</button>
        </form>
        <router-link to="/" class="back-link">← Back to Website</router-link>
      </div>
    </div>
    
    <div v-else>
      <nav class="admin-nav">
        <div class="nav-brand">
          <span>Colors of Combine</span>
          <span class="admin-badge">| Admin Dashboard</span>
        </div>
        <div class="nav-actions">
          <button @click="fetchData" class="refresh-btn"><i class="fas fa-sync-alt"></i></button>
          <button @click="logout" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </nav>
      
      <div class="admin-content">
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <div :class="['stat-icon', stat.color]"><i :class="stat.icon"></i></div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
        
        <div class="admin-tabs">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="{ active: activeTab === tab.id }">
            <i :class="tab.icon"></i> {{ tab.label }}
          </button>
        </div>
        
        <div v-if="activeTab === 'bookings'" class="data-table">
          <h3>All Bookings</h3>
          <table>
            <thead><tr><th>Guest</th><th>Villa</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.id">
                <td>{{ booking.name }}<br><small>{{ booking.email }}</small></td>
                <td>{{ booking.villa_name }}</td>
                <td>{{ booking.check_in }} → {{ booking.check_out }}</td>
                <td>${{ booking.amount }}</td>
                <td><select v-model="booking.status" @change="updateBookingStatus(booking.id, booking.status)" :class="booking.status"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></td>
                <td><button @click="deleteBooking(booking.id)" class="delete-btn"><i class="fas fa-trash"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="activeTab === 'messages'" class="data-table">
          <h3>Contact Messages</h3>
          <div v-for="msg in messages" :key="msg.id" :class="['message-item', { unread: !msg.read }]">
            <div class="message-header"><strong>{{ msg.name }}</strong> <small>{{ msg.email }} • {{ msg.phone }}</small> <span>{{ new Date(msg.created_at).toLocaleDateString() }}</span></div>
            <p>{{ msg.message }}</p>
            <div class="message-actions"><button v-if="!msg.read" @click="markRead(msg.id)">Mark as Read</button><button @click="deleteMessage(msg.id)">Delete</button></div>
          </div>
        </div>
        
        <div v-if="activeTab === 'villas'" class="villas-admin">
          <button @click="openVillaModal()" class="add-btn"><i class="fas fa-plus"></i> Add Villa</button>
          <div class="villas-grid">
            <div v-for="villa in villas" :key="villa.id" class="villa-admin-card">
              <img :src="villa.image" :alt="villa.name">
              <div class="villa-info"><h4>{{ villa.name }}</h4><p>${{ villa.price }}/night</p><div class="card-actions"><button @click="openVillaModal(villa)"><i class="fas fa-edit"></i></button><button @click="deleteVilla(villa.id)"><i class="fas fa-trash"></i></button></div></div>
            </div>
          </div>
        </div>
      </div>
      
      <VillaModal v-if="showModal" :villa="editingVilla" @close="closeModal" @save="saveVilla" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Admin',
  data() {
    return {
      isAuthenticated: false,
      password: '',
      activeTab: 'bookings',
      bookings: [],
      villas: [],
      messages: [],
      stats: [],
      showModal: false,
      editingVilla: null,
      tabs: [
        { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar' },
        { id: 'messages', label: 'Messages', icon: 'fas fa-envelope' },
        { id: 'villas', label: 'Villas', icon: 'fas fa-home' }
      ]
    };
  },
  mounted() {
    const token = localStorage.getItem('adminToken');
    if (token === 'authenticated') {
      this.isAuthenticated = true;
      this.fetchData();
    }
  },
  methods: {
    login() {
      if (this.password === 'admin123') {
        this.isAuthenticated = true;
        localStorage.setItem('adminToken', 'authenticated');
        this.fetchData();
      } else {
        alert('Invalid password');
      }
    },
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    },
    async fetchData() {
      try {
        const [bookingsRes, villasRes, messagesRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/villas'),
          fetch('/api/contact')
        ]);
        this.bookings = await bookingsRes.json();
        this.villas = await villasRes.json();
        this.messages = await messagesRes.json();
        this.stats = [
          { label: 'Total Revenue', value: `$${this.bookings.reduce((s, b) => s + (b.status === 'confirmed' ? b.amount : 0), 0)}`, icon: 'fas fa-dollar-sign', color: 'emerald' },
          { label: 'Total Bookings', value: this.bookings.length, icon: 'fas fa-calendar', color: 'blue' },
          { label: 'Messages', value: this.messages.length, icon: 'fas fa-envelope', color: 'amber' },
          { label: 'Active Villas', value: this.villas.length, icon: 'fas fa-home', color: 'rose' }
        ];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async updateBookingStatus(id, status) {
      await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      this.fetchData();
    },
    async deleteBooking(id) {
      if (confirm('Delete this booking?')) await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      this.fetchData();
    },
    async markRead(id) {
      await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, read: true }) });
      this.fetchData();
    },
    async deleteMessage(id) {
      if (confirm('Delete this message?')) await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      this.fetchData();
    },
    openVillaModal(villa = null) {
      this.editingVilla = villa;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editingVilla = null;
    },
    async saveVilla(villaData) {
      await fetch('/api/villas', { method: this.editingVilla ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(villaData) });
      this.closeModal();
      this.fetchData();
    },
    async deleteVilla(id) {
      if (confirm('Delete this villa?')) await fetch(`/api/villas?id=${id}`, { method: 'DELETE' });
      this.fetchData();
    }
  }
};
</script>

<style scoped>
.admin-container { min-height: 100vh; background: #f5f2ed; }
.login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a2e26, #2d4a3e); }
.login-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); padding: 40px; border-radius: 24px; text-align: center; width: 100%; max-width: 400px; }
.login-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #FFD700, #FF8C00); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; margin: 0 auto 20px; }
.login-card h2 { color: white; margin-bottom: 8px; }
.login-card p { color: rgba(255,255,255,0.5); margin-bottom: 24px; }
.login-card input { width: 100%; padding: 12px; border-radius: 12px; border: none; margin-bottom: 16px; }
.login-card button { width: 100%; padding: 12px; background: linear-gradient(135deg, #FFD700, #FF8C00); border: none; border-radius: 40px; font-weight: 600; cursor: pointer; }
.back-link { display: block; margin-top: 16px; color: rgba(255,255,255,0.5); text-decoration: none; }
.admin-nav { background: #1a2e26; color: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; }
.nav-brand { font-size: 18px; }
.admin-badge { color: #FFD700; }
.refresh-btn, .logout-btn { background: rgba(255,255,255,0.1); border: none; padding: 8px 16px; border-radius: 8px; color: white; cursor: pointer; margin-left: 12px; }
.admin-content { padding: 32px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
.stat-card { background: white; padding: 20px; border-radius: 16px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; }
.stat-icon.emerald { background: linear-gradient(135deg, #10b981, #14b8a6); }
.stat-icon.blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
.stat-icon.amber { background: linear-gradient(135deg, #f59e0b, #f97316); }
.stat-icon.rose { background: linear-gradient(135deg, #f43f5e, #ec4899); }
.stat-value { font-size: 28px; font-weight: bold; color: #1a2e26; }
.stat-label { color: #666; font-size: 14px; }
.admin-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; }
.admin-tabs button { padding: 12px 24px; background: none; border: none; cursor: pointer; font-size: 14px; transition: all 0.3s ease; }
.admin-tabs button.active { border-bottom: 2px solid #FFD700; color: #1a2e26; font-weight: 600; }
.data-table { background: white; border-radius: 16px; padding: 24px; overflow-x: auto; }
.data-table table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
.data-table select { padding: 4px 8px; border-radius: 20px; border: none; font-size: 12px; }
.data-table select.pending { background: #fef3c7; color: #d97706; }
.data-table select.confirmed { background: #d1fae5; color: #059669; }
.delete-btn { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; }
.message-item { background: white; padding: 16px; margin-bottom: 12px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.message-item.unread { background: #fef3c7; border-left: 4px solid #FFD700; }
.message-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.message-actions { margin-top: 12px; display: flex; gap: 12px; }
.message-actions button { background: none; border: none; color: #FF8C00; cursor: pointer; }
.villas-admin { background: white; border-radius: 16px; padding: 24px; }
.add-btn { background: #1a2e26; color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; margin-bottom: 24px; }
.villas-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.villa-admin-card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.villa-admin-card img { width: 100%; height: 180px; object-fit: cover; }
.villa-info { padding: 16px; display: flex; justify-content: space-between; align-items: center; }
.card-actions { display: flex; gap: 8px; }
.card-actions button { background: none; border: none; cursor: pointer; font-size: 16px; }
@media (max-width: 768px) {
  .stats-grid, .villas-grid { grid-template-columns: repeat(2, 1fr); }
  .admin-content { padding: 16px; }
}
</style>