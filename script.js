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
    { kegiatan: "Apakah kelengkapan persyaratan dan data rekam medis lengkap?", pelaksana: "Petugas Pendaftaran", jenis: "decision", waktu: "1 Menit", kelengkapan: "Berkas", output: "Keputusan", q1: "Ya", target1: "", q2: "Tidak", target2: "" },
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
            html += '<div><label>Label Pilihan 1 (Cth: Ya)</label><input type="text" value="' + (s.q1 || '') + '" oninput="stepsList[' + i + '].q1=this.value; updatePreview()" placeholder="Cth: Ya"></div>';
            html += '<div><label>Target Pilihan 1 (Kosong = Langkah Selanjutnya)</label><input type="text" value="' + (s.target1 || '') + '" oninput="stepsList[' + i + '].target1=this.value; updatePreview()" placeholder="Default: Langkah + 1"></div>';
            html += '</div>';
            html += '<div class="form-row" style="margin-bottom:5px;">';
            html += '<div><label>Label Pilihan 2 (Cth: Tidak)</label><input type="text" value="' + (s.q2 || '') + '" oninput="stepsList[' + i + '].q2=this.value; updatePreview()" placeholder="Cth: Tidak"></div>';
            html += '<div><label>Target Pilihan 2 (Kosong = Langkah Sebelumnya)</label><input type="text" value="' + (s.target2 || '') + '" oninput="stepsList[' + i + '].target2=this.value; updatePreview()" placeholder="Default: Langkah - 1"></div>';
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

    var formatNoSOP = '400.7/' + noSOP + '/SOP/430.9.3.15/' + tahun;
    var peringatan = document.getElementById('inpPeringatan').value;
    var kualifikasi = document.getElementById('inpKualifikasi').value;
    var peralatan = document.getElementById('inpPeralatan').value;
    var pencatatan = document.getElementById('InpPencatatan').value;

    var htmlDasarList = dasarHukumList.map(function(d){return '<li>'+d+'</li>'}).join('');
    var htmlKetList = keterkaitanList.map(function(k){return '<li>'+k+'</li>'}).join('');

    var stepsPerPage = 10;
    var totalPages = Math.ceil(stepsList.length / stepsPerPage) || 1;
    var container = document.getElementById('previewAreaContainer');
    container.innerHTML = '';

    for (var pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        var startIdx = pageIdx * stepsPerPage;
        var endIdx = Math.min(startIdx + stepsPerPage, stepsList.length);
        var pageSteps = stepsList.slice(startIdx, endIdx);

        var pageDiv = document.createElement('div');
        pageDiv.className = 'a4-page';
        
        var headerHtml = '';
        if (pageIdx === 0) {
            // Kotak header instansi menggunakan rowspan="5" tanpa garis pemisah internal sama sekali
            headerHtml = '<table class="sop-header-table">' +
                '<tr>' +
                    '<td rowspan="5" style="border: 1px solid #000; text-align: center; vertical-align: middle; padding: 6px; width: 42%;"> ' +
                        '<img src="Lambang_Bondowoso.jpg" alt="Logo" style="width: 38px; height: auto; display: block; margin: 0 auto 3px auto;" />' +
                        '<div style="font-weight: bold; font-size: 8.5px; line-height: 1.2;">' + pemda + '<br>' + dinas + '<br>' + puskesmas + '</div>' +
                    '</td>' +
                    '<td class="meta-lbl">NOMOR SOP</td>' +
                    '<td class="meta-val">' + formatNoSOP + '</td>' +
                '</tr>' +
                '<tr><td class="meta-lbl">TGL. PEMBUATAN</td><td class="meta-val">' + tglBuat + '</td></tr>' +
                '<tr><td class="meta-lbl">TGL. REVISI</td><td class="meta-val">' + (tglRevisi ? tglRevisi : '-') + '</td></tr>' +
                '<tr><td class="meta-lbl">TGL. EFEKTIF</td><td class="meta-val">' + tglEfektif + '</td></tr>' +
                '<tr>' +
                    '<td class="meta-lbl">DISAHKAN OLEH</td>' +
                    '<td class="sig-cell">' +
                        '<div style="font-size: 7px;">KEPALA ' + puskesmas.toUpperCase() + '</div>' +
                        '<div style="height: 20px;"></div>' +
                        '<div style="font-weight: bold; text-decoration: underline; font-size: 8px;">' + kaPuskesmas + '</div>' +
                        '<div style="font-size: 7px;">NIP. ' + nipKa + '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>' +
            '<div class="sop-title-box" style="margin-top: -1px;">' +
                'SOP ' + judul.toUpperCase() +
            '</div>' +
            '<table style="width: 100%; border-collapse: collapse; margin-bottom: 4px; margin-top: -1px;">' +
                '<tr>' +
                    '<td style="width: 50%; vertical-align: top; border: 1px solid #000; padding: 3px 4px;">' +
                        '<div class="section-box-title">DASAR HUKUM</div>' +
                        '<ol style="padding-left: 12px; font-size: 7.5px; line-height: 1.2; margin: 0;">' + htmlDasarList + '</ol>' +
                    '</td>' +
                    '<td style="width: 50%; vertical-align: top; border: 1px solid #000; padding: 3px 4px;">' +
                        '<div class="section-box-title">KUALIFIKASI PELAKSANA</div>' +
                        '<div style="font-size: 7.5px; white-space: pre-line; line-height: 1.2;">' + kualifikasi + '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 3px 4px;">' +
                        '<div class="section-box-title">KETERKAITAN</div>' +
                        '<ul style="padding-left: 12px; font-size: 7.5px; line-height: 1.2; margin: 0;">' + htmlKetList + '</ul>' +
                    '</td>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 3px 4px;">' +
                        '<div class="section-box-title">PERALATAN / PERLENGKAPAN</div>' +
                        '<div style="font-size: 7.5px; white-space: pre-line; line-height: 1.2;">' + peralatan + '</div>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 3px 4px;">' +
                        '<div class="section-box-title">PERINGATAN</div>' +
                        '<div style="font-size: 7.5px; line-height: 1.2;">' + peringatan + '</div>' +
                    '</td>' +
                    '<td style="vertical-align: top; border: 1px solid #000; padding: 3px 4px;">' +
                        '<div class="section-box-title">PENCATATAN DAN PENDATAAN</div>' +
                        '<div style="font-size: 7.5px; line-height: 1.2;">' + pencatatan + '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>';
        } else {
            headerHtml = '';
        }

        var pelaksanaTh = '';
        for (var h = 0; h < pelaksanaList.length; h++) {
            pelaksanaTh += '<th style="min-width: 55px; font-size:8px;">' + pelaksanaList[h] + '</th>';
        }

        var tableHtml = headerHtml +
            '<table class="sop-table" style="position:relative;" id="table-page-' + pageIdx + '">' +
            '<thead>' +
                '<tr>' +
                    '<th rowspan="2" style="width: 22px;">No</th>' +
                    '<th rowspan="2" style="width: 140px;">Uraian Kegiatan</th>' +
                    '<th colspan="' + (pelaksanaList.length || 1) + '">Pelaksana</th>' +
                    '<th colspan="3">Mutu Baku</th>' +
                    '<th rowspan="2" style="width: 80px;">Keterangan</th>' +
                '</tr>' +
                '<tr>' + pelaksanaTh + '<th style="width:42px;">Kelengkapan</th><th style="width:32px;">Waktu</th><th style="width:42px;">Output</th></tr>' +
            '</thead>' +
            '<tbody>';

        for (var st = 0; st < pageSteps.length; st++) {
            var globalIdx = startIdx + st;
            var sItem = pageSteps[st];
            var pelaksanaCells = '';
            
            for (var pc = 0; pc < pelaksanaList.length; pc++) {
                if (sItem.pelaksana === pelaksanaList[pc]) {
                    var shapeHtml = '<div class="flow-shape shape-process" id="shape-' + globalIdx + '"></div>';
                    if (sItem.jenis === 'start') {
                        shapeHtml = '<div class="flow-shape shape-start" id="shape-' + globalIdx + '"></div>';
                    } else if (sItem.jenis === 'decision') {
                        shapeHtml = '<div class="flow-shape shape-decision" id="shape-' + globalIdx + '"></div>';
                    }

                    // Segi lima off-page connector murni tanpa anak panah
                    if ((st === pageSteps.length - 1 && pageIdx < totalPages - 1) || (st === 0 && pageIdx > 0)) {
                        shapeHtml = '<div style="display:flex; justify-content:center; align-items:center; margin:2px auto;" id="shape-' + globalIdx + '">' +
                            '<svg width="18" height="13" viewBox="0 0 24 18" style="display:block; background:#fff;">' +
                                '<polygon points="0,0 24,0 24,12 12,18 0,12" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
                            '</svg>' +
                        '</div>';
                    }

                    pelaksanaCells += '<td style="text-align: center; vertical-align: middle; padding:2px 1px;" data-step-idx="' + globalIdx + '" data-pelaksana-idx="' + pc + '">' +
                        shapeHtml +
                    '</td>';
                } else {
                    pelaksanaCells += '<td></td>';
                }
            }

            var ketText = '-';
            if (sItem.jenis === 'decision') {
                var target1Val = (sItem.target1 !== undefined && sItem.target1 !== '' && !isNaN(sItem.target1)) ? parseInt(sItem.target1) : (globalIdx + 2);
                var target2Val = (sItem.target2 !== undefined && sItem.target2 !== '' && !isNaN(sItem.target2)) ? parseInt(sItem.target2) : (globalIdx);
                var q1Str = (sItem.q1 ? sItem.q1 : 'Ya') + ' → Lgkh ' + target1Val;
                var q2Str = (sItem.q2 ? sItem.q2 : 'Tidak') + ' → Lgkh ' + target2Val;
                ketText = q1Str + '; ' + q2Str;
            }

            tableHtml += '<tr>' +
                '<td style="text-align: center;">' + (globalIdx + 1) + '</td>' +
                '<td>' + sItem.kegiatan + '</td>' +
                pelaksanaCells +
                '<td style="font-size: 7px;">' + (sItem.kelengkapan || '-') + '</td>' +
                '<td style="font-size: 7px; text-align: center;">' + (sItem.waktu || '-') + '</td>' +
                '<td style="font-size: 7px;">' + (sItem.output || '-') + '</td>' +
                '<td style="font-size: 7px;">' + ketText + '</td>' +
            '</tr>';
        }

        tableHtml += '</tbody></table>';
        pageDiv.innerHTML = tableHtml;
        container.appendChild(pageDiv);
    }

    setTimeout(drawConnectors, 50);
}

