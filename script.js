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
        <h2 style="text-align:center;">RESI PENGIRIMAN</h2>
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
        <div style="position:absolute;bottom:10px;right:10px;font-size:10px;">Generated: ${new Date().toLocaleString()}</div>
    `;
    resiDiv.style.display = 'block';
    document.getElementById('downloadPDF').style.display = 'block';
});

// Download PDF
// Menggunakan html2pdf.js
// Pastikan sudah include library html2pdf jika ingin download PDF

document.getElementById('downloadPDF').addEventListener('click', function() {
    const resiDiv = document.getElementById('resiOutput');
    if (typeof html2pdf === 'undefined') {
        alert('Fitur download PDF membutuhkan html2pdf.js. Silakan tambahkan library html2pdf.js!');
        return;
    }
    // Pastikan resiDiv sudah tampil
    resiDiv.style.display = 'block';
    // Tambahkan style khusus agar html2pdf bisa menangkap isi dengan baik
    resiDiv.style.background = '#fff';
    resiDiv.style.border = '2px solid #333';
    // Scroll ke resi agar benar-benar rendered
    resiDiv.scrollIntoView({behavior: 'auto', block: 'center'});
    // Beri delay agar render benar
    setTimeout(function() {
        html2pdf().set({
            margin: 0,
            filename: 'resi_pengiriman.pdf',
            html2canvas: { scale: 2, backgroundColor: '#fff' },
            jsPDF: { unit: 'mm', format: [150, 100], orientation: 'landscape' }
        }).from(resiDiv).save();
    }, 400);
});
