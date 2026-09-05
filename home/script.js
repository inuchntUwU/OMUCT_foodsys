const BACKEND_URL = 'https://food-system-backend-4vmg.onrender.com';
const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', handleReset);

async function handleReset() {
    // 誤操作防止の確認
    const confirmed = window.confirm('本当に食材データをすべてリセットしますか？この操作は元に戻せません。');
    if (!confirmed) {
        return;
    }

    resetButton.disabled = true;
    const originalText = resetButton.textContent;
    resetButton.textContent = 'リセット中...';

    try {
        // バックエンドにリセットリクエストを送信（APIエンドポイントはバックエンドの仕様に合わせて調整してください）
        const response = await fetch(`${BACKEND_URL}/api/reset`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('リセットに失敗しました');
        }

        alert('食材データをリセットしました。');

    } catch (error) {
        console.error('エラー:', error);
        alert('リセットに失敗しました。時間をおいて再度お試しください。');
    } finally {
        resetButton.disabled = false;
        resetButton.textContent = originalText;
    }
}

// ログインせずにアクセスした場合はログイン画面にリダイレクト
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  // ここに自分のconfig
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ログイン状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ログインしている場合：そのままページを表示（ユーザー情報を画面に出したりする）
    console.log("ログイン中:", user.email);
  } else {
    // 未ログインの場合：ログイン画面 (index.html) に強制送還！
    alert("ログインが必要です");
    window.location.href = "index.html"; 
  }
});