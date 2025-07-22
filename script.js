// --- Koneksi ke Printer Bluetooth Blueprint ---
const connectBtn = document.getElementById('connectPrinter');
let blueprintDevice = null;

if (connectBtn && navigator.bluetooth) {
    connectBtn.addEventListener('click', async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: 'Blue' }, // Ganti sesuai nama printer jika perlu
                ],
                optionalServices: [0x1101] // SPP UUID, tidak semua printer support, bisa dikosongkan jika error
            });
            blueprintDevice = device;
            alert('Printer terdeteksi: ' + device.name + '\nSilakan lanjutkan proses print.');
            // Untuk pengiriman data ke printer, perlu implementasi lebih lanjut sesuai service/characteristic printer
        } catch (e) {
            if (e && e.name === 'NotFoundError') {
                // User cancel, tidak perlu alert
                return;
            }
            alert('Gagal konek: ' + e);
        }
    });
} else if (connectBtn) {
    connectBtn.disabled = true;
    connectBtn.textContent = 'Bluetooth tidak didukung browser ini';
}
// --- END koneksi printer ---
document.getElementById('resiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        namaPengirim: form.namaPengirim.value,
        nomorPengirim: form.nomorPengirim.value,
        namaPenerima: form.namaPenerima.value,
        nomorPenerima: form.nomorPenerima.value,
        alamatPenerima: form.alamatPenerima.value,
        ekspedisi: form.ekspedisi.value,
        pembayaran: form.pembayaran.value
    };
    const resiDiv = document.getElementById('resiOutput');
    resiDiv.innerHTML = `
        <h2>RESI PENGIRIMAN</h2>
        <hr>
        <b>Ekspedisi:</b> ${data.ekspedisi}<br>
        <b>Pembayaran:</b> ${data.pembayaran}<br><br>
        <b>Pengirim</b><br>
        Nama: ${data.namaPengirim}<br>
        Nomor: ${data.nomorPengirim}<br><br>
        <b>Penerima</b><br>
        Nama: ${data.namaPenerima}<br>
        Nomor: ${data.nomorPenerima}<br>
        Alamat: ${data.alamatPenerima.replace(/\n/g, '<br>')}<br>
        <hr>
        <div class="resi-meta">Generated: ${new Date().toLocaleString()}</div>
    `;
    resiDiv.style.display = 'block';
    document.getElementById('downloadPDF').style.display = 'block';
    // Tampilkan tombol print
    if (document.getElementById('printResi')) {
        document.getElementById('printResi').style.display = '';
    }
    setResiSize();
});


// Download PDF
document.getElementById('downloadPDF').addEventListener('click', function() {
    const resiDiv = document.getElementById('resiOutput');
    if (typeof html2pdf === 'undefined') {
        alert('Fitur download PDF membutuhkan html2pdf.js. Silakan tambahkan library html2pdf.js!');
        return;
    }
    // Ambil ukuran kertas dari input
    const w = parseInt(document.getElementById('paperWidth').value) || 150;
    const h = parseInt(document.getElementById('paperHeight').value) || 100;
    resiDiv.style.display = 'block';
    // Tambahkan class khusus agar style PDF sama seperti print lama
    resiDiv.classList.add('pdf-export');
    resiDiv.scrollIntoView({behavior: 'auto', block: 'center'});
    setTimeout(function() {
        html2pdf().set({
            margin: 0,
            filename: 'resi_pengiriman.pdf',
            html2canvas: { scale: 2, backgroundColor: '#fff' },
            jsPDF: { unit: 'mm', format: [w, h], orientation: w > h ? 'landscape' : 'portrait' }
        }).from(resiDiv).save().then(() => {
            resiDiv.classList.remove('pdf-export');
        }).catch(() => {
            resiDiv.classList.remove('pdf-export');
        });
    }, 400);
});

// --- Fitur print langsung dan atur ukuran kertas ---
const resiOutput = document.getElementById('resiOutput');
const printBtn = document.getElementById('printResi');
const paperWidthInput = document.getElementById('paperWidth');
const paperHeightInput = document.getElementById('paperHeight');

function setResiSize() {
    const w = parseInt(paperWidthInput.value) || 150;
    const h = parseInt(paperHeightInput.value) || 100;
    resiOutput.style.width = w + 'mm';
    resiOutput.style.height = h + 'mm';
    // Update print CSS via style tag
    let styleTag = document.getElementById('dynamicPrintStyle');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamicPrintStyle';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `@media print { .resi-output { width: ${w}mm !important; height: ${h}mm !important; } @page { size: ${w}mm ${h}mm; } }`;
}

if (paperWidthInput && paperHeightInput) {
    paperWidthInput.addEventListener('change', setResiSize);
    paperHeightInput.addEventListener('change', setResiSize);
}

if (printBtn) {
    printBtn.addEventListener('click', function() {
        setResiSize();
        window.print();
    });
}
