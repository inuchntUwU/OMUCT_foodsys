import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Googleログインを実行する関数
export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

// ログアウトを実行する関数
export function logout() {
  return signOut(auth);
}

// ログイン状態を監視し、UIを更新する共通関数
export function watchAuthState(onLoggedIn, onLoggedOut) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // バックエンド送信用の最新の idToken を取得
        const idToken = await user.getIdToken();
        onLoggedIn(user, idToken);
        updateUserBar(user);
      } catch (error) {
        console.error("Tokenの取得に失敗しました:", error);
      }
    } else {
      if (onLoggedOut) onLoggedOut();
      removeUserBar();
    }
  });
}

// 画面上部にログイン中のユーザー情報を表示するバー
function updateUserBar(user) {
  let bar = document.getElementById("auth-user-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "auth-user-bar";
    bar.style.cssText = `
      background: rgba(255, 255, 255, 0.95);
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #ffebe0;
      position: sticky;
      top: 0;
      z-index: 9999;
    `;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  bar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <img src="${user.photoURL || ''}" alt="Avatar" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ffaa7f;">
      <span>ログイン中: <strong>${user.displayName}</strong></span>
    </div>
    <button id="auth-logout-btn" style="
      background: #ff5555;
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
    ">ログアウト</button>
  `;

  document.getElementById("auth-logout-btn").addEventListener("click", () => {
    logout().then(() => {
      window.location.href = "/login.html";
    });
  });
}

function removeUserBar() {
  const bar = document.getElementById("auth-user-bar");
  if (bar) bar.remove();
}