const AdminKategori = {
  template: `
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div><p class="font-bold text-emerald-700">Master Data</p><h1 class="text-3xl font-black text-slate-950">Kategori / Genre</h1></div>
      <button @click="openModal()" class="rounded-2xl bg-emerald-800 px-5 py-3 font-bold text-white hover:bg-emerald-950"><i class='bx bx-plus'></i> Tambah Genre</button>
    </div>
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div class="mb-4 flex gap-3">
        <input v-model="q" @input="loadData" class="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Cari genre...">
        <select v-model="filterJenis" @change="loadData" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"><option value="">Semua Jenis</option><option value="umum">Buku Umum</option><option value="novel">Novel</option><option value="komik">Komik</option></select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500"><tr><th class="p-4">Jenis</th><th class="p-4">Genre</th><th class="p-4">Deskripsi</th><th class="p-4 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="row in items" :key="row.id" class="border-b border-slate-100">
              <td class="p-4 font-bold">{{ typeLabel(row.jenis) }}</td><td class="p-4">{{ row.nama_kategori }}</td><td class="p-4 text-slate-500">{{ row.deskripsi }}</td>
              <td class="p-4 text-right"><button @click="openModal(row)" class="rounded-xl bg-amber-100 px-3 py-2 font-bold text-amber-700"><i class='bx bx-edit'></i></button> <button @click="remove(row.id)" class="rounded-xl bg-rose-100 px-3 py-2 font-bold text-rose-700"><i class='bx bx-trash'></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <form @submit.prevent="save" class="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-soft">
        <div class="mb-5 flex items-center justify-between"><h2 class="text-2xl font-black">{{ form.id ? 'Edit Genre' : 'Tambah Genre' }}</h2><button type="button" @click="showModal=false" class="text-2xl"><i class='bx bx-x'></i></button></div>
        <div class="grid gap-4">
          <select v-model="form.jenis" class="rounded-2xl border border-slate-200 px-4 py-3" required><option value="umum">Buku Umum</option><option value="novel">Novel</option><option value="komik">Komik</option></select>
          <input v-model="form.nama_kategori" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Nama genre" required>
          <textarea v-model="form.deskripsi" class="rounded-2xl border border-slate-200 px-4 py-3" rows="4" placeholder="Deskripsi"></textarea>
          <button class="rounded-2xl bg-emerald-800 px-5 py-3 font-black text-white">Simpan Data</button>
        </div>
      </form>
    </div>
  </div>
  `,
  data(){return{items:[],showModal:false,filterJenis:'',q:'',form:{id:null,jenis:'umum',nama_kategori:'',deskripsi:''}}},
  mounted(){this.loadData()},
  methods:{
    typeLabel,
    loadData(){axios.get(API_BASE_URL+'/kategori',{params:{jenis:this.filterJenis,q:this.q}}).then(r=>this.items=r.data.data||[])},
    openModal(row=null){this.form=row?{...row}:{id:null,jenis:'umum',nama_kategori:'',deskripsi:''};this.showModal=true},
    save(){const req=this.form.id?axios.put(API_BASE_URL+'/kategori/'+this.form.id,this.form):axios.post(API_BASE_URL+'/kategori',this.form);req.then(()=>{this.showModal=false;this.loadData()})},
    remove(id){if(confirm('Hapus genre ini?'))axios.delete(API_BASE_URL+'/kategori/'+id).then(()=>this.loadData())}
  }
};
