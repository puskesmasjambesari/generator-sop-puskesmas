// ==========================================================================
// SCRIPT LOGIKA APLIKASI SOP GENERATOR - UPTD PUSKESMAS JAMBESARI
// ==========================================================================

let dasarHukumList = [
    "Undang-Undang Nomor 36 Tahun 2009 tentang Kesehatan",
    "Peraturan Menteri Kesehatan Nomor 43 Tahun 2019 tentang Puskesmas"
];
let keterkaitanList = [
    "SOP Pendaftaran Pasien Rawat Jalan",
    "SOP Rekam Medis Pasien"
];
let pelaksanaList = [
    "Pasien", 
    "Petugas Pendaftaran", 
    "Perawat Rawat Inap", 
    "Dokter Jaga"
];
let stepsList = [
    { kegiatan: "Pasien datang membawa kartu identitas dan rujukan", pelaksana: "Pasien", jenis: "start", waktu: "2 Menit", kelengkapan: "KTP / Kartu Berobat", output: "Pasien tiba di loket" },
    { kegiatan: "Menerima berkas persyaratan dan meneliti kelengkapan identitas", pelaksana: "Petugas Pendaftaran", jenis: "process", waktu: "3 Menit", kelengkapan: "KTP / Rujukan", output: "Berkas diteliti" },
    { kegiatan: "Apakah kelengkapan persyaratan dan data rekam medis lengkap?", pelaksana: "Petugas Pendaftaran", jenis: "decision", q: "Apakah berkas lengkap?", ya: "Lanjut input", tidak: "Minta dilengkapi", waktu: "1 Menit", kelengkapan: "Berkas Pasien", output: "Keputusan Validasi" },
    { kegiatan: "Menginput data pasien ke sistem SIMPUS dan membuat kartu rawat inap", pelaksana: "Petugas Pendaftaran", jenis: "process", waktu: "5 Menit", kelengkapan: "Komputer / SIMPUS", output: "Surat Masuk Rawat Inap" },
    { kegiatan: "Menyerahkan pasien beserta berkas rekam medis kepada Perawat", pelaksana: "Perawat Rawat Inap", jenis: "start", waktu: "5 Menit", kelengkapan: "Berkas & Pasien", output: "Pasien diterima di bangsal" }
];

let currentRole = 'user';

window.onload = function() {
    renderTags();
    renderStepsBuilder();
    updatePreview();
};

function openLoginModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function switchLoginForm() {
    let role = document.getElementById('loginRole').value;
    let group = document.getElementById('userPassGroup');
    group.style.display = (role === 'admin') ? 'block' : 'none';
}

function processLogin() {
    let role = document.getElementById('loginRole').value;
    if (role === 'admin') {
        let pass = document.getElementById('loginPass').value;
        if (pass !== 'admin123') {
            alert('Password Admin salah! (Gunakan password default: admin123)');
            return;
        }
    }
    currentRole = role;
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('adminCard').style.display = (currentRole === 'admin') ? 'block' : 'none';
    
    let badge = document.getElementById('activeRoleBadge');
    badge.innerText = (currentRole === 'admin') ? 'Mode: Admin Instansi' : 'Mode: User Pembuat';
    badge.style.background = (currentRole === 'admin') ? '#fee2e2' : '#dbeafe';
    badge.style.color = (currentRole === 'admin') ? '#991b1b' : '#1e40af';
}

function addDasarHukum() {
    let val = document.getElementById('inpDasarHukum').value.trim();
    if(val) {
        dasarHukumList.push(val);
        document.getElementById('inpDasarHukum').value = '';
        renderTags();
        updatePreview();
    }
}
function removeDasar(i) {
    dasarHukumList.splice(i, 1);
    renderTags();
    updatePreview();
}

function addKeterkaitan() {
    let val = document.getElementById('inpKeterkaitan').value.trim();
    if(val) {
        keterkaitanList.push(val);
        document.getElementById('inpKeterkaitan').value = '';
        renderTags();
        updatePreview();
    }
}
function removeKeterkaitan(i) {
    keterkaitanList.splice(i, 1);
    renderTags();
    updatePreview();
}

function addPelaksana() {
    let val = document.getElementById('inpNamaPelaksana').value.trim();
    if(val) {
        pelaksanaList.push(val);
        document.getElementById('inpNamaPelaksana').value = '';
        renderTags();
        renderStepsBuilder();
        updatePreview();
    }
}
function removePelaksana(i) {
    pelaksanaList.splice(i, 1);
    renderTags();
    renderStepsBuilder();
    updatePreview();
}

