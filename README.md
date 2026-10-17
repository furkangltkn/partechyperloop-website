# PARTECH Hyperloop

Stitch tasarımını temel alan, gerçek takım fotoğrafları kullanan, İngilizce / Türkçe kurumsal site. Node.js dışında kurulum veya npm paketi gerektirmez.

## Yerel çalıştırma

```sh
npm run dev
```

Normal görünüm: http://localhost:4173

Alternatif önizleme bağlantısı: http://localhost:4173/?preview=1

Alternatif port: `PORT=4174 npm run dev`.

## İçerik düzenleme

- `achievements.js`: Yıllara göre ödüller, final katılımları ve fotoğraf galerileri.
- `content.js`: İngilizce / Türkçe metinler, sponsorlar ve iletişim ayarları.
- `siteConfig.partners`: Sponsorların adı, logosu ve sırası. `featured: true` üst sırayı belirtir. Firma açıklaması gösterilmez.
- `siteConfig.contactEmail`: Onaylı iletişim e-postası. Boşken mesaj gönderme iddiası veya form gösterilmez.
- `siteConfig.partnershipDeck`: Hazır olduğunda sponsorluk PDF dosyasının yolu.
- `assets/`: Kullanıcının sağladığı fotoğraflar. Sponsor logoları da buraya eklenebilir.
- `reference/`: Orijinal Stitch HTML ve ekran görüntüsü; yerel sunucu bu klasörü sunmaz.

## Mevcut kapsam

Tek sayfa: açılış, teknoloji, hakkımızda, başarılar, sponsorlar, ekip, haberler ve iletişim. Mobil menü, açılır mega menü, kalıcı dil seçimi ve haber ayrıntı pencereleri çalışır. Yedi sponsor logosu eklenmiştir; KARDEMİR ve Karabük Üniversitesi üst sıradadır. Yönetim paneli ve sunucuya mesaj gönderen form henüz kapsamda değildir.

Stitch'in ürettiği doğrulanmamış performans sayıları, EHW sonuçları, alıntılar ve sponsor katkıları gerçek bilgi olarak aktarılmadı. Fotoğraflardaki etkinlikler üzerinden genel tanıtım metinleri kullanıldı; yayın öncesi takım tarafından içerik kontrolü yapılmalıdır.

## Yayın ve Google görünürlüğü

Canlı alan adı: https://partechyperloop.com/ (Netlify).

`npm run build` yalnızca yayın dosyalarını `dist/` klasörüne hazırlar; `reference/` yayınlanmaz. Varsayılan İngilizce metinler HTML'e eklenir; tarayıcıdaki Türkçe/İngilizce dil seçimi korunur. Netlify ayarları `netlify.toml` içindedir.

- Sayfa indekslemeye açıktır; canonical adresi ana alan adıdır.
- `robots.txt`, `sitemap.xml` adresini bildirir. Tek sayfa olduğu için bölüm bağlantıları ayrı URL olarak listelenmez.
- Yayından sonra Google Search Console'a alan adını ekleyin. TXT doğrulama kaydını Netlify DNS'e girin, `sitemap.xml` dosyasını gönderin ve ana sayfa için URL Denetimi üzerinden dizine ekleme isteyin.
- Bu ayarlar indeksleme engelini kaldırır; Google'da görünme zamanı veya sıralama garantisi vermez.

## Kontrol

`npm run check` JavaScript dosyalarının sözdizimini kontrol eder.
