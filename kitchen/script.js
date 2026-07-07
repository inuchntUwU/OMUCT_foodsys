const foodContainer = document.getElementById('food-container');
const BACKEND_URL = 'https://food-system-backend-4vmg.onrender.com';

// ページ読み込み時にバックエンドから食材一覧を取得する
window.addEventListener('DOMContentLoaded', fetchFoodList);

async function fetchFoodList() {
    try {
        // バックエンドから食材一覧を取得（APIエンドポイントはバックエンドの仕様に合わせて /api/foods などに調整してください）
        const response = await fetch(`https://food-system-backend-4vmg.onrender.com/api/get-foods`);
        
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }

        const foods = await response.json();
        
        // コンテナを一旦空にする
        foodContainer.innerHTML = '';

        // 取得した食材データを1つずつループ処理して画面に流し込む
        foods.forEach(food => {
            createFoodCardDOM(food);
        });

    } catch (error) {
        console.error('エラー:', error);
        foodContainer.innerHTML = `<p style="color: red; text-align: center;">食材データの取得に失敗しました。</p>`;
    }
}

// あなたのCSS（.food-card）の形にデータを流し込む関数
function createFoodCardDOM(data) {
    const li = document.createElement('li');
    li.className = 'food-card';

    // バックエンドから送られてくるプロパティ名（foodName, weight, expiryDate, imagePathなど）を当てはめます
    // 画像URLが相対パスで返ってくる場合はBACKEND_URLと結合します
    const imageUrl = data.imagePath ? (data.imagePath.startsWith('http') ? data.imagePath : `${BACKEND_URL}${data.imagePath}`) : 'https://placedog.net/500/300';
    
    // 賞味期限の日付を見やすく整形（YYYY-MM-DDなど）
    const expiry = data.expiryDate ? data.expiryDate.split('T')[0] : '未設定';

    li.innerHTML = `
        <img src="${imageUrl}" alt="${data.foodName || '食材画像'}">
        <h3>${data.foodName || '名前なし'}</h3>
        <div style="padding: 0 15px 15px; text-align: left; font-size: 12px; color: #555;">
            <p style="margin: 4px 0;">重さ: ${data.weight || 0} g</p>
            <p style="margin: 4px 0; color: #ca3838; font-weight: bold;">賞味期限: ${expiry}</p>
        </div>
    `;

    foodContainer.appendChild(li);
}