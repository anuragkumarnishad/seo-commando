# 🚀 SEO Commando — Indexing Machine

Teen console-tools jo tumhari site (sarkariupdates.live, pdfpixel.tech, koi bhi) ko
search engines mein **fast index** karwate hain. Koi install nahi — bas console mein paste karo.

| Tool | File | Kaam | Kahan chalao |
|---|---|---|---|
| 🛰️ **GSC Indexer** | `gsc-indexer.js` | Google Search Console mein har URL pe **Request Indexing** auto-dabata hai | `search.google.com/search-console` (DIRECT PASTE — one-liner wahan block hota hai) |
| ⚡ **IndexNow Turbo** | `index-turbo.js` | Bing + Yandex + ChatGPT-search ko turant ping (IndexNow protocol) | Kahin bhi |
| 🅱️ **Bing Webmaster Turbo** | `bing-indexer.js` | Bing Webmasters ke Submit URLs box mein **100 URLs ek saath** bhar ke submit | `bing.com/webmasters` → URL Submission page |

## 🚀 Use kaise kare

### ⚡ IndexNow Turbo (kahin bhi)
```js
fetch('https://raw.githubusercontent.com/anuragkumarnishad/seo-commando/main/index-turbo.js').then(r=>r.text()).then(eval)
```

### 🅱️ Bing Webmaster Turbo (Bing Webmasters → URL Submission page pe)
```js
fetch('https://raw.githubusercontent.com/anuragkumarnishad/seo-commando/main/bing-indexer.js').then(r=>r.text()).then(eval)
```
 Agar EvalError aaye: raw file kholo → Ctrl+A → Ctrl+C → console mein Ctrl+V → Enter

### 🛰️ GSC Indexer (Google page pe — DIRECT PASTE only)
1. Raw code kholo: `https://raw.githubusercontent.com/anuragkumarnishad/seo-commando/main/gsc-indexer.js`
2. **Ctrl+A** → **Ctrl+C**
3. GSC tab mein **F12** → Console → **Ctrl+V** → **Enter**
4. Panel mein URLs paste karo (ek per line) → **▶ Start**

## 📅 Roz ka routine
Naye pages bane → **⚡ + 🛰️** (2 min). Hafte mein ek baar **🅱️**. Bas!

## 🔑 IndexNow key (ek baar setup)
- Key: site ke root pe `<key>.txt` file, content = key (Next.js: `public/<key>.txt`)
- sarkariupdates.live ki key already set hai — panel mein auto-loaded hoti hai.