function drawConnectors() {
    var oldSvgs = document.querySelectorAll('.connectorSvgOverlay');
    for (var o = 0; o < oldSvgs.length; o++) {
        oldSvgs[o].remove();
    }

    var pages = document.querySelectorAll('.a4-page');
    for (var p = 0; p < pages.length; p++) {
        var pageDiv = pages[p];
        var pageRect = pageDiv.getBoundingClientRect();

        var svgNS = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgNS, "svg");
        svg.className.baseVal = 'connectorSvgOverlay';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '10';

        var defs = document.createElementNS(svgNS, "defs");
        var marker = document.createElementNS(svgNS, "marker");
        marker.setAttribute('id', 'arrowhead-' + p);
        marker.setAttribute('markerWidth', '5');
        marker.setAttribute('markerHeight', '5');
        marker.setAttribute('refX', '4');
        marker.setAttribute('refY', '2.5');
        marker.setAttribute('orient', 'auto');
        var markerPath = document.createElementNS(svgNS, "path");
        markerPath.setAttribute('d', 'M0,0 L5,2.5 L0,5 Z');
        markerPath.setAttribute('fill', '#000');
        marker.appendChild(markerPath);
        defs.appendChild(marker);
        svg.appendChild(defs);

        function drawSinglePath(fromIdx, toIdx, labelText) {
            var el1 = document.getElementById('shape-' + fromIdx);
            var el2 = document.getElementById('shape-' + toIdx);
            if (!el1 || !el2) return;

            // Jangan gambar panah jika elemen adalah off-page connector (segi lima)
            if (el1.querySelector('polygon') || el2.querySelector('polygon')) return;

            var r1 = el1.getBoundingClientRect();
            var r2 = el2.getBoundingClientRect();

            var x1 = r1.left + r1.width / 2 - pageRect.left;
            var y1 = r1.bottom - pageRect.top;
            var x2 = r2.left + r2.width / 2 - pageRect.left;
            var y2 = r2.top - pageRect.top;

            var path = document.createElementNS(svgNS, "path");
            var dAttr = "";

            if (Math.abs(x1 - x2) < 3 && y2 > y1) {
                dAttr = "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
            } else if (y2 <= y1) {
                var offset = 14 + (fromIdx % 2) * 6;
                var sideX = Math.max(x1, x2) + offset;
                dAttr = "M " + x1 + " " + y1 + " L " + sideX + " " + y1 + " L " + sideX + " " + y2 + " L " + x2 + " " + y2;
            } else {
                var midY = y1 + (y2 - y1) / 2;
                dAttr = "M " + x1 + " " + y1 + " L " + x1 + " " + midY + " L " + x2 + " " + midY + " L " + x2 + " " + y2;
            }

            path.setAttribute('d', dAttr);
            path.setAttribute('stroke', '#000');
            path.setAttribute('stroke-width', '1.2');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', 'url(#arrowhead-' + p + ')');
            svg.appendChild(path);

            if (labelText) {
                var text = document.createElementNS(svgNS, "text");
                text.textContent = labelText;
                text.setAttribute('x', x1 + 4);
                text.setAttribute('y', y1 + 9);
                text.setAttribute('font-size', '6.5px');
                text.setAttribute('font-family', 'Arial');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', '#000');
                svg.appendChild(text);
            }
        }

        var startIdx = p * 10;
        var endIdx = Math.min(startIdx + 10, stepsList.length);

        for (var i = startIdx; i < endIdx; i++) {
            var s = stepsList[i];
            
            if (i === endIdx - 1 && p < totalPages - 1) continue;
            if (i === startIdx && p > 0) continue;

            if (s.jenis === 'decision') {
                var t1 = (s.target1 !== undefined && s.target1 !== '' && !isNaN(s.target1)) ? parseInt(s.target1) - 1 : i + 1;
                var lbl1 = (s.q1 ? s.q1 : 'Ya').trim();
                if (t1 >= 0 && t1 < stepsList.length) {
                    drawSinglePath(i, t1, lbl1);
                }

                var t2 = (s.target2 !== undefined && s.target2 !== '' && !isNaN(s.target2)) ? parseInt(s.target2) - 1 : Math.max(0, i - 1);
                var lbl2 = (s.q2 ? s.q2 : 'Tidak').trim();
                if (t2 >= 0 && t2 < stepsList.length) {
                    drawSinglePath(i, t2, lbl2);
                }
            } else {
                if (i + 1 < stepsList.length) {
                    drawSinglePath(i, i + 1, null);
                }
            }
        }

        pageDiv.style.position = 'relative';
        pageDiv.appendChild(svg);
    }
}
