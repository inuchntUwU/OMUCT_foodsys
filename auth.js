// auth.js
// Googleログインの共通処理。ルート直下に置き、各ページから
// import { loginWithGoogle, watchAuthState, getIdToken, ... } from "./auth.js" (または "../auth.js")
// の形で使う。
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Googleでログイン(ポップアップ)。成功したらuserを返す。
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// ログアウト
export function logout() {
  return signOut(auth);
}

// ログイン状態の変化を監視。
// onLogoutは省略可(渡さなければ何もしない)。
export function watchAuthState(onLogin, onLogout = () => {}) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onLogin(user);
    } else {
      onLogout();
    }
  });
}

// 現在ログイン中ユーザーのIDトークンを取得。
// バックエンドに送るときはこれをAuthorizationヘッダーに乗せる。
export async function getIdToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインしていません");
  return await user.getIdToken(); // 期限切れなら自動でリフレッシュされる
}

// ログイン必須ページの先頭で呼ぶ。
// ログイン済みならonReady(user)を呼び、未ログインならログインページへ飛ばす。
// loginPagePathはページの階層に合わせて呼び出し側で調整する
// (例: home/やcamera/の中からなら "../login.html")
export function requireAuth(onReady, loginPagePath = "/login.html") {
  watchAuthState(
    (user) => onReady(user),
    () => {
      window.location.href = loginPagePath;
    }
  );
}