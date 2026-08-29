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
        const idToken = await getIdToken();

        // クエリパラメータ ?sortBy=... を付与してAPIリクエスト
        const response = await fetch(`${API_URL}?sortBy=${sortBy}`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const result = await response.json();

        // コンテナを空にする
        foodContainer.innerHTML = '';

        const foodList = result.data || result;

        if (!foodList || !Array.isArray(foodList) || foodList.length === 0) {
            foodContainer.innerHTML = '<p class="empty-message">登録されている料理がありません。</p>';
            return;
        }

        // 食材カードの描画処理
        foodList.forEach(food => {
            const imageUrl = food.image_path || 'https://placedog.net/500/300';
            const foodName = food.food_name || '名前なし';
            const weightText = (food.weight !== null && food.weight !== undefined) ? `${food.weight} g` : '未設定';
            const expireText = food.expiration_date || '未設定';

            const cardItem = document.createElement('li');
            cardItem.className = 'food-card';
            cardItem.style.cursor = 'pointer';
            cardItem.style.transition = 'all 0.3s ease-in-out';
            cardItem.style.display = 'flex';
            cardItem.style.alignItems = 'center';
            cardItem.style.overflow = 'hidden';
            cardItem.style.width = '176px';
            cardItem.style.background = '#ffffff';
            cardItem.style.borderRadius = '1rem';
            cardItem.style.padding = '1rem';
            cardItem.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';

            cardItem.innerHTML = `
                <div style="display: flex; width: 100%; align-items: center;">
                    <div style="width: 100%; text-align: center; flex-shrink: 0;">
                        <div style="width: 100%; height: 96px; background: #000; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; overflow: hidden;">
                            <img src="${imageUrl}" loading="lazy" alt="${foodName}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <p style="margin-top: 0.5rem; font-weight: bold; color: #1f2937; font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${foodName}
                        </p>
                    </div>
                    <div class="detail-section" style="display: none; margin-left: 1.5rem; border-left: 1px solid #e5e7eb; padding-left: 1.5rem; font-size: 0.875rem; color: #374151; min-width: 240px;">
                        <h3 style="font-size: 1.125rem; font-weight: bold; color: #111827; margin-bottom: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${foodName}
                        </h3>
                        <p style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #9ca3af;">重さ/数量:</span>
                            <span style="font-weight: 600; color: #1f2937;">${weightText}</span>
                        </p>
                        <p style="display: flex; justify-content: space-between;">
                            <span style="color: #9ca3af;">賞味期限:</span>
                            <span style="font-weight: bold; color: #ef4444;">${expireText}</span>
                        </p>
                    </div>
                </div>
            `;

            let isOpen = false;
            cardItem.addEventListener('click', (e) => {
                e.stopPropagation();
                isOpen = !isOpen;
                const detailSection = cardItem.querySelector('.detail-section');

                if (isOpen) {
                    cardItem.style.width = '480px';
                    detailSection.style.display = 'block';
                } else {
                    cardItem.style.width = '176px';
                    detailSection.style.display = 'none';
                }
            });

            foodContainer.appendChild(cardItem);
        });

        // 枠外タップで閉じる
        document.addEventListener('click', () => {
            const cards = foodContainer.querySelectorAll('.food-card');
            cards.forEach(card => {
                card.style.width = '176px';
                const detail = card.querySelector('.detail-section');
                if (detail) detail.style.display = 'none';
            });
        });

    } catch (error) {
        console.error('エラー:', error);
        foodContainer.innerHTML = `<p style="color: red; text-align: center;">料理データの取得に失敗しました。</p>`;
    }
}
