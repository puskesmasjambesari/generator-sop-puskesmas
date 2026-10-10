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
    { kegiatan: "Menerima berkas persyaratan dan meneliti kelengkapan identitas dari pemohon", pelaksana: "Petugas Pendaftaran", jenis: "start", waktu: "3 Menit", kelengkapan: "KTP / Rujukan", output: "Berkas diteliti", q1: "", target1: "", q2: "", target2: "" },
    { kegiatan: "Apakah kelengkapan persyaratan dan data rekam medis lengkap?", pelaksana: "Petugas Pendaftaran", jenis: "decision", waktu: "1 Menit", kelengkapan: "Berkas", output: "Keputusan", q1: "Ya -> Lgkh 6", target1: "6", q2: "Tidak -> Lgkh 2", target2: "2" },
    { kegiatan: "Menginput data rekam medis ke dalam sistem SIMPUS dan membuat kartu rawat inap", pelaksana: "Petugas Pendaftaran", jenis: "process", waktu: "5 Menit", kelengkapan: "SIMPUS", output: "Surat Masuk", q1: "", target1: "", q2: "", target2: "" },
    { kegiatan: "Melakukan serah terima pasien dan berkas rekam medis ke ruang perawatan", pelaksana: "Perawat Rawat Inap", jenis: "start", waktu: "5 Menit", kelengkapan: "Berkas", output: "Pasien diterima", q1: "", target1: "", q2: "", target2: "" }
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
        waktu: "5 Menit", 
        kelengkapan: "Dokumen", 
        output: "Hasil",
        q1: "",
        target1: "",
        q2: "",
        target2: ""
    });
    renderStepsBuilder();
    updatePreview();
}

