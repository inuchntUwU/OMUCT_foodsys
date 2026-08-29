# Eat It (OMUCT_foodsys)

家庭内の食材を一括管理し、使い切りをサポートすることで**食品ロス（フードロス）や家計負担を削減するWebシステム**です。

---

## 🌟 概要 (Overview)

「せっかく買った食材を賞味期限切れで捨ててしまった」「既にあるのに同じ食材を買ってしまった」といった家庭内の食品ロスを解消するためのアプリです。  
デバイスのカメラを用いた直感的な食材登録や、登録済み食材の在庫一覧・賞味期限管理を提供し、毎日の食材管理をスマートに行えます。

---

## 🚀 主な機能 (Features)

* **🔐 ログイン・認証 (`login.html`)**
  * Firebase Authentication（Googleアカウント）による安全なログイン機能
* **🏠 ホーム・ダッシュボード (`/home`)**
  * 各機能へのポータルアクセス
  * 食材データの一括リセット機能
* **📷 カメラ撮影・食材登録 (`/camera`)**
  * デバイスのカメラを使用した食材の撮影
  * 食材名・重さ (g)・賞味期限の入力とバックエンドへの登録
* **🍳 キッチン・食材一覧 (`/kitchen`)**
  * 登録されている食材一覧をカード形式で閲覧

---

## 🛠 技術スタック (Tech Stack)

* **フロントエンド**: HTML5 / CSS3 / JavaScript (ES Modules)
* **認証**: Firebase Authentication (Google Login)
* **バックエンド連携**: REST API (Render / Express / MongoDB)

---

## 📁 ディレクトリ構造 (Directory Structure)

```text
OMUCT_foodsys/
├── login.html           # ログイン画面
├── login.css            # ログイン画面用スタイル
├── auth.js              # Firebase 認証共通モジュール
├── firebase-config.js   # Firebase 設定ファイル
├── home/                # ホーム・ダッシュボード画面
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── eat it.png
├── camera/              # 食材撮影・登録画面
│   ├── index.html
│   ├── script.js
│   └── style.css
├── kitchen/             # 在庫管理・食材一覧画面
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```
