const DetailPage = {
  template: `
  <div class="min-h-screen bg-slate-50 px-6 py-10">
    <div class="mx-auto max-w-6xl">
      <button @click="$router.back()" class="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"><i class='bx bx-left-arrow-alt'></i> Kembali</button>
      <div v-if="item" class="grid gap-8 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-200 md:grid-cols-[380px_1fr]">
        <div>
          <div class="overflow-hidden rounded-[2rem] bg-slate-100 shadow-soft ring-1 ring-slate-200">
            <img :src="cover(item)" :alt="item.judul" class="h-[560px] w-full object-cover">
          </div>
        </div>
        <div>
          <p class="text-sm font-black uppercase tracking-[0.35em] text-slate-400">{{ typeLabel(item.jenis) }}</p>
          <h1 class="mt-3 text-4xl font-black text-slate-950">{{ item.judul }}</h1>
          <p class="mt-3 text-lg text-slate-500">{{ item.penulis || 'Penulis belum diisi' }} • {{ item.penerbit || 'Penerbit belum diisi' }}</p>
          <div class="mt-5 flex flex-wrap gap-3">
            <span class="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700">Genre: {{ item.nama_kategori }}</span>
            <span :class="['rounded-full border px-4 py-2 font-bold capitalize', statusClass(item.status_koleksi)]">{{ item.status_koleksi }}</span>
            <span v-if="item.is_terkini == 1" class="rounded-full border border-fuchsia-200 bg-fuchsia-100 px-4 py-2 font-bold text-fuchsia-700">Koleksi Terkini</span>
          </div>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="rounded-3xl bg-slate-50 p-4"><p class="text-sm text-slate-500">Tahun Terbit</p><p class="mt-1 text-xl font-black text-slate-900">{{ item.tahun_terbit || '-' }}</p></div>
            <div class="rounded-3xl bg-slate-50 p-4"><p class="text-sm text-slate-500">ISBN</p><p class="mt-1 text-xl font-black text-slate-900">{{ item.isbn || '-' }}</p></div>
            <div class="rounded-3xl bg-slate-50 p-4"><p class="text-sm text-slate-500">Rak</p><p class="mt-1 text-xl font-black text-slate-900">{{ item.rak_lokasi || '-' }}</p></div>
          </div>
          <div class="mt-8 rounded-[2rem] bg-slate-50 p-6">
            <h2 class="text-2xl font-black text-slate-900">Sinopsis</h2>
            <p class="mt-2 leading-8 text-slate-600">{{ item.sinopsis || 'Belum ada sinopsis.' }}</p>
          </div>
        </div>
      </div>
      <div v-else class="rounded-3xl bg-white p-8 text-center font-bold text-slate-500">Memuat detail koleksi...</div>
    </div>
  </div>
  `,
  data() { return { item: null }; },
  mounted() { this.loadData(); },
  methods: {
    typeLabel,
    statusClass,
    cover: getCoverUrl,
    loadData() {
      axios.get(API_BASE_URL + '/public/koleksi/' + this.$route.params.id)
        .then(res => this.item = res.data.data)
        .catch(() => this.$router.push('/'));
    }
  }
};
