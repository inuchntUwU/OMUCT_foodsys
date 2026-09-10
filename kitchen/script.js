// kitchen/script.js
// 9月10日の確認
import { requireAuth, getIdToken } from "../auth.js";

const API_URL = 'https://food-system-backend-4vmg.onrender.com/api/get-foods';
const DELETE_API_URL = 'https://food-system-backend-4vmg.onrender.com/api/delete-food'; // バックエンドの削除エンドポイント
const foodContainer = document.getElementById('food-container');
const sortSelect = document.getElementById('sort-select');

let currentSort = 'created'; // 初期表示：追加された順

// ログイン必須処理
requireAuth((user) => {
    console.log("ログイン中:", user.email);
    fetchAndDisplayFoods(currentSort);
}, "../login.html");

// 並び替えプルダウン切り替え
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        fetchAndDisplayFoods(currentSort);
    });
}

// 食材データ一覧の取得と表示
async function fetchAndDisplayFoods(sortBy = 'created') {
    try {
        foodContainer.innerHTML = '<p class="status-message">読み込み中...</p>';

        const idToken = await getIdToken();

        // 💡 バックエンドの受取キー名に合わせて ?sortBy= を指定
        const response = await fetch(`${API_URL}?sortBy=${encodeURIComponent(sortBy)}`, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const result = await response.json();
        foodContainer.innerHTML = '';

        const foodList = result.data || result;

        if (!foodList || !Array.isArray(foodList) || foodList.length === 0) {
            foodContainer.innerHTML = '<p class="empty-message">登録されている食材がありません。</p>';
            return;
        }

        foodList.forEach(food => {
            foodContainer.appendChild(createFoodCard(food));
        });

    } catch (error) {
        console.error('エラー:', error);
        foodContainer.innerHTML = '<p class="error-message">料理データの取得に失敗しました。</p>';
    }
}

// 食材カードDOM要素の生成
function createFoodCard(food) {
    const li = document.createElement('li');
    li.className = 'food-card';

    // 💡 バックエンドの Food.findByIdAndDelete(id) に渡すID（_id）
    const foodId = food._id || food.id;
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
                <!-- 削除ボタン -->
                <div class="food-detail-actions" style="margin-top: 12px; text-align: right;">
                    <button type="button" class="delete-btn" style="background-color: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">
                        削除する
                    </button>
                </div>
            </div>
        </div>
    `;

    // カードの開閉トグル
    li.addEventListener('click', () => {
        const isOpen = li.classList.toggle('is-open');
        const hint = li.querySelector('.expand-hint');
        if (hint) {
            hint.textContent = isOpen ? 'タップで閉じる ▲' : 'タップで詳細表示 ▼';
        }
    });

    // 削除処理（バックエンドの req.params.id へ送る）
    const deleteBtn = li.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // 開閉イベントの連動を防止

            if (!confirm(`「${foodName}」を削除してもよろしいですか？`)) {
                return;
            }

            try {
                const idToken = await getIdToken();
                
                // 💡 バックエンドの exports.deleteFood (req.params.id) に合わせてパス末尾にIDを付与
                const response = await fetch(`${DELETE_API_URL}/${foodId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });

                const resData = await response.json();

                if (!response.ok) {
                    throw new Error(resData.message || '削除処理に失敗しました');
                }

                // 成功したら画面上からカード要素を即時削除
                li.remove();

                if (foodContainer.children.length === 0) {
                    foodContainer.innerHTML = '<p class="empty-message">登録されている食材がありません。</p>';
                }

            } catch (err) {
                console.error('削除エラー:', err);
                alert(`削除に失敗しました: ${err.message}`);
            }
        });
    }

    return li;
}

// XSS対策用HTMLエスケープ
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