function removeStep(i) {
    stepsList.splice(i, 1);
    renderStepsBuilder();
    updatePreview();
}

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
        html += '<div><label>Waktu</label><input type="text" value="' + s.waktu + '" oninput="stepsList[' + i + '].waktu=this.value; updatePreview()"></div>';
        html += '<div><label>Output</label><input type="text" value="' + s.output + '" oninput="stepsList[' + i + '].output=this.value; updatePreview()"></div>';
        html += '</div>';

        if(s.jenis === 'decision') {
            html += '<div class="form-row" style="margin-bottom:5px;">';
            html += '<div><label>Pertanyaan 1 (Cabang A)</label><input type="text" value="' + (s.q1 || '') + '" oninput="stepsList[' + i + '].q1=this.value; updatePreview()" placeholder="Cth: Ya -> Lgkh 6"></div>';
            html += '<div><label>Target Langkah 1</label><input type="text" value="' + (s.target1 || '') + '" oninput="stepsList[' + i + '].target1=this.value; updatePreview()" placeholder="Cth: 6"></div>';
            html += '</div>';
            html += '<div class="form-row" style="margin-bottom:5px;">';
            html += '<div><label>Pertanyaan 2 (Cabang B)</label><input type="text" value="' + (s.q2 || '') + '" oninput="stepsList[' + i + '].q2=this.value; updatePreview()" placeholder="Cth: Tidak -> Lgkh 2"></div>';
            html += '<div><label>Target Langkah 2</label><input type="text" value="' + (s.target2 || '') + '" oninput="stepsList[' + i + '].target2=this.value; updatePreview()" placeholder="Cth: 2"></div>';
            html += '</div>';
        }
        
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
    var tglRevisi = document.getElementById('inpTglRevisi').value;
    var tglEfektif = document.getElementById('inpTglEfektif').value;
    var orientasi = document.getElementById('inpOrientasi').value;

    var formatNoSOP = '400.7/' + noSOP + '/SOP/430.9.3.15/' + tahun;
    var peringatan = document.getElementById('inpPeringatan').value;
    var kualifikasi = document.getElementById('inpKualifikasi').value;
    var peralatan = document.getElementById('inpPeralatan').value;
    var pencatatan = document.getElementById('InpPencatatan').value;

    var htmlDasarList = dasarHukumList.map(function(d){return '<li>'+d+'</li>'}).join('');
    var htmlKetList = keterkaitanList.map(function(k){return '<li>'+k+'</li>'}).join('');

    var stepsPerPage = 7;
    var totalPages = Math.ceil(stepsList.length / stepsPerPage) || 1;
    var container = document.getElementById('previewAreaContainer');
    container.innerHTML = '';

    for (var pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        var startIdx = pageIdx * stepsPerPage;
        var endIdx = Math.min(startIdx + stepsPerPage, stepsList.length);
        var pageSteps = stepsList.slice(startIdx, endIdx);

        var pageDiv = document.createElement('div');
        pageDiv.className = 'a4-page ' + orientasi;
        
        var headerHtml = '';
        if (pageIdx === 0) {
            headerHtml = '<table class="sop-header-table">' +
                '<tr>' +
                    '<td rowspan="4" class="logo-cell"><img src="Lambang_Bondowoso.jpg" alt="Logo" style="width: 55px; height: auto; display: block; margin: 0 auto;" /></td>' +
                    '<td rowspan="4" class="instansi-cell">' +
                        '<div>' + pemda + '</div>' +
                        '<div>' + dinas + '</div>' +
                        '<div style="font-size: 11px; margin-top:2px;">' + puskesmas + '</div>' +
                    '</td>' +
                    '<td class="meta-lbl">NOMOR SOP</td>' +
                    '<td class="meta-val">' + formatNoSOP + '</td>' +
                '</tr>' +
                '<tr><td class="meta-lbl">TGL. PEMBUATAN</td><td class="meta-val">' + tglBuat + '</td></tr>' +
                '<tr><td class="meta-lbl">TGL. REVISI</td><td class="meta-val">' + (tglRevisi ? tglRevisi : '-') + '</td></tr>' +
                '<tr><td class="meta-lbl">TGL. EFEKTIF</td><td class="meta-val">' + tglEfektif + '</td></tr>' +
                '<tr>' +
                    '<td colspan="2" class="sop-title-box">' +
                        '<div style="font-size: 8px; color: #555;">STANDAR OPERASIONAL PROSEDUR (SOP)</div>' +
                        '<div style="font-size: 11px; font-weight: bold; margin-top: 2px;">' + judul.toUpperCase() + '</div>' +
                    '</td>' +
                    '<td class="meta-lbl">DISAHKAN OLEH</td>' +
                    '<td class="sig-cell">' +
                        '<div style="font-size: 8px;">KEPALA ' + puskesmas.toUpperCase() + '</div>' +
                        '<div style="height: 35px;"></div>' +
                        '<div style="font-weight: bold; text-decoration: underline; font-size: 9px;">' + kaPuskesmas + '</div>' +
                        '<div style="font-size: 8px;">NIP. ' + nipKa + '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>' +
            '<table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">' +
                '<tr>' +
                    '<td style="width: 50%; vertical-align: top; border: 1px solid #000; padding: 4px;">' +
                        '<div class="section-box-title">DASAR HUKUM</div>' +
                        '<ol style="padding-left: 12px; font-size: 8.5px; line-height: 1.3;">' + htmlDasarList + '</ol>' +
                    '</td>' +
                    '<td style="width: 50%; vertical-align: top; border: 1px solid #000; padding: 4px;">' +
                        '<div class="section-box-title">KUALIFIKASI PELAKSANA</div>' +
                        '<div style="font-size: 8.5px; white-space: pre-line; line-height: 1.3;">' + kualifikasi + '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 4px;">' +
                        '<div class="section-box-title">KETERKAITAN</div>' +
                        '<ul style="padding-left: 12px; font-size: 8.5px; line-height: 1.3;">' + htmlKetList + '</ul>' +
                    '</td>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 4px;">' +
                        '<div class="section-box-title">PERALATAN / PERLENGKAPAN</div>' +
                        '<div style="font-size: 8.5px; white-space: pre-line; line-height: 1.3;">' + peralatan + '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 4px;">' +
                        '<div class="section-box-title">PERINGATAN</div>' +
                        '<div style="font-size: 8.5px; line-height: 1.3;">' + peringatan + '</div>' +
                    '</td>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 4px;">' +
                        '<div class="section-box-title">PENCATATAN DAN PENDATAAN</div>' +
                        '<div style="font-size: 8.5px; line-height: 1.3;">' + pencatatan + '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>';
        } else {
            headerHtml = '<div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:right;">(Lanjutan Halaman ' + (pageIdx + 1) + ' — ' + judul.toUpperCase() + ')</div>';
        }

        var pelaksanaTh = '';
        for (var h = 0; h < pelaksanaList.length; h++) {
            pelaksanaTh += '<th style="min-width: 85px; font-size:8.5px;">' + pelaksanaList[h] + '</th>';
        }

        var tableHtml = headerHtml +
            '<table class="sop-table" style="position:relative;">' +
            '<thead>' +
                '<tr>' +
                    '<th rowspan="2" style="width: 25px;">No</th>' +
                    '<th rowspan="2" style="width: 200px;">Uraian Kegiatan</th>' +
                    '<th colspan="' + (pelaksanaList.length || 1) + '">Pelaksana</th>' +
                    '<th colspan="3">Mutu Baku</th>' +
                    '<th rowspan="2" style="width: 90px;">Keterangan</th>' +
                '</tr>' +
                '<tr>' + pelaksanaTh + '<th>Kelengkapan</th><th>Waktu</th><th>Output</th></tr>' +
            '</thead>' +
            '<tbody>';

        for (var st = 0; st < pageSteps.length; st++) {
            var globalIdx = startIdx + st;
            var sItem = pageSteps[st];
            var pelaksanaCells = '';
            
            for (var pc = 0; pc < pelaksanaList.length; pc++) {
                if (sItem.pelaksana === pelaksanaList[pc]) {
                    var shapeClass = 'shape-process';
                    if (sItem.jenis === 'start') shapeClass = 'shape-start';
                    else if (sItem.jenis === 'decision') shapeClass = 'shape-decision';

                    pelaksanaCells += '<td style="text-align: center; vertical-align: middle; padding:6px 2px;" data-step-idx="' + globalIdx + '" data-pelaksana-idx="' + pc + '">' +
                        '<div class="flow-shape ' + shapeClass + '" id="shape-' + globalIdx + '"></div>' +
                    '</td>';
                } else {
                    pelaksanaCells += '<td></td>';
                }
            }

            var ketText = '-';
            if (sItem.jenis === 'decision') {
                var q1Str = sItem.q1 ? (sItem.q1 + ' (Lgkh ' + (sItem.target1 || '-') + ')') : '';
                var q2Str = sItem.q2 ? (sItem.q2 + ' (Lgkh ' + (sItem.target2 || '-') + ')') : '';
                ketText = [q1Str, q2Str].filter(Boolean).join('; ') || 'Keputusan';
            }

            tableHtml += '<tr>' +
                '<td style="text-align: center;">' + (globalIdx + 1) + '</td>' +
                '<td>' + sItem.kegiatan + '</td>' +
                pelaksanaCells +
                '<td style="font-size: 8px;">' + (sItem.kelengkapan || '-') + '</td>' +
                '<td style="font-size: 8px; text-align: center;">' + (sItem.waktu || '-') + '</td>' +
                '<td style="font-size: 8px;">' + (sItem.output || '-') + '</td>' +
                '<td style="font-size: 8px;">' + ketText + '</td>' +
            '</tr>';
        }

        tableHtml += '</tbody></table>';

        if (pageIdx < totalPages - 1) {
            tableHtml += '<div style="text-align:center; font-size:9px; font-weight:bold; margin-top:5px; border:1px dashed #000; padding:3px; background:#fafafa;">' +
                '<i class="fa-solid fa-arrow-down"></i> BERSAMBUNG KE HALAMAN ' + (pageIdx + 2) + ' (OFF-PAGE CONNECTOR) <i class="fa-solid fa-arrow-down"></i>' +
            '</div>';
        }

        pageDiv.innerHTML = tableHtml;
        container.appendChild(pageDiv);
    }

    setTimeout(drawConnectors, 50);
}

