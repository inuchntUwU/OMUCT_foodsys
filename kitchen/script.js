// kitchen/script.js
// ルート直下の auth.js を使う(ログインしていなければ ../login.html へ飛ばす)
import { requireAuth, getIdToken } from "../auth.js";

const API_URL = 'https://food-system-backend-4vmg.onrender.com/api/get-foods';
const foodContainer = document.getElementById('food-container');
const sortSelect = document.getElementById('sort-select'); // 並び替え用セレクトボックス

let currentSort = 'created'; // 初期表示：追加された順

// ログイン必須。ログイン済みなら一覧取得を開始
requireAuth((user) => {
    console.log("ログイン中:", user.email);
    fetchAndDisplayFoods(currentSort);
}, "../login.html");

// 並び替えセレクトボックスの変更イベント
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        fetchAndDisplayFoods(currentSort);
    });
}

// バックエンドからデータを取得して画面に表示する関数（sortBy を指定可能）
async function fetchAndDisplayFoods(sortBy = 'created') {
    try {
        foodContainer.innerHTML = '<p class="status-message">読み込み中...</p>';

        const idToken = await getIdToken();

        // クエリパラメータ ?sort=... を付与してAPIリクエスト（バックエンドは req.query.sort を見る）
        const response = await fetch(`${API_URL}?sort=${sortBy}`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const result = await response.json();
        const foodList = result.data || result;

        // コンテナを一旦クリア
        foodContainer.innerHTML = '';

        // データが空の場合
        if (!foodList || !Array.isArray(foodList) || foodList.length === 0) {
            foodContainer.innerHTML = '<p class="empty-message">登録されている食材がありません。</p>';
            return;
        }

        // 取得した食材データを1つずつカード要素にして追加
        foodList.forEach(food => {
            foodContainer.appendChild(createFoodCard(food));
        });

    } catch (error) {
        console.error('エラー:', error);
        foodContainer.innerHTML = '<p class="error-message">料理データの取得に失敗しました。</p>';
    }
}

// 食材カードのDOM要素を作成する関数
function createFoodCard(food) {
    const li = document.createElement('li');
    li.className = 'food-card';

    const imageUrl = food.image_path || 'https://placedog.net/500/300';
    const foodName = food.food_name || '名前なし';
    const weight = (food.weight !== null && food.weight !== undefined && food.weight !== '')
        ? `${food.weight} g`
        : '未設定';
    const expirationDate = food.expiration_date || food.expiryDate || '未設定';

    li.innerHTML = `
        <div class="food-card-image-wrap">
            <img src="${escapeHtml(imageUrl)}" loading="lazy" alt="${escapeHtml(foodName)}">
        </div>
        <div class="food-card-body">
            <h3 class="food-card-title">${escapeHtml(foodName)}</h3>
            <span class="expand-hint">タップで詳細表示 ▼</span>
            <div class="food-card-details">
                <div class="food-detail-row">
                    <span class="food-detail-label">重さ/数量:</span>
                    <span class="food-detail-value">${escapeHtml(weight)}</span>
                </div>
                <div class="food-detail-row">
                    <span class="food-detail-label">賞味期限:</span>
                    <span class="food-detail-value expiry">${escapeHtml(expirationDate)}</span>
                </div>
            </div>
        </div>
    `;

    // クリックで詳細の開閉トグル
    li.addEventListener('click', () => {
        const isOpen = li.classList.toggle('is-open');
        const hint = li.querySelector('.expand-hint');
        if (hint) {
            hint.textContent = isOpen ? 'タップで閉じる ▲' : 'タップで詳細表示 ▼';
        }
    });

    return li;
}

// XSS防止用HTMLエスケープ関数
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
