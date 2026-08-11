// 1. 設定ファイルとFirebase SDKのインポート
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3. DOM要素の取得
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnSignup = document.getElementById('btn-signup');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const authForm = document.getElementById('auth-form');
const userInfo = document.getElementById('user-info');
const userEmailText = document.getElementById('user-email');
const messageText = document.getElementById('message');

// ① 新規ユーザー登録
if (btnSignup) {
  btnSignup.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    messageText.textContent = "";

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("登録成功:", userCredential.user);
      })
      .catch((error) => {
        console.error("登録エラー:", error);
        messageText.textContent = "登録エラー: " + error.message;
      });
  });
}

// ② ログイン
if (btnLogin) {
  btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    messageText.textContent = "";

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("ログイン成功:", userCredential.user);
      })
      .catch((error) => {
        console.error("ログインエラー:", error);
        messageText.textContent = "ログインエラー: " + error.message;
      });
  });
}

// ③ ログアウト
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        console.log("ログアウト完了");
      })
      .catch((error) => {
        console.error("ログアウトエラー:", error);
        messageText.textContent = "ログアウトエラー: " + error.message;
      });
  });
}

// ④ ログイン状態の監視 (UIの切り替え)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ログイン中の処理
    console.log("ログイン中のユーザー:", user.email);
    if (userEmailText) userEmailText.textContent = user.email;
    if (authForm) authForm.classList.add('hidden');
    if (userInfo) userInfo.classList.remove('hidden');
  } else {
    // ログアウト状態の処理
    console.log("未ログイン状態です");
    if (authForm) authForm.classList.remove('hidden');
    if (userInfo) userInfo.classList.add('hidden');
    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
  }
});