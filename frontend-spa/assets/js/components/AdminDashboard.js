const AdminDashboard = {
  template: `
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <p class="font-bold text-emerald-700">Dashboard Administrator</p>
        <h1 class="text-3xl font-black text-slate-950">Ringkasan Librarian</h1>
      </div>
      <button @click="$root.logout" class="rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-700"><i class='bx bx-log-out'></i> Logout</button>
    </div>
    <div class="grid gap-5 md:grid-cols-4">
      <div v-for="card in cards" :key="card.label" class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-slate-500">{{ card.label }}</span>
          <i :class="['bx text-3xl', card.icon]"></i>
        </div>
        <p class="mt-4 text-4xl font-black text-slate-950">{{ card.value }}</p>
      </div>
    </div>
    <div class="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 class="text-xl font-black text-slate-950">Peminjaman Terbaru</h2>
      <div class="mt-5 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr><th class="p-4">Kode</th><th class="p-4">Koleksi</th><th class="p-4">Anggota</th><th class="p-4">Jatuh Tempo</th><th class="p-4">Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in recent" :key="row.id" class="border-b border-slate-100">
              <td class="p-4 font-bold">{{ row.kode_pinjam }}</td>
              <td class="p-4">{{ row.judul }}</td>
              <td class="p-4">{{ row.nama_anggota }}</td>
              <td class="p-4">{{ row.tanggal_jatuh_tempo }}</td>
              <td class="p-4"><span :class="['rounded-full border px-3 py-1 text-xs font-bold capitalize', statusClass(row.status_peminjaman)]">{{ row.status_peminjaman }}</span></td>
            </tr>
            <tr v-if="recent.length === 0"><td colspan="5" class="p-6 text-center text-slate-500">Belum ada transaksi.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
  data() { return { data: {}, recent: [] }; },
  computed: {
    cards() {
      const d = this.data || {};
      return [
        { label: 'Total Koleksi', value: d.total_koleksi || 0, icon: 'bx-book' },
        { label: 'Anggota', value: d.total_anggota || 0, icon: 'bx-user' },
        { label: 'Peminjaman Aktif', value: d.peminjaman_aktif || 0, icon: 'bx-transfer' },
        { label: 'Terlambat', value: d.peminjaman_terlambat || 0, icon: 'bx-error-circle' },
        { label: 'Buku Umum', value: d.total_buku_umum || 0, icon: 'bx-library' },
        { label: 'Novel', value: d.total_novel || 0, icon: 'bx-book-heart' },
        { label: 'Komik', value: d.total_komik || 0, icon: 'bx-planet' },
        { label: 'Koleksi Terkini', value: d.koleksi_terkini || 0, icon: 'bx-star' },
        { label: 'Tersedia', value: d.koleksi_tersedia || 0, icon: 'bx-check-circle' },
      ];
    }
  },
  mounted() { this.loadData(); },
  methods: {
    statusClass,
    loadData() {
      axios.get(API_BASE_URL + '/dashboard').then(res => {
        this.data = res.data.data;
        this.recent = res.data.data.peminjaman_terbaru || [];
      });
    }
  }
};