function drawConnectors() {
    var oldSvg = document.getElementById('connectorSvgOverlay');
    if (oldSvg) oldSvg.remove();

    var firstTable = document.querySelector('.sop-table');
    if (!firstTable) return;

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute('id', 'connectorSvgOverlay');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '10';

    var defs = document.createElementNS(svgNS, "defs");
    var marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '5');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    var markerPath = document.createElementNS(svgNS, "path");
    markerPath.setAttribute('d', 'M0,0 L6,3 L0,6 Z');
    markerPath.setAttribute('fill', '#000');
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    for (var i = 0; i < stepsList.length - 1; i++) {
        var currShape = document.getElementById('shape-' + i);
        var nextShape = document.getElementById('shape-' + (i + 1));

        if (currShape && nextShape) {
            var rect1 = currShape.getBoundingClientRect();
            var rect2 = nextShape.getBoundingClientRect();
            var tableRect = firstTable.getBoundingClientRect();

            var x1 = rect1.left + rect1.width / 2 - tableRect.left;
            var y1 = rect1.bottom - tableRect.top;
            var x2 = rect2.left + rect2.width / 2 - tableRect.left;
            var y2 = rect2.top - tableRect.top;

            var path = document.createElementNS(svgNS, "path");
            var dAttr = "";

            if (Math.abs(x1 - x2) < 3) {
                dAttr = "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
            } else {
                var midY = y1 + (y2 - y1) / 2;
                dAttr = "M " + x1 + " " + y1 + " L " + x1 + " " + midY + " L " + x2 + " " + midY + " L " + x2 + " " + y2;
            }

            path.setAttribute('d', dAttr);
            path.setAttribute('stroke', '#000');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            svg.appendChild(path);
        }
    }

    if (firstTable.parentElement) {
        firstTable.parentElement.style.position = 'relative';
        firstTable.parentElement.appendChild(svg);
    }
}
