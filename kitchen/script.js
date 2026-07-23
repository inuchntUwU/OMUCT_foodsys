const foodContainer = document.getElementById('food-container');
const BACKEND_URL = 'https://food-system-backend-4vmg.onrender.com';

<<<<<<< HEAD
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
=======
// ページ読み込み時にバックエンドから食材一覧を取得する
window.addEventListener('DOMContentLoaded', fetchFoodList);
>>>>>>> 916eaa2bf8daf540c214a3ba9c353d8f47996481

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






import React, { useState, useEffect } from 'react';

// 食材データを取得するAPIのリンク（URL）
const DATA_URL = 'https://food-system-backend-4vmg.onrender.com'; 

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // データ取得
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        setFoods(data);
      } catch (err) {
        console.error('データ取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-500 text-white font-bold">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-blue-500 p-8">
      
      {/* 💡 カード展開時：枠外（画面全体）タップで元に戻る完全透明レイヤー */}
      {selectedId !== null && (
        <div
          className="fixed inset-0 z-10 bg-transparent cursor-default"
          onClick={() => setSelectedId(null)}
        />
      )}

      {/* 💡 食材カード一覧 */}
      <div className="relative z-20 flex flex-wrap justify-center gap-4">
        {foods.map((food) => {
          const isOpen = selectedId === food.id;

          return (
            <div
              key={food.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(isOpen ? null : food.id); // クリックで開閉トグル
              }}
              style={{ transition: 'all 0.3s ease-in-out' }}
              className={`
                cursor-pointer bg-white rounded-2xl p-4 shadow-lg flex items-center overflow-hidden
                ${isOpen ? 'w-[480px]' : 'w-44'} 
              `}
            >
              {/* 左側：画像と名前 */}
              <div className="w-36 flex-shrink-0 text-center">
                <div className="w-full h-24 bg-black rounded-lg flex items-center justify-center text-white overflow-hidden">
                  {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    '📷'
                  )}
                </div>
                <p className="mt-2 font-bold text-gray-800 text-sm truncate">
                  {food.name}
                </p>
              </div>

              {/* 右側：展開時のみ表示される情報（名前・重さ・賞味期限） */}
              {isOpen && (
                <div className="ml-6 flex-grow border-l pl-6 border-gray-200 text-sm text-gray-700">
                  {/* 食材名 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 truncate">
                    {food.name}
                  </h3>

                  {/* 詳細情報 */}
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-400">重さ/数量:</span>
                      <span className="font-semibold text-gray-800">{weight}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">賞味期限:</span>
                      <span className="font-bold text-red-500">{expiration_date}</span>
                    </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


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

