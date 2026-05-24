# Öner Özbey — Kişisel Web Sayfası

Statik (HTML/CSS/JS) kişisel web sayfası. Tüm CV içeriği tek bir JSON
dosyasında (`data/cv.json`) tutulur, sayfalar bu veriyi okuyarak
render eder — kod içinde sabit metin yoktur.

## Yapı

```
.
├── index.html              # Anasayfa (hero, özet, başarılar)
├── cv.html                 # Tam özgeçmiş sayfası (/cv.html)
├── data/
│   └── cv.json             # Tek doğruluk kaynağı — tüm CV içeriği
├── assets/
│   ├── css/style.css       # Tüm tasarım, açık/koyu tema, baskı stilleri
│   ├── js/main.js          # JSON'u yükler, sayfaları doldurur
│   ├── img/profile.jpg     # Profil fotoğrafı
│   └── files/
│       └── oner-ozbey-cv.pdf
└── README.md
```

## Yerelde çalıştırma

`fetch` çalışabilmesi için statik bir sunucu üzerinden açın
(doğrudan `file://` çalışmaz):

```bash
python3 -m http.server 8000
# Tarayıcı: http://localhost:8000
```

## İçerik güncelleme

CV içeriğini değiştirmek için yalnızca `data/cv.json` dosyasını
düzenleyin. Sayfalar bir sonraki yüklemede yeni veriyi gösterir.

- `personal.*` — ad, görev, iletişim, profil görseli, indirilecek PDF
- `summary` — anasayfadaki "Hakkımda" paragrafları
- `highlights` — anasayfadaki sayısal vurgular
- `experience` — iş deneyimi (her giriş için `details` listesi)
- `education`, `skills`, `languages`, `achievements`, `workingLife`
- `site.navItems` — üst menü bağlantıları

Profil fotoğrafını değiştirmek için `assets/img/profile.jpg` dosyasını
güncelleyin (veya `personal.photo` yolunu değiştirin). PDF için
`assets/files/oner-ozbey-cv.pdf` veya `personal.cvFile`.

## Yayınlama

Repo GitHub Pages üzerinden yayınlanır:

- Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)`
- Yayın adresi: <https://veteroner.github.io/onerozbey/>

## Özellikler

- Tüm içerik veri odaklı (`data/cv.json`).
- Mobil/masaüstü duyarlı düzen.
- Açık/Koyu tema, tercih `localStorage`'da hatırlanır.
- `/cv.html` üzerinden ayrıntılı özgeçmiş + yazdırma uyumlu sürüm.
- PDF indir butonu (`assets/files/oner-ozbey-cv.pdf`).
- `mailto:` ve `tel:` bağlantıları doğrudan açılır.
