// kitchen/script.js
import { requireAuth, getIdToken } from "../auth.js";

const API_URL = 'https://food-system-backend-4vmg.onrender.com/api/get-foods';
const foodContainer = document.getElementById('food-container');

// ログイン必須。ログイン済みなら一覧取得を始める。
requireAuth((user) => {
    console.log("ログイン中:", user.email);
    fetchAndDisplayFoods();
}, "../login.html");

// バックエンドからデータを取得して画面に表示する関数
async function fetchAndDisplayFoods() {
    try {
        // 今ログインしているユーザーのIDトークンを付けてリクエスト
        // バックエンド側でトークンを検証し、そのユーザーが登録した食材だけを
        // 返すようにしてもらう想定(誰の食材か絞り込むためのキー)
        const idToken = await getIdToken();

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

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
            // 画像がない場合のデフォルト画像を設定
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