// =======================================
// Fetch Presets from Server
// =======================================
async function loadPresets() {
  try {
    const res = await fetch("/presets"); // Endpoint dari server.js
    const presets = await res.json();

    const container = document.getElementById("presets");
    container.innerHTML = "";

    presets.forEach(p => {
      const div = document.createElement("div");
      div.className = "preset";
      div.innerHTML = `
        <h3>${p.judul}</h3>
        <video src="${p.video}" muted autoplay loop></video>
        <p>
          <a href="${p.xml}" target="_blank">XML</a>
          <a href="${p.preset5mb}" target="_blank">5MB</a>
        </p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetch presets:", err);
    const container = document.getElementById("presets");
    container.innerHTML = "<p>Gagal load preset, coba refresh halaman.</p>";
  }
}

// Load pertama kali
loadPresets();

// Refresh otomatis setiap 10 detik
setInterval(loadPresets, 10000);