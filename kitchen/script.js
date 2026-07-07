const cardContainer = document.getElementById('card-container');
const fetchBtn = document.getElementById('fetch-btn');

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