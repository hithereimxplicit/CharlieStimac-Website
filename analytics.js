

// analytics.js
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1332866890422419569/UZka2JIR258ZWiDCD0SZ3X2l_saiht8ySTmGSHn8xB3fqO4v84NSRjPBVeYOxU0u_Cgu";

// Prevent refresh spam (counts once per browser per page)
const COUNT_UNIQUE_PER_BROWSER = true;

function safe(v, max = 150) {
  v = (v ?? "").toString();
  return v.length > max ? v.slice(0, max) + "…" : v;
}

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unknown";
  }
}

async function sendView() {
  try {
    const path = location.pathname || "/";
    const ref = document.referrer ? new URL(document.referrer).hostname : "direct";
    const ua = navigator.userAgent || "unknown";

    if (COUNT_UNIQUE_PER_BROWSER) {
      const key = `viewed:${path}`;
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    }

    const ip = await getIP();

const BRAND_IMG = "https://i.imgur.com/W7MkDYe.png";

const payload = {
  // Ping everyone (remove or gate later if needed)
  content: "@everyone",

  username: "charliestimac.site",
  avatar_url: BRAND_IMG,

  embeds: [
    {
      author: {
        name: "charliestimac.site • New View",
        icon_url: BRAND_IMG
      },
      title: "👀 Page Viewed",
      description: "**A visitor just opened your site**",
      color: 0x2c2f33, // #2c2f33
      thumbnail: {
        url: BRAND_IMG
      },
      fields: [
        { name: "📄 Page", value: `\`${safe(path)}\``, inline: true },
        { name: "🌍 IP", value: `\`${ip}\``, inline: true },
        { name: "🔗 Referrer", value: ref === "direct" ? "_Direct_" : ref, inline: true }
      ],
      footer: {
        text: "charliestimac.site analytics",
        icon_url: BRAND_IMG
      },
      timestamp: new Date().toISOString()
    }
  ]
};

    fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {
    // Never break the page
  }
}

window.addEventListener("load", sendView);