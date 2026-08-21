# DNS-Kencang

DNS-based solution untuk meningkatkan kecepatan akses internet sekaligus mengontrol filtering domain menggunakan pendekatan blacklist / RPZ (Response Policy Zone) dan Caching.

Project ini ditujukan untuk:
- Mempercepat resolusi DNS
- Mengontrol akses domain (block)

---

## 🚀 Features

- ⚡ Faster DNS resolution (optimasi resolver)
- 🚫 Domain filtering berbasis blacklist / RPZ

---

## 📦 Struktur Project

```
/etc/unbound
├── db.rpz            # Zone file RPZ
└── blocklist.conf	  # Custom block, for adsblock maybe
```

---

## ⚙️ Requirements

- Debian server (trixie recommended)

---

## 🔧 Installation

```bash
apt install git git-lfs
git clone https://github.com/tkjw92/dns-kencang.git
cd dns-kencang
git lfs pull
chmod +x install.sh
./install.sh
```

Listen http://<server address / domain> \
Default basic auth.
```bash
username: admin
password: admin
```

---

## 🧪 Testing

Cek apakah domain terblokir:

```bash
dig sex.com @127.0.0.1
```

Expected:
- NXDOMAIN atau redirect ke sinkhole

---

## ⚠️ Catatan

Untuk mengaktifkan RPZ, uncomment konfigurasi RPZ pada /etc/unbound/unbound.conf \
Sesuaikan rpz-cname-override dengan domain redirect yang di inginkan

---

## 📌 Use Case

- Home lab DNS filtering
- Network sekolah / kantor
- Anti-ads / anti-tracking DNS

---

## 🤝 Contributing

Pull request terbuka untuk:
- Penambahan blocklist
- Optimasi performa
- Perbaikan script

---

## 📄 License

MIT License
