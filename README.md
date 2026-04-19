# Budget App

> 🇹🇷 Türkçe | 🇬🇧 [English](#english)

---

## 🇹🇷 Türkçe

### Proje Tanıtımı

Budget App, kişisel bütçe takibi yapmanızı sağlayan React Native (Expo) mobil uygulamasıdır. Gelir ve giderlerinizi kaydedebilir, geçmişinizi görüntüleyebilir ve raporlar alabilirsiniz.

---

### Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Framework | React Native + Expo |
| Navigasyon | React Navigation (Stack + Bottom Tabs) |
| HTTP İstekleri | Axios |
| Grafikler | react-native-chart-kit |
| Yerel Depolama | AsyncStorage (token) |

---

### Ekranlar

| Ekran | Açıklama |
|---|---|
| LoginScreen | Kullanıcı girişi |
| RegisterScreen | Kullanıcı kaydı |
| HomeScreen | Bütçe özeti ve son işlemler |
| AddEditScreen | Yeni işlem ekleme / düzenleme |
| HistoryScreen | İşlem geçmişi |
| ReportScreen | Gelir/gider grafikleri |

---

### Klasör Yapısı

```
src/
├── api/
│   └── client.js          # Axios istemcisi + API fonksiyonları
├── components/
│   ├── SummaryBox.js       # Bütçe özet kartı
│   └── TransactionCard.js  # İşlem kartı bileşeni
├── context/
│   └── AuthContext.js      # Kimlik doğrulama context'i
└── screens/
    ├── LoginScreen.js
    ├── RegisterScreen.js
    ├── HomeScreen.js
    ├── AddEditScreen.js
    ├── HistoryScreen.js
    └── ReportScreen.js
```

---

### Kurulum

#### Gereksinimler
- Node.js 18+
- Expo Go (mobil cihazda)
- [Budget Backend](https://github.com/TheBottle2/budget-backend) çalışır durumda

#### 1. Repoyu klonla
```bash
git clone https://github.com/TheBottle2/budget-app.git
cd budget-app
```

#### 2. Bağımlılıkları yükle
```bash
npm install
```

#### 3. Uygulamayı başlat
```bash
npx expo start
```

Expo Go ile QR kodunu tarayarak cihazında çalıştır.

---

---

## 🇬🇧 English <a name="english"></a>

### About

Budget App is a React Native (Expo) mobile application for personal budget tracking. You can record income and expenses, view history, and generate reports.

---

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| HTTP Client | Axios |
| Charts | react-native-chart-kit |
| Local Storage | AsyncStorage (token) |

---

### Screens

| Screen | Description |
|---|---|
| LoginScreen | User login |
| RegisterScreen | User registration |
| HomeScreen | Budget summary and recent transactions |
| AddEditScreen | Add / edit transaction |
| HistoryScreen | Transaction history |
| ReportScreen | Income/expense charts |

---

### Folder Structure

```
src/
├── api/
│   └── client.js          # Axios client + API functions
├── components/
│   ├── SummaryBox.js       # Budget summary card
│   └── TransactionCard.js  # Transaction card component
├── context/
│   └── AuthContext.js      # Authentication context
└── screens/
    ├── LoginScreen.js
    ├── RegisterScreen.js
    ├── HomeScreen.js
    ├── AddEditScreen.js
    ├── HistoryScreen.js
    └── ReportScreen.js
```

---

### Installation

#### Requirements
- Node.js 18+
- Expo Go (on mobile device)
- [Budget Backend](https://github.com/TheBottle2/budget-backend) running

#### 1. Clone the repo
```bash
git clone https://github.com/TheBottle2/budget-app.git
cd budget-app
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start the app
```bash
npx expo start
```

Scan the QR code with Expo Go to run on your device.
