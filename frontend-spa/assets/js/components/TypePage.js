const TypePage = {
  template: `
  <div :class="['min-h-screen', meta.softBg]">
    <section :class="['relative overflow-hidden bg-gradient-to-br text-white', meta.gradient]">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_white,_transparent_38%)]"></div>
      <div class="relative mx-auto max-w-7xl px-6 py-16">
        <div data-aos="fade-up" class="max-w-3xl">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur"><i :class="['bx', meta.icon]"></i> Katalog {{ meta.label }}</span>
          <h1 class="mt-5 text-5xl font-black">{{ meta.label }}</h1>
          <p class="mt-4 text-lg leading-8 text-white/80">{{ meta.tagline }}</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-8">
      <div class="rounded-[2rem] bg-white p-4 shadow-soft ring-1 ring-slate-200 md:flex md:items-center md:gap-4">
        <div class="relative flex-1">
          <i class='bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400'></i>
          <input v-model="q" @input="loadData" type="text" placeholder="Cari judul, penulis, atau genre..." class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-slate-200">
        </div>
        <select v-model="kategoriId" @change="loadData" class="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none md:mt-0 md:w-64">
          <option value="">Semua Genre</option>
          <option v-for="k in kategori" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
        </select>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-20">
      <div v-if="loading" class="rounded-3xl bg-white p-8 text-center font-bold text-slate-500">Memuat koleksi...</div>
      <div v-else-if="items.length === 0" class="rounded-3xl bg-white p-8 text-center font-bold text-slate-500">Koleksi belum ditemukan.</div>
      <div v-else class="grid gap-6 md:grid-cols-4">
        <router-link v-for="item in items" :key="item.id" :to="'/detail/' + item.id" data-aos="fade-up" class="group rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-2 hover:shadow-soft">
          <div :class="coverClass(item).wrapper">
            <img :src="cover(item)" :alt="item.judul" class="h-full w-full object-cover">
            <div :class="coverClass(item).overlay"></div>
            <div :class="coverClass(item).chip" :style="coverClass(item).accentStyle"><i :class="['bx', TYPE_META[item.jenis].icon]"></i> {{ typeLabel(item.jenis) }}</div>
            <div :class="coverClass(item).title">
              <h3 class="line-clamp-2 text-xl font-black">{{ item.judul }}</h3>
              <p class="mt-2 line-clamp-1 text-sm text-white/80">{{ item.penulis || 'Penulis belum diisi' }}</p>
            </div>
          </div>
          <div class="p-3">
            <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize', statusClass(item.status_koleksi)]">{{ item.status_koleksi }}</span>
            <h3 class="mt-3 line-clamp-2 text-lg font-black text-slate-950 group-hover:opacity-80">{{ item.judul }}</h3>
            <p class="mt-1 text-sm text-slate-500">{{ item.nama_kategori }} • {{ item.penulis || '-' }}</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
  `,
  data() {
    return { items: [], kategori: [], q: '', kategoriId: '', loading: true };
  },
  computed: {
    jenis() {
      return this.$route.meta.jenis || 'umum';
    },
    meta() {
      return TYPE_META[this.jenis] || TYPE_META.umum;
    }
  },
  mounted() {
    this.loadKategori();
    this.loadData();
    if (window.AOS) AOS.refresh();
  },
  watch: {
    '$route.fullPath'() {
      this.loadKategori();
      this.loadData();
    }
  },
  methods: {
    typeLabel,
    statusClass,
    cover: getCoverUrl,
    coverClass,
    loadKategori() {
      axios.get(API_BASE_URL + '/public/kategori', { params: { jenis: this.jenis } }).then(res => {
        this.kategori = res.data.data || [];
      });
    },
    loadData() {
      this.loading = true;
      axios.get(API_BASE_URL + '/public/koleksi', { params: { jenis: this.jenis, kategori_id: this.kategoriId, q: this.q } }).then(res => {
        this.items = res.data.data || [];
        this.$nextTick(() => window.AOS && AOS.refresh());
      }).finally(() => this.loading = false);
    }
  }
};
