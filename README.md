# PARTECH Hyperloop

Stitch tasarımını temel alan, gerçek takım fotoğrafları kullanan, İngilizce / Türkçe kurumsal site. Node.js dışında kurulum veya npm paketi gerektirmez.

## Yerel çalıştırma

```sh
npm run dev
```

Normal görünüm: http://localhost:4173

Sponsor yer tutucularıyla tasarım önizlemesi: http://localhost:4173/?preview=1

Alternatif port: `PORT=4174 npm run dev`.

## İçerik düzenleme

- `content.js`: İngilizce / Türkçe metinler, sponsorlar ve iletişim ayarları.
- `siteConfig.partners`: Gerçek partnerleri buraya ekleyin; boşken ziyaretçilere sahte sponsor gösterilmez.
- `siteConfig.contactEmail`: Onaylı iletişim e-postası. Boşken mesaj gönderme iddiası veya form gösterilmez.
- `siteConfig.partnershipDeck`: Hazır olduğunda sponsorluk PDF dosyasının yolu.
- `assets/`: Kullanıcının sağladığı fotoğraflar. Sponsor logoları da buraya eklenebilir.
- `reference/`: Orijinal Stitch HTML ve ekran görüntüsü; yerel sunucu bu klasörü sunmaz.

## Mevcut kapsam

Tek sayfa: açılış, teknoloji, hakkımızda, başarılar, sponsorlar, ekip, haberler ve iletişim. Mobil menü, açılır mega menü, kalıcı dil seçimi ve haber ayrıntı pencereleri çalışır. Sponsor verileri sonraki aşamada eklenebilir. Yönetim paneli ve sunucuya mesaj gönderen form henüz kapsamda değildir.

Stitch'in ürettiği doğrulanmamış performans sayıları, EHW sonuçları, alıntılar ve sponsor katkıları gerçek bilgi olarak aktarılmadı. Fotoğraflardaki etkinlikler üzerinden genel tanıtım metinleri kullanıldı; yayın öncesi takım tarafından içerik kontrolü yapılmalıdır.

## Yayın öncesi

1. İletişim e-postasını, sponsor verilerini ve varsa PDF dosyasını ekleyin.
2. Metinleri, mühendislik disiplinlerini ve görsel açıklamalarını takım ile doğrulayın.
3. `index.html` içindeki `noindex,nofollow` etiketini yayın kararıyla kaldırın.
4. Onaylanan domain ve hosting bağlantısını yapın. Henüz yayın yapılmadı.
5. Yalnızca index.html, styles.css, app.js, content.js ve assets/ dizinini statik hosting'e yükleyin; reference/ klasörünü yayınlamayın.

## Kontrol

`npm run check` JavaScript dosyalarının sözdizimini kontrol eder.
