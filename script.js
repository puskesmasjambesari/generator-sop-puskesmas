// ==========================================================================
// SCRIPT LOGIKA APLIKASI SOP AP GENERATOR - UPTD PUSKESMAS JAMBESARI
// ==========================================================================

var dasarHukumList = [
    "Undang-Undang Nomor 17 Tahun 2023 tentang Kesehatan",
    "Peraturan Menteri Kesehatan Nomor 43 Tahun 2019 tentang Pusat Kesehatan Masyarakat"
];
var keterkaitanList = [
    "SOP Pendaftaran Pasien Rawat Jalan",
    "SOP Rekam Medis Pasien"
];
var pelaksanaList = [
    "Petugas Pendaftaran", 
    "Perawat Rawat Inap", 
    "Dokter Jaga"
];
var stepsList = [
    { kegiatan: "Menerima berkas persyaratan dan meneliti kelengkapan identitas dari pemohon", pelaksana: "Petugas Pendaftaran", jenis: "start", panah: "one-way", waktu: "3 Menit", kelengkapan: "KTP / Rujukan", output: "Berkas diteliti" },
    { kegiatan: "Apakah kelengkapan persyaratan dan data rekam medis lengkap?", pelaksana: "Petugas Pendaftaran", jenis: "decision", panah: "two-way", waktu: "1 Menit", kelengkapan: "Berkas", output: "Keputusan" },
    { kegiatan: "Menginput data rekam medis ke dalam sistem SIMPUS dan membuat kartu rawat inap", pelaksana: "Petugas Pendaftaran", jenis: "process", panah: "one-way", waktu: "5 Menit", kelengkapan: "SIMPUS", output: "Surat Masuk" },
    { kegiatan: "Melakukan serah terima pasien dan berkas rekam medis ke ruang perawatan", pelaksana: "Perawat Rawat Inap", jenis: "start", panah: "one-way", waktu: "5 Menit", kelengkapan: "Berkas", output: "Pasien diterima" }
];

window.onload = function() {
    renderTags();
    renderStepsBuilder();
    updatePreview();
};

