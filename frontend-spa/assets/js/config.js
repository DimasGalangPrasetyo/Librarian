const API_BASE_URL = 'http://localhost:8080/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

const TYPE_META = {
  umum: {
    label: 'Buku Umum',
    path: '/buku-umum',
    icon: 'bx-library',
    primary: '#1F3D2B',
    secondaryOne: '#F4E8D0',
    secondaryTwo: '#8B5E3C',
    accent: '#D6A84F',
    tagline: 'Ruang referensi klasik untuk buku pelajaran, rumus, resep, kamus, dan bacaan umum.',
    gradient: 'from-[#1F3D2B] via-[#305B3F] to-[#8B5E3C]',
    softBg: 'bg-[#F4E8D0]',
    button: 'bg-[#1F3D2B] hover:bg-[#163020] text-white',
  },
  novel: {
    label: 'Novel',
    path: '/novel',
    icon: 'bx-book-heart',
    primary: '#243B53',
    secondaryOne: '#FFF7ED',
    secondaryTwo: '#D9A5A5',
    accent: '#F9735B',
    tagline: 'Nuansa casual untuk cerita romance, drama, misteri, thriller, dan fiksi remaja.',
    gradient: 'from-[#243B53] via-[#486581] to-[#F9735B]',
    softBg: 'bg-[#FFF7ED]',
    button: 'bg-[#243B53] hover:bg-[#102A43] text-white',
  },
  komik: {
    label: 'Komik',
    path: '/komik',
    icon: 'bx-planet',
    primary: '#2D1B69',
    secondaryOne: '#6D8DFF',
    secondaryTwo: '#C4B5FD',
    accent: '#F472B6',
    tagline: 'Dreams fantasy untuk komik action, manga, adventure, fantasy, dan slice of life.',
    gradient: 'from-[#2D1B69] via-[#6D8DFF] to-[#F472B6]',
    softBg: 'bg-[#F5F3FF]',
    button: 'bg-[#2D1B69] hover:bg-[#1E1247] text-white',
  }
};

function typeLabel(jenis) {
  return TYPE_META[jenis]?.label || jenis;
}

function statusClass(status) {
  const map = {
    tersedia: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dipinjam: 'bg-amber-100 text-amber-700 border-amber-200',
    rusak: 'bg-orange-100 text-orange-700 border-orange-200',
    hilang: 'bg-rose-100 text-rose-700 border-rose-200',
    aktif: 'bg-blue-100 text-blue-700 border-blue-200',
    terlambat: 'bg-red-100 text-red-700 border-red-200',
    dikembalikan: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function getCoverUrl(row) {
  if (row?.cover_url && !String(row.cover_url).includes('picsum.photos')) {
    return row.cover_url;
  }
  if (row?.id) {
    return API_BASE_URL + '/public/cover/' + row.id;
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="620">
      <rect width="100%" height="100%" fill="#cbd5e1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="28" fill="#334155">Tanpa Cover</text>
    </svg>
  `);
}

function coverClass(row) {
  const meta = TYPE_META[row?.jenis] || TYPE_META.umum;
  return {
    wrapper: 'relative h-56 overflow-hidden rounded-3xl bg-slate-100 shadow-soft',
    overlay: 'absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent',
    chip: 'absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow',
    title: 'absolute inset-x-4 bottom-5 text-white',
    accentStyle: `background:${meta.accent}; color:${row?.jenis === 'umum' ? meta.primary : '#fff'};`
  };
}
