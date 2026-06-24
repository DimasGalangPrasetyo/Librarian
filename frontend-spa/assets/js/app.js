const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});


const routes = [
  { path: '/', component: Home, meta: { public: true } },
  { path: '/buku-umum', component: TypePage, meta: { public: true, jenis: 'umum' } },
  { path: '/novel', component: TypePage, meta: { public: true, jenis: 'novel' } },
  { path: '/komik', component: TypePage, meta: { public: true, jenis: 'komik' } },
  { path: '/detail/:id', component: DetailPage, meta: { public: true } },
  { path: '/admin/login', component: Login, meta: { admin: true, guestOnly: true } },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { admin: true, requiresAuth: true } },
  { path: '/admin/kategori', component: AdminKategori, meta: { admin: true, requiresAuth: true } },
  { path: '/admin/koleksi', component: AdminKoleksi, meta: { admin: true, requiresAuth: true } },
  { path: '/admin/anggota', component: AdminAnggota, meta: { admin: true, requiresAuth: true } },
  { path: '/admin/peminjaman', component: AdminPeminjaman, meta: { admin: true, requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

let isHandlingUnauthorized = false;

axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const currentRoute = router.currentRoute.value;

    const isLoginRequest = url.includes('/login');
    const isLogoutRequest = url.includes('/logout');
    const isPublicApiRequest = url.includes('/public/');
    const isProtectedAdminRoute = currentRoute?.meta?.requiresAuth === true;

    // Jangan ganggu halaman public. 401 hanya ditangani saat user sedang berada di route admin yang memang diproteksi.
    if (status === 401 && isProtectedAdminRoute && !isLoginRequest && !isLogoutRequest && !isPublicApiRequest) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminName');
      window.dispatchEvent(new Event('auth-changed'));

      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        alert('Sesi admin habis atau token tidak valid. Silakan login ulang.');
        router.replace('/admin/login').catch(() => {});
        setTimeout(() => { isHandlingUnauthorized = false; }, 1200);
      }
    }

    return Promise.reject(error);
  }
);

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('userToken');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/admin/login');
    return;
  }
  if (to.meta.guestOnly && isAuthenticated) {
    next('/admin/dashboard');
    return;
  }
  next();
});

const app = createApp({
  template: `
    <div>
      <template v-if="isAdminArea">
        <router-view v-if="isAdminLogin"></router-view>
        <div v-else class="min-h-screen bg-slate-100 text-slate-900 md:flex">
          <aside class="sticky top-0 z-40 h-auto bg-slate-950 p-5 text-white md:h-screen md:w-72">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-2xl"><i class='bx bx-library'></i></div>
              <div>
                <h1 class="text-xl font-black">Librarian</h1>
                <p class="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
            <nav class="mt-8 grid gap-2">
              <router-link v-for="item in adminMenu" :key="item.path" :to="item.path" class="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-slate-300 transition hover:bg-white/10 hover:text-white" active-class="bg-emerald-600 text-white">
                <i :class="['bx text-xl', item.icon]"></i> {{ item.label }}
              </router-link>
            </nav>
            <button @click="logout" class="mt-8 w-full rounded-2xl bg-white/10 px-4 py-3 font-bold text-white transition hover:bg-rose-600"><i class='bx bx-log-out'></i> Logout</button>
          </aside>
          <main class="flex-1 p-5 md:p-8">
            <router-view></router-view>
          </main>
        </div>
      </template>

      <template v-else>
        <header class="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
          <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <router-link to="/" class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D6A84F] text-2xl text-slate-950"><i class='bx bx-library'></i></div>
              <div>
                <h1 class="text-xl font-black">Librarian</h1>
                <p class="hidden text-xs text-slate-400 md:block">Rental Buku & Komik Digital</p>
              </div>
            </router-link>
            <nav class="flex items-center gap-2 text-sm font-bold">
              <router-link class="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white" active-class="bg-white/10 text-white" to="/">Home</router-link>
              <router-link class="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white" active-class="bg-white/10 text-white" to="/buku-umum">Buku Umum</router-link>
              <router-link class="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white" active-class="bg-white/10 text-white" to="/novel">Novel</router-link>
              <router-link class="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white" active-class="bg-white/10 text-white" to="/komik">Komik</router-link>
            </nav>
          </div>
        </header>
        <router-view></router-view>
        <footer class="bg-slate-950 px-6 py-10 text-white">
          <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-black">Librarian</h2>
              <p class="mt-1 text-slate-400">Public katalog dan admin panel dibuat terpisah untuk UAS Pemrograman Web 2.</p>
            </div>
            <p class="text-sm text-slate-500">© 2026 Librarian. Built with CI4 REST API, VueJS SPA, Axios, TailwindCSS.</p>
          </div>
        </footer>
      </template>
    </div>
  `,
  data() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      adminMenu: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: 'bx-grid-alt' },
        { path: '/admin/koleksi', label: 'Koleksi', icon: 'bx-book' },
        { path: '/admin/kategori', label: 'Kategori', icon: 'bx-purchase-tag-alt' },
        { path: '/admin/anggota', label: 'Anggota', icon: 'bx-user' },
        { path: '/admin/peminjaman', label: 'Peminjaman', icon: 'bx-transfer' },
      ]
    };
  },
  computed: {
    isAdminArea() {
      return this.$route.meta.admin === true;
    },
    isAdminLogin() {
      return this.$route.path === '/admin/login';
    }
  },
  mounted() {
    if (window.AOS) {
      AOS.init({ duration: 700, once: true, offset: 60 });
    }

    window.addEventListener('auth-changed', () => {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    });
  },
  methods: {
    logout() {
      if (!confirm('Keluar dari dashboard admin?')) return;
      axios.post(API_BASE_URL + '/logout').catch(() => {}).finally(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminName');
        this.isLoggedIn = false;
        window.dispatchEvent(new Event('auth-changed'));
        this.$router.push('/admin/login');
      });
    }
  }
});

app.use(router);
app.mount('#app');
