import React from "react";
import { WebView } from "react-native-webview";

const TermsAndConditions = () => {
	const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background-color: #252525 }
          h1, h2, h3 { color: #fdfdfdff; font-size: 2.5rem }
        </style>
      </head>
      <body>
        <h1>VIPBlackBets Mobil Uygulama Şartlar ve Kurallar</h1>
        <h2>1. Genel Bilgiler</h2>
        <p>VIPBlackBets, kullanıcıların güvenli ve eğlenceli bir bahis deneyimi yaşamasını sağlamak amacıyla tasarlanmış bir mobil uygulamadır.</p>
        
        <h2>2. Kullanıcı Kaydı</h2>
        <ul>
          <li>Kullanıcılar, uygulamayı kullanabilmek için geçerli bir e-posta adresi ve şifre ile kayıt olmalıdır.</li>
          <li>Kayıt esnasında sağlanan bilgilerin doğru ve güncel olması gerekmektedir.</li>
          <li>18 yaşından küçük kullanıcılar uygulamayı kullanamaz.</li>
        </ul>
        
        <h2>3. Hesap Güvenliği</h2>
        <p>Kullanıcılar, hesap bilgilerini gizli tutmakla yükümlüdür. Yetkisiz erişim tespit edilirse, destek ekibi ile iletişime geçilmelidir.</p>

        <h2>4. Bahis Kuralları</h2>
        <p>Bahisler, yalnızca uygulama içindeki belirtilen kurallara uygun olarak yapılmalıdır.</p>

        <h2>5. Ödeme Yöntemleri</h2>
        <p>Uygulama, çeşitli ödeme yöntemlerini desteklemektedir. Kullanıcılar, tercih ettikleri yöntemi seçebilir.</p>

        <h2>6. Sorumluluk Reddi</h2>
        <p>VIPBlackBets, kullanıcıların yaptığı bahislerden doğan kayıplardan sorumlu değildir.</p>
        
        <h1>Gizlilik Politikası</h1>
        
        <h2>1. Bilgi Toplama</h2>
        <p>VIPBlackBets, kullanıcıların kaydolma, bahis yapma ve diğer hizmetleri kullanma sırasında bazı kişisel bilgilerini toplar.</p>
        
        <h2>2. Bilgi Kullanımı</h2>
        <p>Toplanan bilgiler, kullanıcı hesaplarının yönetimi, hizmetlerin iyileştirilmesi ve yasal gerekliliklerin yerine getirilmesi için kullanılabilir.</p>

        <h2>3. Bilgi Paylaşımı</h2>
        <p>VIPBlackBets, kullanıcı bilgilerini üçüncü şahıslarla paylaşmaz.</p>

        <h2>4. Veri Güvenliği</h2>
        <p>Kullanıcı bilgilerinin güvenliği, en yüksek standartlara uygun şekilde korunmaktadır.</p>

        <h2>5. Kullanıcı Hakları</h2>
        <p>Kullanıcılar, kişisel verilerine erişim talep etme, düzeltme ve silme haklarına sahiptir.</p>

        <h2>6. Değişiklikler</h2>
        <p>Bu şartlar ve gizlilik politikası zaman zaman güncellenebilir.</p>

        <h2>7. İletişim</h2>
        <p>Herhangi bir soru veya sorun için, uygulama içindeki destek bölümünden iletişime geçebilirsiniz.</p>
      </body>
    </html>
  `;

	return (
		<WebView
			originWhitelist={["*"]}
			source={{ html: htmlContent }}
			style={{ flex: 1 }}
		/>
	);
};

export default TermsAndConditions;
