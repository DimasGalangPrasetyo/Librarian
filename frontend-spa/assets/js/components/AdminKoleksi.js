const AdminKoleksi = {
  template: `
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div><p class="font-bold text-emerald-700">Master Data</p><h1 class="text-3xl font-black text-slate-950">Koleksi Buku / Novel / Komik</h1></div>
      <button @click="openModal()" class="rounded-2xl bg-emerald-800 px-5 py-3 font-bold text-white hover:bg-emerald-950"><i class='bx bx-plus'></i> Tambah Koleksi</button>
    </div>
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div class="mb-4 grid gap-3 md:grid-cols-3">
        <input v-model="q" @input="loadData" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Cari judul/kode/penulis...">
        <select v-model="filterJenis" @change="loadData" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Semua Jenis</option><option value="umum">Buku Umum</option><option value="novel">Novel</option><option value="komik">Komik</option></select>
        <select v-model="filterStatus" @change="loadData" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Semua Status</option><option value="tersedia">Tersedia</option><option value="dipinjam">Dipinjam</option><option value="rusak">Rusak</option><option value="hilang">Hilang</option></select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500"><tr><th class="p-4">Cover</th><th class="p-4">Kode</th><th class="p-4">Judul</th><th class="p-4">Jenis</th><th class="p-4">Genre</th><th class="p-4">Status</th><th class="p-4">Terkini</th><th class="p-4 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="row in items" :key="row.id" class="border-b border-slate-100 align-top">
              <td class="p-4"><img :src="cover(row)" :alt="row.judul" class="h-20 w-14 rounded-xl object-cover shadow ring-1 ring-slate-200"></td>
              <td class="p-4 font-bold">{{ row.kode_koleksi }}</td>
              <td class="p-4"><b>{{ row.judul }}</b><p class="mt-1 text-xs text-slate-500">{{ row.penulis || '-' }}</p></td>
              <td class="p-4">{{ typeLabel(row.jenis) }}</td>
              <td class="p-4">{{ row.nama_kategori }}</td>
              <td class="p-4"><span :class="['rounded-full border px-3 py-1 text-xs font-bold capitalize', statusClass(row.status_koleksi)]">{{ row.status_koleksi }}</span></td>
              <td class="p-4">
                <button @click="toggleTerkini(row)" :class="row.is_terkini == 1 ? 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' : 'bg-slate-100 text-slate-600 border-slate-200'" class="rounded-full border px-3 py-2 text-xs font-bold">
                  {{ row.is_terkini == 1 ? 'Ya' : 'Tidak' }}
                </button>
              </td>
              <td class="p-4 text-right whitespace-nowrap"><button @click="openModal(row)" class="rounded-xl bg-amber-100 px-3 py-2 font-bold text-amber-700"><i class='bx bx-edit'></i></button> <button @click="remove(row.id)" class="rounded-xl bg-rose-100 px-3 py-2 font-bold text-rose-700"><i class='bx bx-trash'></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4">
      <form @submit.prevent="save" class="my-8 w-full max-w-5xl rounded-[2rem] bg-white p-6 shadow-soft">
        <div class="mb-5 flex items-center justify-between"><h2 class="text-2xl font-black">{{ form.id ? 'Edit Koleksi' : 'Tambah Koleksi' }}</h2><button type="button" @click="showModal=false" class="text-2xl"><i class='bx bx-x'></i></button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <input v-model="form.kode_koleksi" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Kode koleksi">
          <select v-model="form.jenis" @change="syncKategori" class="rounded-2xl border border-slate-200 px-4 py-3" required><option value="umum">Buku Umum</option><option value="novel">Novel</option><option value="komik">Komik</option></select>
          <select v-model="form.kategori_id" class="rounded-2xl border border-slate-200 px-4 py-3" required><option value="">Pilih Genre</option><option v-for="k in kategoriByJenis" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option></select>
          <select v-model="form.status_koleksi" class="rounded-2xl border border-slate-200 px-4 py-3"><option value="tersedia">Tersedia</option><option value="dipinjam">Dipinjam</option><option value="rusak">Rusak</option><option value="hilang">Hilang</option></select>
          <input v-model="form.judul" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Judul koleksi" required>
          <input v-model="form.penulis" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Penulis">
          <input v-model="form.penerbit" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Penerbit">
          <input v-model="form.tahun_terbit" type="number" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Tahun terbit">
          <input v-model="form.rak_lokasi" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Lokasi rak">
          <input v-model="form.isbn" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="ISBN">
          <input v-model="form.cover_url" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Cover URL opsional (boleh kosong)">
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-bold text-slate-600">Upload cover/sampul buku</label>
            <input @change="handleFile" type="file" accept="image/*" class="w-full rounded-2xl border border-slate-200 px-4 py-3">
            <p class="mt-2 text-xs text-slate-500">Jika file diupload, file akan diprioritaskan. Jika kosong, sistem akan memakai cover URL atau cover otomatis berdasarkan judul.</p>
          </div>
          <label class="flex items-center gap-3 rounded-2xl bg-fuchsia-50 px-4 py-3 font-bold text-fuchsia-700 md:col-span-2"><input v-model="form.is_terkini" type="checkbox" class="h-5 w-5"> Tampilkan di Koleksi Terkini pada halaman home</label>
          <textarea v-model="form.sinopsis" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" rows="4" placeholder="Sinopsis/deskripsi"></textarea>
          <div class="md:col-span-2 flex items-center gap-4">
            <div class="h-40 w-28 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200"><img :src="formPreview" alt="preview" class="h-full w-full object-cover"></div>
            <div class="text-sm text-slate-500">Preview cover. Jika belum ada upload/URL, sistem akan membuat cover otomatis berdasarkan judul dan jenis koleksi.</div>
          </div>
          <button class="rounded-2xl bg-emerald-800 px-5 py-3 font-black text-white md:col-span-2">Simpan Koleksi</button>
        </div>
      </form>
    </div>
  </div>
  `,
  data(){return{items:[],kategori:[],showModal:false,q:'',filterJenis:'',filterStatus:'',coverFile:null,form:{id:null,kode_koleksi:'',judul:'',jenis:'umum',kategori_id:'',penulis:'',penerbit:'',tahun_terbit:'',isbn:'',sinopsis:'',status_koleksi:'tersedia',cover_url:'',is_terkini:false,rak_lokasi:''}}},
  computed:{
    kategoriByJenis(){return this.kategori.filter(k=>k.jenis===this.form.jenis)},
    formPreview(){
      if (this.coverFile) return URL.createObjectURL(this.coverFile);
      if (this.form.cover_url && !String(this.form.cover_url).includes('picsum.photos')) return this.form.cover_url;
      return getCoverUrl({id:this.form.id, jenis:this.form.jenis, judul:this.form.judul, cover_url:this.form.cover_url});
    }
  },
  mounted(){this.loadKategori();this.loadData()},
  methods:{
    typeLabel,statusClass,cover:getCoverUrl,
    loadKategori(){axios.get(API_BASE_URL+'/kategori').then(r=>this.kategori=r.data.data||[])},
    loadData(){axios.get(API_BASE_URL+'/koleksi',{params:{jenis:this.filterJenis,status:this.filterStatus,q:this.q}}).then(r=>this.items=r.data.data||[])},
    syncKategori(){this.form.kategori_id=''},
    handleFile(e){this.coverFile=e.target.files[0]||null},
    emptyForm(){return{id:null,kode_koleksi:'',judul:'',jenis:'umum',kategori_id:'',penulis:'',penerbit:'',tahun_terbit:'',isbn:'',sinopsis:'',status_koleksi:'tersedia',cover_url:'',is_terkini:false,rak_lokasi:''}},
    openModal(row=null){
      this.coverFile=null;
      if(row){
        this.form={...row,is_terkini:row.is_terkini==1 || row.is_terkini===true};
      } else {
        this.form=this.emptyForm();
      }
      this.showModal=true
    },
    save(){
      const fd=new FormData();
      Object.entries(this.form).forEach(([key,val])=>{
        if(key==='id') return;
        if(key==='is_terkini') {
          fd.append(key, val ? '1' : '0');
          return;
        }
        fd.append(key, val ?? '');
      });
      if(this.coverFile) fd.append('cover_file', this.coverFile);
      const req=this.form.id
        ? axios.post(API_BASE_URL+'/koleksi/upload-update/'+this.form.id, fd)
        : axios.post(API_BASE_URL+'/koleksi/upload-create', fd);
      req.then(()=>{this.showModal=false;this.loadData()})
    },
    toggleTerkini(row){axios.patch(API_BASE_URL+'/koleksi/'+row.id+'/toggle-terkini').then(()=>this.loadData())},
    remove(id){if(confirm('Hapus koleksi ini?'))axios.delete(API_BASE_URL+'/koleksi/'+id).then(()=>this.loadData())}
  }
};
