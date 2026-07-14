// 1. 各種設定（本物のバックエンドのURL）
const API_URL = 'https://food-system-backend-4vmg.onrender.com/api/get-foods'; 
const foodContainer = document.getElementById('food-container');

// 2. バックエンドからデータを取得して画面に表示する関数
async function fetchAndDisplayFoods() {
    try {
        // バックエンドにデータをリクエスト
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const result = await response.json();
        
        // コンテナを一旦空にする
        foodContainer.innerHTML = '';

        // 送られてきたデータの「data」部分を取り出す
        const foodList = result.data;

        // もしデータが空っぽだった場合の処理
        if (!foodList || foodList.length === 0) {
            foodContainer.innerHTML = '<p class="empty-message">登録されている料理がありません。</p>';
            return;
        }

        // 取得した料理データを1つずつループ処理して画面に流し込む
        foodList.forEach(food => {
            // 画像がない場合のデフォルト画像を設定（もし image_path が空なら、代わりの画像を表示）
            const imageUrl = food.image_path || 'https://placedog.net/500/300';
            
            const cardHtml = `
                <li class="food-card">
                    <img src="${imageUrl}" loading="lazy" alt="${food.food_name || '料理画像'}">
                    <h3>${food.food_name || '名前なし'}</h3>
                </li>
            `;
            foodContainer.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error('エラー:', error);
        foodContainer.innerHTML = `<p style="color: red; text-align: center;">料理データの取得に失敗しました。</p>`;
    }
}

// 3. ページが読み込まれたら、自動的に上の関数を実行する
document.addEventListener('DOMContentLoaded', fetchAndDisplayFoods);
