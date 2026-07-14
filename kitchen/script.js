const cardContainer = document.getElementById('card-container');
const fetchBtn = document.getElementById('fetch-btn');

let currentPage = 1; // 今何ページ目かを覚えておく変数
const limit = 20;    // 1ページに表示したい件数

// テスト用のダミーデータ（fetchから返ってくる想定の形にする）
const dummyData = [
    {
        id: "test-1",
        imageUrl: "https://placedog.net/500/300", // テスト用画像
        title: "普通のタイトル",
        description: "これは通常のテキスト量です。"
    },
    {
        id: "test-2",
        imageUrl: "https://placedog.net/500/300",
        title: "めちゃくちゃ長いタイトルのテスト！！！！！！！！！！！！！！！！！！！！！",
        description: "文字が溢れてカードからはみ出さないか、レイアウトが崩れないかをチェックするための長い文章です。文字数制限が必要かどうかが分かります。"
    },
    {
        id: "test-3",
        imageUrl: "", // 画像が空っぽのパターン
        title: "画像がない場合",
        description: "画像URLが壊れていたり、取得できなかった時の見た目テスト。"
    }
];
// fetchの代わりに、このデータをそのまま画面に渡す
dummyData.forEach(cardData => {
    createCardDOM(cardData);
});











// 1. ページ読み込み時に、すでに保存されているカードがあれば表示する
初期化();

function 初期化() {
    const savedCards = JSON.parse(localStorage.getItem('myCards')) || [];
    savedCards.forEach(cardData => {
        createCardDOM(cardData);
    });
}

// 2. ボタンを押したらfetchしてデータを取得
fetchBtn.addEventListener('click', async () => {
    try {
        // 例として擬似的なAPI（JSONPlaceholderなど）や犬画像APIを使う想定
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        
        const cardData = {
            id: Date.now(), // 削除や識別用のユニークなID
            imageUrl: data.message, // APIから取得した画像URL
            title: `カード ${new Date().toLocaleTimeString()}`,
            description: 'fetchしてきたデータです。'
        };

        // 画面に追加
        createCardDOM(cardData);
        // localStorageに保存
        saveCardToStorage(cardData);

    } catch (error) {
        console.error('データの取得に失敗しました:', error);
    }
});

// 3. カードのHTML（DOM）を生成して画面に表示する関数
function createCardDOM(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${data.imageUrl}" alt="card image" style="width:100%; height:150px; object-fit:cover;">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
    `;
    cardContainer.appendChild(card);
}

// 4. localStorageにデータを保存する関数
function saveCardToStorage(newCard) {
    const currentCards = JSON.parse(localStorage.getItem('myCards')) || [];
    currentCards.push(newCard);
    // localStorageは文字列しか保存できないので、JSON.stringifyする
    localStorage.setItem('myCards', JSON.stringify(currentCards));
}

// 1. バックエンドのURL（データをくれる窓口）
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
                        <img src="${food.imageUrl}" loading="lazy" alt="${food.name}">
                        <h3>${food.name}</h3>
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
                        // <img src="${food.imageUrl}" loading="lazy">
                        // <h3>${food.name}</h3>
                    // </li>
                // `;
            // });
        // });
// }

// document.getElementById('next-button').addEventListener('click', () => {
    // currentPage++;
    // loadFoodPage(currentPage);
// });