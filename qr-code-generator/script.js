const qrText = document.getElementById("qr-text");
const sizes = document.getElementById("sizes");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrContainer = document.getElementById('qrContainer');
const particles = document.getElementById('particles');

let size = sizes.value;

// Floating hearts and bubbles animation
function createParticle(emoji, className, duration) {
  const particle = document.createElement('div');
  particle.innerHTML = emoji;
  particle.className = className;
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDuration = (Math.random() * 3 + duration) + 's';
  particle.style.fontSize = (Math.random() * 10 + 16) + 'px';
  particles.appendChild(particle);

  // Remove after animation
  setTimeout(() => {
    particle.remove();
  }, duration * 1000 + 1000);
}

function spawnParticles() {
  // Hearts
  for (let i = 0; i < 3; i++) {
    createParticle('💖', 'heart', 6);
  }
  // Bubbles (🌸 ✨)
  setTimeout(() => createParticle('🌸', 'bubble', 8), 1000);
  setTimeout(() => createParticle('✨', 'bubble', 7), 2000);
}

// Spawn particles on load and interactions
window.addEventListener('load', () => {
  spawnParticles();
  setInterval(spawnParticles, 8000); // Continuous gentle floating
});

qrText.addEventListener('input', function() {
  spawnParticles();
  if (qrText.value.length > 0) {
    generateQRCode();
  }
});

generateBtn.addEventListener("click", function(e) {
  e.preventDefault();
  spawnParticles();
  if (qrText.value.length > 0) {
    generateQRCode();
  } else {
    alert("Enter the text or URL to generate your QR code 💖");
  }
});

sizes.addEventListener('change', function(e) {
  size = e.target.value;
  if (qrText.value.length > 0) {
    generateQRCode();
  }
});

function generateQRCode() {
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: qrText.value,
    height: size,
    width: size,
    colorLight: "#fff",
    colorDark: "#000"
  });

  // Sparkle on QR generate
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createParticle('✨', 'bubble', 3), i * 200);
    }
  }, 500);
}

downloadBtn.addEventListener("click", function(e) {
  e.preventDefault();
  spawnParticles();
  const canvas = qrContainer.querySelector('canvas');
  if (canvas) {
    downloadBtn.href = canvas.toDataURL('image/png');
  } else {
    alert('Generate QR code first 💖');
  }
});

