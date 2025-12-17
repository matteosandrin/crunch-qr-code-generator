import QRCode from 'https://esm.sh/qrcode@1.5.3';

let memberId = null;
let updateInterval = null;

const urlParams = new URLSearchParams(window.location.search);
const urlMemberId = urlParams.get('id');
if (urlMemberId) {
    document.getElementById('id').value = urlMemberId;
}

function formatTimestamp(date) {
    const pad = n => n.toString().padStart(2, '0');
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const year = date.getUTCFullYear();
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${month}${day}${year}-${hours}${minutes}${seconds}`;
}

function generateQRString() {
    const timestamp = formatTimestamp(new Date());
    return `${memberId}/mobile/${timestamp}`;
}


async function updateQRCode() {
    const textEncoder = new TextEncoder();
    const qrString = generateQRString();
    const dataBuffer = textEncoder.encode(qrString);
    const canvas = document.getElementById('qr-code');
    
    await QRCode.toCanvas(canvas, [{data: dataBuffer, mode: 'byte'}], {
        version: 3,
        errorCorrectionLevel: 'L',
        width: 200,
        margin: 0,
        color: {
            dark: '#000000',
            light: '#ffffff'
        },
    });
    canvas.style.removeProperty('width');
    canvas.style.removeProperty('height');
    
    const now = new Date();
    document.getElementById('timestamp').textContent =
        `Updated: ${now.toLocaleString()}`;
    document.getElementById('qr-string').textContent = qrString;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.animation = 'none';
    progressBar.offsetHeight; // trigger reflow
    progressBar.style.animation = 'countdown 15s linear';
    console.log(qrString);
}

function startDisplay() {
    memberId = document.getElementById('id').value.trim();
    if (!memberId) {
        alert('Please enter a Member ID');
        return;
    }
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('qr-container').style.display = 'block';
    updateQRCode();
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(updateQRCode, 15000);
}

if (urlMemberId) {
    startDisplay();
}