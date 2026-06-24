const Login = {
  template: `
  <div class="min-h-screen bg-slate-950 px-6 py-10 text-white">
    <div class="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
      <div class="grid w-full overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-soft md:grid-cols-2">
        <div class="relative hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-700 p-10 text-white md:block">
          <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_white,_transparent_35%)]"></div>
          <div class="relative flex h-full flex-col justify-between">
            <div>
              <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-4xl backdrop-blur"><i class='bx bx-library'></i></div>
              <h1 class="mt-8 text-5xl font-black">Admin Librarian</h1>
              <p class="mt-4 leading-8 text-white/75">Area ini terpisah dari public. Admin dapat mengelola koleksi, genre, anggota, dan transaksi peminjaman.</p>
            </div>
            <p class="text-sm text-white/60">Public tidak menampilkan tombol login admin.</p>
          </div>
        </div>
        <div class="p-8 md:p-12">
          <router-link to="/" class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600"><i class='bx bx-left-arrow-alt'></i> Kembali ke public</router-link>
          <h2 class="mt-8 text-3xl font-black">Login Administrator</h2>
          <p class="mt-2 text-slate-500">Masukkan akun admin untuk masuk dashboard.</p>
          <form @submit.prevent="handleLogin" class="mt-8 space-y-4">
            <div>
              <label class="mb-2 block text-sm font-bold text-slate-600">Username / Email</label>
              <input v-model="username" type="text" required class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-emerald-100" placeholder="admin@email.com">
            </div>
            <div>
              <label class="mb-2 block text-sm font-bold text-slate-600">Password</label>
              <input v-model="password" type="password" required class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-emerald-100" placeholder="admin123">
            </div>
            <p v-if="errorMessage" class="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{{ errorMessage }}</p>
            <button :disabled="loading" class="w-full rounded-2xl bg-emerald-800 px-5 py-3 font-black text-white transition hover:bg-emerald-950 disabled:opacity-60">
              <i class='bx bx-log-in'></i> {{ loading ? 'Memproses...' : 'Masuk Dashboard' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return { username: 'admin@email.com', password: 'admin123', errorMessage: '', loading: false };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      axios.post(API_BASE_URL + '/login', { username: this.username, password: this.password })
        .then(res => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userToken', res.data.data.token);
          localStorage.setItem('adminName', res.data.data.username);
          this.$root.isLoggedIn = true;
          window.dispatchEvent(new Event('auth-changed'));
          this.$router.push('/admin/dashboard');
        })
        .catch(err => {
          this.errorMessage = err.response?.data?.messages || 'Login gagal. Periksa akun admin.';
        })
        .finally(() => this.loading = false);
    }
  }
};