function renderTags() {
    document.getElementById('listDasarHukum').innerHTML = dasarHukumList.map((x,i)=>
        `<div class="tag-badge">${x} <i class="fa-solid fa-xmark" onclick="removeDasar(${i})"></i></div>`
    ).join('');
    
    document.getElementById('listKeterkaitan').innerHTML = keterkaitanList.map((x,i)=>
        `<div class="tag-badge">${x} <i class="fa-solid fa-xmark" onclick="removeKeterkaitan(${i})"></i></div>`
    ).join('');
    
    document.getElementById('listPelaksana').innerHTML = pelaksanaList.map((x,i)=>
        `<div class="tag-badge">${x} <i class="fa-solid fa-xmark" onclick="removePelaksana(${i})"></i></div>`
    ).join('');
}

function addStepRow() {
    stepsList.push({ 
        kegiatan: "Uraian kegiatan baru...", 
        pelaksana: pelaksanaList[0] || "Petugas", 
        jenis: "process", 
        waktu: "5 Menit", 
        kelengkapan: "Dokumen", 
        output: "Hasil" 
    });
    renderStepsBuilder();
    updatePreview();
}

function removeStep(i) {
    stepsList.splice(i, 1);
    renderStepsBuilder();
    updatePreview();
}

function renderStepsBuilder() {
    let html = '';
    stepsList.forEach((s, i) => {
        let options = pelaksanaList.map(p => `<option value="${p}" ${s.pelaksana===p?'selected':''}>${p}</option>`).join('');
        html += `<div class="step-builder-item">
            <h5>Langkah #${i+1} <button class="btn btn-sm btn-danger" onclick="removeStep(${i})"><i class="fa-solid fa-trash"></i></button></h5>
            <div class="form-group" style="margin-bottom:5px;"><label>Uraian Kegiatan (Kata Kerja Aktif)</label><input type="text" value="${s.kegiatan}" oninput="stepsList[${i}].kegiatan=this.value; updatePreview()"></div>
            <div class="form-row" style="margin-bottom:5px;">
                <div><label>Pelaksana</label><select onchange="stepsList[${i}].pelaksana=this.value; updatePreview()">${options}</select></div>
                <div><label>Bentuk Simbol</label><select onchange="stepsList[${i}].jenis=this.value; renderStepsBuilder(); updatePreview()">
                    <option value="start" ${s.jenis==='start'?'selected':''}>Terminator (Mulai/Selesai)</option>
                    <option value="process" ${s.jenis==='process'?'selected':''}>Proses (Kotak Eksekusi)</option>
                    <option value="decision" ${s.jenis==='decision'?'selected':''}>Keputusan (Belah Ketupat)</option>
                </select></div>
            </div>
            ${s.jenis==='decision'? `<div class="form-row" style="margin-bottom:5px;">
                <div><label>Pertanyaan Keputusan</label><input type="text" value="${s.q\vert{}\vert{}''}" oninput="stepsList[${i}].q=this.value; updatePreview()" placeholder="Misal: Apakah lengkap?"></div>
                <div><label>Cabang Ya / Tidak</label><input type="text" value="${s.ya\vert{}\vert{}''}" oninput="stepsList[${i}].ya=this.value; updatePreview()" placeholder="Target/Keterangan"></div>
            </div>`:''}
            <div class="form-row">
                <div><label>Waktu</label><input type="text" value="${s.waktu}" oninput="stepsList[${i}].waktu=this.value; updatePreview()"></div>
                <div><label>Output</label><input type="text" value="${s.output}" oninput="stepsList[${i}].output=this.value; updatePreview()"></div>
            </div>
        </div>`;
    });
    document.getElementById('stepsBuilderContainer').innerHTML = html;
}

