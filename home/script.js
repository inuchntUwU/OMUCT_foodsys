// home/script.js
import { requireAuth, getIdToken } from "../auth.js";

const BACKEND_URL = 'https://food-system-backend-4vmg.onrender.com';

const LINE_ADD_FRIEND_URL = 'https://lin.ee/trVOU9X';

const resetButton = document.getElementById('reset-button');

// LINE連携モーダル関連の要素
const lineLinkButton = document.getElementById('line-link-button');
const lineModal = document.getElementById('line-link-modal');
const lineModalClose = document.getElementById('line-modal-close');
const lineAddFriend = document.getElementById('line-add-friend');
const lineCodeEl = document.getElementById('line-code');
const lineCheckButton = document.getElementById('line-check');
const lineSteps = document.getElementById('line-link-steps');
const lineDone = document.getElementById('line-link-done');
const lineError = document.getElementById('line-link-error');

// ログイン必須。未ログインならログインページへ飛ばす。
requireAuth((user) => {
    console.log("ログイン中:", user.email);
}, "../login.html");

resetButton.addEventListener('click', handleReset);

lineLinkButton.addEventListener('click', openLineLink);
lineModalClose.addEventListener('click', closeLineLink);
lineCheckButton.addEventListener('click', handleLineCheck);
lineModal.addEventListener('click', (e) => {
    // オーバーレイ（モーダル外）クリックで閉じる
    if (e.target === lineModal) {
        closeLineLink();
    }
});


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


// --- LINE連携 ---

// バックエンドに連携コードの発行を依頼する。
// レスポンス: { ok: true, linkCode: "1234", lineUserId: string|null }
// 注意: このエンドポイントは呼ぶたびに新しい linkCode を発行する（＝以前のコードは無効になる）。
async function requestLinkCode() {
    const idToken = await getIdToken();
    const res = await fetch(`${BACKEND_URL}/api/user/generate-link-code`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) {
        throw new Error(`generate-link-code failed: ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) {
        throw new Error(data.message || 'generate-link-code returned ok:false');
    }
    return data;
}

async function openLineLink() {
    lineLinkButton.disabled = true;
    hideError();
    try {
        const data = await requestLinkCode();
        if (data.lineUserId) {
            showDone();
        } else {
            showCode(data.linkCode);
        }
        lineAddFriend.href = LINE_ADD_FRIEND_URL;
        lineModal.hidden = false;
    } catch (error) {
        console.error('LINE連携エラー:', error);
        alert('連携コードの取得に失敗しました。ログイン状態を確認して、再度お試しください。');
    } finally {
        lineLinkButton.disabled = false;
    }
}

function closeLineLink() {
    lineModal.hidden = true;
}

async function handleLineCheck() {
    lineCheckButton.disabled = true;
    const originalText = lineCheckButton.textContent;
    lineCheckButton.textContent = '確認中...';
    hideError();

    try {
        const data = await requestLinkCode();
        if (data.lineUserId) {
            showDone();
        } else {
            showCode(data.linkCode);
            showError('まだ連携が確認できません。上に表示されている最新コードをLINEのトークに送信してから、もう一度お試しください。');
        }
    } catch (error) {
        console.error('LINE連携の確認エラー:', error);
        showError('確認に失敗しました。時間をおいて再度お試しください。');
    } finally {
        lineCheckButton.disabled = false;
        lineCheckButton.textContent = originalText;
    }
}

function showCode(code) {
    lineCodeEl.textContent = code;
    lineSteps.hidden = false;
    lineDone.hidden = true;
}

function showDone() {
    lineSteps.hidden = true;
    lineDone.hidden = false;
}

function showError(message) {
    lineError.textContent = message;
    lineError.hidden = false;
}

function hideError() {
    lineError.hidden = true;
}