function addDasarHukum() {
    var inputEl = document.getElementById('inpDasarHukum');
    var val = inputEl.value.trim();
    if(val !== '') {
        dasarHukumList.push(val);
        inputEl.value = '';
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
    var inputEl = document.getElementById('inpKeterkaitan');
    var val = inputEl.value.trim();
    if(val !== '') {
        keterkaitanList.push(val);
        inputEl.value = '';
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
    var inputEl = document.getElementById('inpNamaPelaksana');
    var val = inputEl.value.trim();
    if(val !== '') {
        pelaksanaList.push(val);
        inputEl.value = '';
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
    var htmlDasar = '';
    for (var i = 0; i < dasarHukumList.length; i++) {
        htmlDasar += '<div class="tag-badge">' + dasarHukumList[i] + ' <i class="fa-solid fa-xmark" onclick="removeDasar(' + i + ')"></i></div>';
    }
    document.getElementById('listDasarHukum').innerHTML = htmlDasar;
    
    var htmlKet = '';
    for (var j = 0; j < keterkaitanList.length; j++) {
        htmlKet += '<div class="tag-badge">' + keterkaitanList[j] + ' <i class="fa-solid fa-xmark" onclick="removeKeterkaitan(' + j + ')"></i></div>';
    }
    document.getElementById('listKeterkaitan').innerHTML = htmlKet;
    
    var htmlPel = '';
    for (var k = 0; k < pelaksanaList.length; k++) {
        htmlPel += '<div class="tag-badge">' + pelaksanaList[k] + ' <i class="fa-solid fa-xmark" onclick="removePelaksana(' + k + ')"></i></div>';
    }
    document.getElementById('listPelaksana').innerHTML = htmlPel;
}

function addStepRow() {
    stepsList.push({ 
        kegiatan: "Uraian kegiatan baru...", 
        pelaksana: pelaksanaList[0] || "Petugas", 
        jenis: "process", 
        panah: "one-way",
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

// Fungsi Bersihkan Langkah yang dideklarasikan secara global
function clearSteps() {
    if (confirm("Apakah Anda yakin ingin menghapus semua langkah SOP?")) {
        stepsList = [];
        renderStepsBuilder();
        updatePreview();
    }
}

function renderStepsBuilder() {
    var html = '';
    for (var i = 0; i < stepsList.length; i++) {
        var s = stepsList[i];
        var options = '';
        for (var p = 0; p < pelaksanaList.length; p++) {
            var selected = (s.pelaksana === pelaksanaList[p]) ? 'selected' : '';
            options += '<option value="' + pelaksanaList[p] + '" ' + selected + '>' + pelaksanaList[p] + '</option>';
        }
        
        html += '<div class="step-builder-item">';
        html += '<h5>Langkah #' + (i+1) + ' <button class="btn btn-sm btn-danger" onclick="removeStep(' + i + ')"><i class="fa-solid fa-trash"></i></button></h5>';
        html += '<div class="form-group" style="margin-bottom:5px;"><label>Uraian Kegiatan</label><input type="text" value="' + s.kegiatan + '" oninput="stepsList[' + i + '].kegiatan=this.value; updatePreview()"></div>';
        html += '<div class="form-row" style="margin-bottom:5px;">';
        html += '<div><label>Pelaksana</label><select onchange="stepsList[' + i + '].pelaksana=this.value; updatePreview()">' + options + '</select></div>';
        html += '<div><label>Simbol</label><select onchange="stepsList[' + i + '].jenis=this.value; renderStepsBuilder(); updatePreview()">';
        html += '<option value="start" ' + (s.jenis === 'start' ? 'selected' : '') + '>Terminator (Mulai/Selesai)</option>';
        html += '<option value="process" ' + (s.jenis === 'process' ? 'selected' : '') + '>Proses (Kotak)</option>';
        html += '<option value="decision" ' + (s.jenis === 'decision' ? 'selected' : '') + '>Keputusan (Belah Ketupat)</option>';
        html += '</select></div>';
        html += '</div>';
        
        html += '<div class="form-row" style="margin-bottom:5px;">';
        html += '<div><label>Konektor Panah</label><select onchange="stepsList[' + i + '].panah=this.value; updatePreview()">';
        html += '<option value="one-way" ' + (s.panah === 'one-way' ? 'selected' : '') + '>Panah 1 Arah (Kebawah)</option>';
        html += '<option value="two-way" ' + (s.panah === 'two-way' ? 'selected' : '') + '>Panah 2 Arah (Timbal Balik)</option>';
        html += '</select></div>';
        html += '<div><label>Waktu</label><input type="text" value="' + s.waktu + '" oninput="stepsList[' + i + '].waktu=this.value; updatePreview()"></div>';
        html += '</div>';

        html += '<div class="form-row">';
        html += '<div style="grid-column: span 2;"><label>Output</label><input type="text" value="' + s.output + '" oninput="stepsList[' + i + '].output=this.value; updatePreview()"></div>';
        html += '</div>';
        html += '</div>';
    }
    document.getElementById('stepsBuilderContainer').innerHTML = html;
}

function updatePreview() {
    var pemda = document.getElementById('cfgPemda').value;
    var dinas = document.getElementById('cfgDinas').value;
    var puskesmas = document.getElementById('cfgPuskesmas').value;
    var kaPuskesmas = document.getElementById('cfgKaPuskesmas').value;
    var nipKa = document.getElementById('cfgNipKa').value;

    var judul = document.getElementById('inpJudul').value;
    var noSOP = document.getElementById('inpNoSOP').value;
    var tahun = document.getElementById('inpTahun').value;
    var tglBuat = document.getElementById('inpTglBuat').value;
    var tglEfektif = document.getElementById('inpTglEfektif').value;
    var orientasi = document.getElementById('inpOrientasi').value;

    var formatNoSOP = '400.7/' + noSOP + '/SOP/430.9.3.15/' + tahun;

    document.getElementById('vPemda').innerText = pemda;
    document.getElementById('vDinas').innerText = dinas;
    document.getElementById('vPuskesmas').innerText = puskesmas;
    document.getElementById('vNoSOP').innerText = formatNoSOP;
    document.getElementById('vTglBuat').innerText = tglBuat;
    document.getElementById('vTglEfektif').innerText = tglEfektif;
    document.getElementById('vJudulSOP').innerText = judul.toUpperCase();
    document.getElementById('vJabatanPengesah').innerText = 'Kepala ' + puskesmas;
    document.getElementById('vNamaKa').innerText = kaPuskesmas;
    document.getElementById('vNipKa').innerText = 'NIP. ' + nipKa;

    var htmlDasarList = '';
    for (var d = 0; d < dasarHukumList.length; d++) {
        htmlDasarList += '<li>' + dasarHukumList[d] + '</li>';
    }
    document.getElementById('vListDasar').innerHTML = htmlDasarList;

    var htmlKetList = '';
    for (var k = 0; k < keterkaitanList.length; k++) {
        htmlKetList += '<li>' + keterkaitanList[k] + '</li>';
    }
    document.getElementById('vListKeterkaitan').innerHTML = htmlKetList;

    document.getElementById('vPeringatan').innerText = document.getElementById('inpPeringatan').value;
    document.getElementById('vKualifikasi').innerText = document.getElementById('inpKualifikasi').value;
    document.getElementById('vPeralatan').innerText = document.getElementById('inpPeralatan').value;
    document.getElementById('vPencatatan').innerText = document.getElementById('InpPencatatan').value;

    var pages = document.querySelectorAll('.a4-page');
    for (var pg = 0; pg < pages.length; pg++) {
        pages[pg].className = 'a4-page ' + orientasi;
    }

    var thGroup = document.getElementById('thPelaksanaGroup');
    thGroup.setAttribute('colspan', pelaksanaList.length || 1);
    
    var subHead = '';
    for (var h = 0; h < pelaksanaList.length; h++) {
        subHead += '<th style="min-width: 85px; font-size:8.5px;">' + pelaksanaList[h] + '</th>';
    }
    document.getElementById('trHeadRow2').innerHTML = subHead;

    var bodyHtml = '';
    for (var st = 0; st < stepsList.length; st++) {
        var sItem = stepsList[st];
        var pelaksanaCells = '';
        for (var pc = 0; pc < pelaksanaList.length; pc++) {
            if (sItem.pelaksana === pelaksanaList[pc]) {
                var shapeClass = 'shape-process';
                if (sItem.jenis === 'start') shapeClass = 'shape-start';
                else if (sItem.jenis === 'decision') shapeClass = 'shape-decision';

                // Shape 100% bersih tanpa teks
                var shapeHtml = '<div class="flow-shape ' + shapeClass + '"></div>';

                // Render panah penghubung antar shape jika bukan langkah terakhir
                if (st < stepsList.length - 1) {
                    var arrowType = sItem.panah || 'one-way';
                    shapeHtml += '<div class="shape-connector ' + arrowType + '"></div>';
                }

                pelaksanaCells += '<td style="text-align: center; vertical-align: middle; padding:4px 2px;">' + shapeHtml + '</td>';
            } else {
                pelaksanaCells += '<td></td>';
            }
        }

        bodyHtml += '<tr>';
        bodyHtml += '<td style="text-align: center;">' + (st+1) + '</td>';
        bodyHtml += '<td>' + sItem.kegiatan + '</td>';
        bodyHtml += pelaksanaCells;
        bodyHtml += '<td style="font-size: 8px;">' + (sItem.kelengkapan || '-') + '</td>';
        bodyHtml += '<td style="font-size: 8px; text-align: center;">' + (sItem.waktu || '-') + '</td>';
        bodyHtml += '<td style="font-size: 8px;">' + (sItem.output || '-') + '</td>';
        bodyHtml += '<td style="font-size: 8px;">' + (sItem.jenis === 'decision' ? 'Keputusan' : '-') + '</td>';
        bodyHtml += '</tr>';
    }
    document.getElementById('tbodySteps').innerHTML = bodyHtml;
}
