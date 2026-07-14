const foodContainer = document.getElementById('food-container');
const BACKEND_URL = 'https://food-system-backend-4vmg.onrender.com';

let currentPage = 1; // 今何ページ目かを覚えておく変数
const limit = 20;    // 1ページに表示したい件数

// テスト用のダミーデータ（fetchから返ってくる想定の形にする）
const dummyData = [
    {
        id: "test-1",
        image_path: "https://placedog.net/500/300", // テスト用画像
        title: "普通のタイトル",
        description: "これは通常のテキスト量です。"
    },
    {
        id: "test-2",
        image_path: "https://placedog.net/500/300",
        title: "めちゃくちゃ長いタイトルのテスト！！！！！！！！！！！！！！！！！！！！！",
        description: "文字が溢れてカードからはみ出さないか、レイアウトが崩れないかをチェックするための長い文章です。文字数制限が必要かどうかが分かります。"
    },
    {
        id: "test-3",
        image_path: "", // 画像が空っぽのパターン
        title: "画像がない場合",
        description: "画像URLが壊れていたり、取得できなかった時の見た目テスト。"
    }
];
// fetchの代わりに、このデータをそのまま画面に渡す
dummyData.forEach(cardData => {
    createCardDOM(cardData);
});
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

// 4. localStorageにデータを保存する関数
function saveCardToStorage(newCard) {
    const currentCards = JSON.parse(localStorage.getItem('myCards')) || [];
    currentCards.push(newCard);
    // localStorageは文字列しか保存できないので、JSON.stringifyする
    localStorage.setItem('myCards', JSON.stringify(currentCards));
}

// 1. バックエンドのURL（データをくれる窓口）aaa
// ※ここを、バックエンド担当者が作った本物のURLに書き換えます
const API_URL = 'https://food-system-backend-4vmg.onrender.com/api/get-foods'; 

// 2. HTML側の料理を入れる箱（ulタグ）を取得しておく
const foodContainer = document.getElementById('food-container');

// 3. バックエンドにデータをリクエストして画面に表示する関数
function fetchAndDisplayFoods() {
    fetch(API_URL)
        .then(response => {
             //エラーチェック（データがちゃんと取れなかった場合）
            if (!response.ok) {
                throw new Error('データの取得に失敗しました');
            }
            return response.json(); // 届いたデータをJSONとして解析
        })
        .then(foodList => {
            // 箱の中身を一度きれいに空にする
            foodContainer.innerHTML = '';

            // 届いたデータを最初から最後までループして、画面に追加していく
            foodList.forEach(food => {
                const cardHtml = `
                    <li class="food-card">
                        <img src="${food.image_path}" loading="lazy" alt="${food.food_name}">
                        <h3>${food.food_name}</h3>
                    </li>
                `;
                foodContainer.innerHTML += cardHtml;
            });
        })
        .catch(error => {
            console.error('エラーが発生しました:', error);
            foodContainer.innerHTML = '<p class="error-message">データの読み込みに失敗しました。</p>';
        });
}

// ページが読み込まれたら、自動的に上の関数を実行する
document.addEventListener('DOMContentLoaded', fetchAndDisplayFoods);




// function loadFoodPage(page) {
    // URLの後ろにページ番号と件数をくっつけてバックエンドに要請する
    // fetch(`https://xxxx.com/api/foods?page=${page}&limit=${limit}`)
        // .then(response => response.json())
        // .then(foodList => {
            // 
            // 一度古いリストを空っぽにする
            // const container = document.getElementById('food-container');
            // container.innerHTML = ""; 
            // 
            // 新しいページの20件だけを画面に表示する
            // foodList.forEach(food => {
                // container.innerHTML += `
                    // <li class="food-card">
                        // <img src="${food.image_path}" loading="lazy">
                        // <h3>${food.food_name}</h3>
                    // </li>
                // `;
            // });
        // });
// }

// document.getElementById('next-button').addEventListener('click', () => {
    // currentPage++;
    // loadFoodPage(currentPage);
// });

