# 🚀 SEO Commando

Browser-console SEO tool for your own sites (sarkariupdates.live, pdfpixel.tech, koi bhi).
Koi install nahi — bas console mein paste karo aur chalao.

## ✨ Features

- 🔍 **Sitemap Audit** — `/sitemap.xml` (ya robots.txt se) saare URLs padhta hai, har page check karta hai:
  - Title length (15–70)
  - Meta description (50–170)
  - Exactly 1 H1
  - Canonical link
  - `noindex` toh nahi lag gaya
  - OpenGraph title
  - Har page ko **score /6** + issue list
- 🚀 **IndexNow submit** — saare URLs ek click mein Bing/Yandex/Seznam ko bhejo (new jobs fast index!)
- 💾 **CSV download** — poori audit table Excel mein kholo
- 📋 **Report copy** — issue summary + worst 20 pages clipboard pe
- Progress bar + live log + draggable panel

## 🚀 Use kaise kare

1. Apni site kholo (jaise `https://sarkariupdates.live`)
2. `F12` → **Console**
3. Paste + Enter:

```js
fetch('https://raw.githubusercontent.com/anuragkumarnishad/seo-commando/main/seo-commando.js').then(r=>r.text()).then(eval)
```

4. **🔍 Sitemap Audit** dabao → progress dekho → **💾 CSV** / **📋 Report** lo
5. **🚀 IndexNow** ke liye pehle key chahiye (neeche dekho)

## 🔑 IndexNow key setup (ek baar)

1. Koi bhi 32-character hex string banao, e.g. `a1b2c3d4e5f60718293a4b5c6d7e8f90`
2. Apni site ke root pe file banwao: `https://sarkariupdates.live/a1b2c3d4e5f60718293a4b5c6d7e8f90.txt`
   jiska content wahi key ho. (Next.js mein: `public/a1b2....txt`)
   → Apni site wali AI se bol do: *"public folder me <key>.txt bana do, content = <key>"*
3. Panel ke key box mein key paste karo → 💾
4. **🚀 IndexNow** dabao — saare URLs submit!

## ⚠️ Notes

- Audit same-origin fetch use karta hai → **apni site pe hi chalao**
- IndexNow GET requests browser se bheji jaati hain; response CORS ki wajah se padha nahi ja sakta, isliye tool "bheja gaya" count dikhata hai
- Google ke liye: Search Console mein sitemap resubmit karte raho; IndexNow Bing side cover karta hai

## 📄 License

MIT
