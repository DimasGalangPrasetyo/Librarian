const Home = {
  template: `
  <div class="min-h-screen bg-[#F8F4EC]">
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,168,79,.35),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,.28),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(109,141,255,.24),transparent_35%)]"></div>
      <div class="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_.9fr] md:items-center">
        <div data-aos="fade-right">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <i class='bx bx-book-reader'></i> E-Library Rental Buku & Komik Digital
          </span>
          <h1 class="mt-7 text-5xl font-black leading-tight md:text-7xl">Librarian</h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Katalog public untuk melihat koleksi buku umum, novel, dan komik. Area admin dipisahkan penuh dan hanya bisa diakses melalui alamat khusus admin.</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <router-link to="/buku-umum" class="rounded-2xl bg-[#D6A84F] px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-[#e5bd68]"><i class='bx bx-library'></i> Buku Umum</router-link>
            <router-link to="/novel" class="rounded-2xl bg-white/10 px-6 py-3 font-bold text-white ring-1 ring-white/15 transition hover:-translate-y-1 hover:bg-white/15"><i class='bx bx-book-heart'></i> Novel</router-link>
            <router-link to="/komik" class="rounded-2xl bg-white/10 px-6 py-3 font-bold text-white ring-1 ring-white/15 transition hover:-translate-y-1 hover:bg-white/15"><i class='bx bx-planet'></i> Komik</router-link>
          </div>
        </div>
        <div class="grid gap-4" data-aos="fade-left">
          <div v-for="card in typeCards" :key="card.jenis" class="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15">
            <div class="flex items-start gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" :style="{background: card.meta.accent, color: card.jenis === 'umum' ? '#1F3D2B' : '#fff'}"><i :class="['bx', card.meta.icon]"></i></div>
              <div>
                <h3 class="text-xl font-black">{{ card.meta.label }}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-300">{{ card.meta.tagline }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-12">
      <div class="grid gap-5 md:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" data-aos="zoom-in" class="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500">{{ stat.label }}</span>
            <i :class="['bx text-3xl', stat.icon]"></i>
          </div>
          <p class="mt-4 text-4xl font-black text-slate-900">{{ stat.value }}</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-14">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-slate-950">Genre Populer</h2>
          <p class="text-slate-500">Ringkasan genre berdasarkan koleksi yang tersedia.</p>
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="genre in genrePopuler" :key="genre.id" data-aos="fade-up" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold uppercase tracking-widest text-slate-400">{{ typeLabel(genre.jenis) }}</p>
              <h3 class="mt-2 text-xl font-black text-slate-900">{{ genre.nama_kategori }}</h3>
            </div>
            <span class="rounded-2xl bg-slate-100 px-4 py-2 font-black text-slate-700">{{ genre.total_koleksi }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-16">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-slate-950">Koleksi Terkini</h2>
          <p class="text-slate-500">Pilihan koleksi yang ditentukan admin untuk ditampilkan di beranda.</p>
        </div>
      </div>
      <div v-if="featured.length === 0" class="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">Belum ada koleksi terkini yang dipilih admin.</div>
      <div v-else class="grid gap-6 md:grid-cols-4">
        <router-link v-for="item in featured" :key="'featured-' + item.id" :to="'/detail/' + item.id" data-aos="fade-up" class="group rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-2 hover:shadow-soft">
          <div :class="coverClass(item).wrapper">
            <img :src="cover(item)" :alt="item.judul" class="h-full w-full object-cover">
            <div :class="coverClass(item).overlay"></div>
            <div :class="coverClass(item).chip"><i class='bx bx-star'></i> Koleksi Terkini</div>
            <div :class="coverClass(item).title">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/75">{{ typeLabel(item.jenis) }}</p>
              <h3 class="mt-2 line-clamp-2 text-xl font-black">{{ item.judul }}</h3>
            </div>
          </div>
          <div class="p-3">
            <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize', statusClass(item.status_koleksi)]">{{ item.status_koleksi }}</span>
            <p class="mt-3 text-sm text-slate-500">{{ item.nama_kategori }} • {{ item.penulis || '-' }}</p>
          </div>
        </router-link>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-20">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-slate-950">Koleksi Terbaru</h2>
          <p class="text-slate-500">Preview koleksi yang baru masuk ke katalog Librarian.</p>
        </div>
      </div>
      <div class="grid gap-6 md:grid-cols-4">
        <router-link v-for="item in latest" :key="item.id" :to="'/detail/' + item.id" data-aos="fade-up" class="group rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-2 hover:shadow-soft">
          <div :class="coverClass(item).wrapper">
            <img :src="cover(item)" :alt="item.judul" class="h-full w-full object-cover">
            <div :class="coverClass(item).overlay"></div>
            <div :class="coverClass(item).title">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/75">{{ typeLabel(item.jenis) }}</p>
              <h3 class="mt-2 line-clamp-2 text-xl font-black">{{ item.judul }}</h3>
            </div>
          </div>
          <div class="p-3">
            <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize', statusClass(item.status_koleksi)]">{{ item.status_koleksi }}</span>
            <h3 class="mt-3 line-clamp-2 text-lg font-black text-slate-950 group-hover:text-emerald-800">{{ item.judul }}</h3>
            <p class="mt-1 text-sm text-slate-500">{{ item.nama_kategori }} • {{ item.tahun_terbit || '-' }}</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
  `,
  data() {
    return { dashboard: null, latest: [], featured: [], genrePopuler: [] };
  },
  computed: {
    typeCards() {
      return Object.entries(TYPE_META).map(([jenis, meta]) => ({ jenis, meta }));
    },
    stats() {
      const d = this.dashboard || {};
      return [
        { label: 'Total Koleksi', value: d.total_koleksi || 0, icon: 'bx-book' },
        { label: 'Buku Umum', value: d.total_buku_umum || 0, icon: 'bx-library' },
        { label: 'Novel', value: d.total_novel || 0, icon: 'bx-book-heart' },
        { label: 'Komik', value: d.total_komik || 0, icon: 'bx-planet' },
      ];
    }
  },
  mounted() {
    this.loadData();
    if (window.AOS) AOS.refresh();
  },
  methods: {
    typeLabel,
    statusClass,
    cover: getCoverUrl,
    coverClass,
    loadData() {
      axios.get(API_BASE_URL + '/public/dashboard').then(res => {
        this.dashboard = res.data.data;
        this.latest = res.data.data.koleksi_terbaru || [];
        this.featured = res.data.data.koleksi_terkini || [];
        this.genrePopuler = res.data.data.genre_populer || [];
        this.$nextTick(() => window.AOS && AOS.refresh());
      }).catch(err => console.error(err));
    }
  }
};
