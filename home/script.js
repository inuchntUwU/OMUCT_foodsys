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