function updatePreview() {
    let pemda = document.getElementById('cfgPemda').value;
    let dinas = document.getElementById('cfgDinas').value;
    let puskesmas = document.getElementById('cfgPuskesmas').value;
    let alamat = document.getElementById('cfgAlamat').value;
    let kaPuskesmas = document.getElementById('cfgKaPuskesmas').value;
    let nipKa = document.getElementById('cfgNipKa').value;

    let judul = document.getElementById('inpJudul').value;
    let noSOP = document.getElementById('inpNoSOP').value;
    let tahun = document.getElementById('inpTahun').value;
    let tglBuat = document.getElementById('inpTglBuat').value;
    let tglEfektif = document.getElementById('inpTglEfektif').value;
    let orientasi = document.getElementById('inpOrientasi').value;

    let formatNoSOP = `400.7/${noSOP}/SOP/430.9.3.15/${tahun}`;

    // Update Cover
    document.getElementById('cvrPemda').innerText = pemda;
    document.getElementById('cvrDinas').innerText = dinas;
    document.getElementById('cvrJudulSOP').innerText = judul;
    document.getElementById('cvrPuskesmas').innerText = puskesmas;
    document.getElementById('cvrTahun').innerText = tahun;
    document.getElementById('cvrAlamat').innerHTML = `${alamat}<br>BONDOWOSO`;

    // Update SK
    document.getElementById('skPemda').innerText = pemda;
    document.getElementById('skPuskesmasTitle').innerText = `KEPALA ${puskesmas}`;
    document.getElementById('skJudulText').innerText = judul;
    document.getElementById('skJudulText2').innerText = judul;
    document.getElementById('skJudulText3').innerText = judul;
    document.getElementById('skTglDitetapkan').innerText = tglBuat;
    document.getElementById('skNamaKa').innerText = kaPuskesmas;
    document.getElementById('skNipKa').innerText = nipKa;

    // Update Header SOP
    document.getElementById('vPemda').innerText = pemda;
    document.getElementById('vDinas').innerText = dinas;
    document.getElementById('vPuskesmas').innerText = puskesmas;
    document.getElementById('vNoSOP').innerText = formatNoSOP;
    document.getElementById('vTglBuat').innerText = tglBuat;
    document.getElementById('vTglEfektif').innerText = tglEfektif;
    document.getElementById('vJudulSOP').innerText = judul.toUpperCase();
    document.getElementById('vJabatanPengesah').innerText = `Kepala ${puskesmas}`;
    document.getElementById('vNamaKa').innerText = kaPuskesmas;
    document.getElementById('vNipKa').innerText = `NIP. ${nipKa}`;

    // Update Kotak Pendukung
    document.getElementById('vListDasar').innerHTML = dasarHukumList.map(d => `<li>${d}</li>`).join('');
    document.getElementById('vListKeterkaitan').innerHTML = keterkaitanList.map(k => `<li>${k}</li>`).join('');
    document.getElementById('vPeringatan').innerText = document.getElementById('inpPeringatan').value;
    document.getElementById('vKualifikasi').innerText = document.getElementById('inpKualifikasi').value;
    document.getElementById('vPeralatan').innerText = document.getElementById('inpPeralatan').value;
    document.getElementById('vPencatatan').innerText = document.getElementById('InpPencatatan').value;

    // Orientasi A4
    let pages = document.querySelectorAll('.a4-page');
    pages.forEach(p => {
        p.className = `a4-page ${orientasi}`;
    });

    // Tabel Flowchart Pelaksana
    let thGroup = document.getElementById('thPelaksanaGroup');
    thGroup.setAttribute('colspan', pelaksanaList.length || 1);
    
    let subHead = '';
    pelaksanaList.forEach(p => {
        subHead += `<th style="min-width: 85px; font-size:8.5px;">${p}</th>`;
    });
    document.getElementById('trHeadRow2').innerHTML = subHead;

    let bodyHtml = '';
    stepsList.forEach((s, idx) => {
        let pelaksanaCells = '';
        pelaksanaList.forEach(p => {
            if (s.pelaksana === p) {
                let shapeHtml = '';
                if (s.jenis === 'start') {
                    shapeHtml = `<div class="flow-shape shape-start"><i class="fa-solid fa-circle-stop"></i> Mulai/Selesai</div>`;
                } else if (s.jenis === 'process') {
                    shapeHtml = `<div class="flow-shape shape-process"><i class="fa-solid fa-square"></i> Proses</div>`;
                } else if (s.jenis === 'decision') {
                    shapeHtml = `<div class="flow-shape shape-decision">?<br><b>${s.q || 'Keputusan'}</b><br><span style="font-size:6.5px; color:#444;">[Ya / Tidak]</span></div>`;
                }
                pelaksanaCells += `<td style="text-align: center; vertical-align: middle;">${shapeHtml}</td>`;
            } else {
                pelaksanaCells += `<td></td>`;
            }
        });

        bodyHtml += `<tr>
            <td style="text-align: center;">${idx+1}</td>
            <td>${s.kegiatan}</td>
            ${pelaksanaCells}
            <td style="font-size: 8px;">${s.kelengkapan || '-'}</td>
            <td style="font-size: 8px; text-align: center;">${s.waktu || '-'}</td>
            <td style="font-size: 8px;">${s.output || '-'}</td>
            <td style="font-size: 8px;">${s.jenis==='decision' ? 'Ya: '+(s.ya||'-') : '-'}</td>
        </tr>`;
    });
    document.getElementById('tbodySteps').innerHTML = bodyHtml;
}
