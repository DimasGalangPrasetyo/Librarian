const AdminPeminjaman = {
  template: `
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div><p class="font-bold text-emerald-700">Transaksi</p><h1 class="text-3xl font-black text-slate-950">Peminjaman & Pengembalian</h1></div>
      <button @click="openModal()" class="rounded-2xl bg-emerald-800 px-5 py-3 font-bold text-white hover:bg-emerald-950"><i class='bx bx-plus'></i> Buat Peminjaman</button>
    </div>
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div class="mb-4 flex gap-3">
        <input v-model="q" @input="loadData" class="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Cari transaksi...">
        <select v-model="status" @change="loadData" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Semua Status</option><option value="aktif">Aktif</option><option value="terlambat">Terlambat</option><option value="dikembalikan">Dikembalikan</option></select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500"><tr><th class="p-4">Kode</th><th class="p-4">Koleksi</th><th class="p-4">Anggota</th><th class="p-4">Tanggal</th><th class="p-4">Status</th><th class="p-4 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="row in items" :key="row.id" class="border-b border-slate-100">
              <td class="p-4 font-bold">{{ row.kode_pinjam }}</td><td class="p-4"><b>{{ row.judul }}</b><p class="text-xs text-slate-500">{{ row.kode_koleksi }}</p></td><td class="p-4">{{ row.nama_anggota }}</td><td class="p-4 text-slate-500">Pinjam: {{ row.tanggal_pinjam }}<br>Tempo: {{ row.tanggal_jatuh_tempo }}</td><td class="p-4"><span :class="['rounded-full border px-3 py-1 text-xs font-bold capitalize', statusClass(row.status_efektif || row.status_peminjaman)]">{{ row.status_efektif || row.status_peminjaman }}</span></td>
              <td class="p-4 text-right"><button @click="openModal(row)" class="rounded-xl bg-amber-100 px-3 py-2 font-bold text-amber-700"><i class='bx bx-edit'></i></button> <button @click="remove(row.id)" class="rounded-xl bg-rose-100 px-3 py-2 font-bold text-rose-700"><i class='bx bx-trash'></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
      <form @submit.prevent="save" class="my-8 w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-soft">
        <div class="mb-5 flex items-center justify-between"><h2 class="text-2xl font-black">{{ form.id ? 'Edit Peminjaman' : 'Buat Peminjaman' }}</h2><button type="button" @click="showModal=false" class="text-2xl"><i class='bx bx-x'></i></button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <input v-model="form.kode_pinjam" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Kode pinjam">
          <select v-model="form.status_peminjaman" class="rounded-2xl border border-slate-200 px-4 py-3"><option value="aktif">Aktif</option><option value="terlambat">Terlambat</option><option value="dikembalikan">Dikembalikan</option></select>
          <select v-model="form.koleksi_id" class="rounded-2xl border border-slate-200 px-4 py-3" required><option value="">Pilih Koleksi</option><option v-for="k in koleksi" :key="k.id" :value="k.id">{{ k.kode_koleksi }} - {{ k.judul }} ({{ k.status_koleksi }})</option></select>
          <select v-model="form.anggota_id" class="rounded-2xl border border-slate-200 px-4 py-3" required><option value="">Pilih Anggota</option><option v-for="a in anggota" :key="a.id" :value="a.id">{{ a.kode_anggota }} - {{ a.nama }}</option></select>
          <div><label class="mb-2 block text-sm font-bold text-slate-600">Tanggal Pinjam</label><input v-model="form.tanggal_pinjam" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required></div>
          <div><label class="mb-2 block text-sm font-bold text-slate-600">Jatuh Tempo</label><input v-model="form.tanggal_jatuh_tempo" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required></div>
          <div><label class="mb-2 block text-sm font-bold text-slate-600">Tanggal Kembali</label><input v-model="form.tanggal_kembali" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3"></div>
          <textarea v-model="form.catatan" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" rows="3" placeholder="Catatan"></textarea>
          <button class="rounded-2xl bg-emerald-800 px-5 py-3 font-black text-white md:col-span-2">Simpan Transaksi</button>
        </div>
      </form>
    </div>
  </div>
  `,
  data(){return{items:[],koleksi:[],anggota:[],showModal:false,q:'',status:'',form:{id:null,kode_pinjam:'',koleksi_id:'',anggota_id:'',tanggal_pinjam:new Date().toISOString().slice(0,10),tanggal_jatuh_tempo:'',tanggal_kembali:'',status_peminjaman:'aktif',catatan:''}}},
  mounted(){this.loadAll()},
  methods:{
    statusClass,
    loadAll(){this.loadData();axios.get(API_BASE_URL+'/koleksi').then(r=>this.koleksi=r.data.data||[]);axios.get(API_BASE_URL+'/anggota').then(r=>this.anggota=(r.data.data||[]).filter(a=>a.status_anggota==='aktif'))},
    loadData(){axios.get(API_BASE_URL+'/peminjaman',{params:{q:this.q,status:this.status}}).then(r=>this.items=r.data.data||[])},
    openModal(row=null){this.form=row?{...row}:{id:null,kode_pinjam:'',koleksi_id:'',anggota_id:'',tanggal_pinjam:new Date().toISOString().slice(0,10),tanggal_jatuh_tempo:'',tanggal_kembali:'',status_peminjaman:'aktif',catatan:''};this.showModal=true},
    save(){const payload={...this.form}; if(payload.tanggal_kembali==='') payload.tanggal_kembali=null; const req=payload.id?axios.put(API_BASE_URL+'/peminjaman/'+payload.id,payload):axios.post(API_BASE_URL+'/peminjaman',payload);req.then(()=>{this.showModal=false;this.loadAll()}).catch(err=>alert(err.response?.data?.messages || 'Gagal menyimpan transaksi'))},
    remove(id){if(confirm('Hapus transaksi ini?'))axios.delete(API_BASE_URL+'/peminjaman/'+id).then(()=>this.loadAll())}
  }
};
