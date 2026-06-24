const AdminAnggota = {
  template: `
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div><p class="font-bold text-emerald-700">Master Data</p><h1 class="text-3xl font-black text-slate-950">Anggota</h1></div>
      <button @click="openModal()" class="rounded-2xl bg-emerald-800 px-5 py-3 font-bold text-white hover:bg-emerald-950"><i class='bx bx-plus'></i> Tambah Anggota</button>
    </div>
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div class="mb-4 flex gap-3">
        <input v-model="q" @input="loadData" class="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Cari anggota...">
        <select v-model="status" @change="loadData" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Semua Status</option><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500"><tr><th class="p-4">Kode</th><th class="p-4">Nama</th><th class="p-4">Kontak</th><th class="p-4">Status</th><th class="p-4 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="row in items" :key="row.id" class="border-b border-slate-100">
              <td class="p-4 font-bold">{{ row.kode_anggota }}</td><td class="p-4">{{ row.nama }}</td><td class="p-4 text-slate-500">{{ row.email }}<br>{{ row.no_hp }}</td><td class="p-4"><span :class="['rounded-full border px-3 py-1 text-xs font-bold capitalize', row.status_anggota==='aktif'?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-slate-100 text-slate-600 border-slate-200']">{{ row.status_anggota }}</span></td>
              <td class="p-4 text-right"><button @click="openModal(row)" class="rounded-xl bg-amber-100 px-3 py-2 font-bold text-amber-700"><i class='bx bx-edit'></i></button> <button @click="remove(row.id)" class="rounded-xl bg-rose-100 px-3 py-2 font-bold text-rose-700"><i class='bx bx-trash'></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <form @submit.prevent="save" class="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-soft">
        <div class="mb-5 flex items-center justify-between"><h2 class="text-2xl font-black">{{ form.id ? 'Edit Anggota' : 'Tambah Anggota' }}</h2><button type="button" @click="showModal=false" class="text-2xl"><i class='bx bx-x'></i></button></div>
        <div class="grid gap-4 md:grid-cols-2">
          <input v-model="form.kode_anggota" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Kode anggota">
          <select v-model="form.status_anggota" class="rounded-2xl border border-slate-200 px-4 py-3"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select>
          <input v-model="form.nama" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Nama anggota" required>
          <input v-model="form.email" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email">
          <input v-model="form.no_hp" class="rounded-2xl border border-slate-200 px-4 py-3" placeholder="No HP">
          <textarea v-model="form.alamat" class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" rows="3" placeholder="Alamat"></textarea>
          <button class="rounded-2xl bg-emerald-800 px-5 py-3 font-black text-white md:col-span-2">Simpan Anggota</button>
        </div>
      </form>
    </div>
  </div>
  `,
  data(){return{items:[],showModal:false,q:'',status:'',form:{id:null,kode_anggota:'',nama:'',email:'',no_hp:'',alamat:'',status_anggota:'aktif'}}},
  mounted(){this.loadData()},
  methods:{
    loadData(){axios.get(API_BASE_URL+'/anggota',{params:{q:this.q,status:this.status}}).then(r=>this.items=r.data.data||[])},
    openModal(row=null){this.form=row?{...row}:{id:null,kode_anggota:'',nama:'',email:'',no_hp:'',alamat:'',status_anggota:'aktif'};this.showModal=true},
    save(){const req=this.form.id?axios.put(API_BASE_URL+'/anggota/'+this.form.id,this.form):axios.post(API_BASE_URL+'/anggota',this.form);req.then(()=>{this.showModal=false;this.loadData()})},
    remove(id){if(confirm('Hapus anggota ini?'))axios.delete(API_BASE_URL+'/anggota/'+id).then(()=>this.loadData())}
  }
};
