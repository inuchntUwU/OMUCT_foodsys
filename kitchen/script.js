// kitchen/script.js
import { requireAuth, getIdToken } from "../auth.js";
import React, { useState, useEffect } from 'react';

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

//ここから下が拡大表示コード

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
          // 変更点1: MongoDBのIDは _id
          const isOpen = selectedId === food._id;

          return (
            <div
              key={food._id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(isOpen ? null : food._id); // クリックで開閉トグル
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
                  {/* 変更点2: スキーマの image_path を使用 */}
                  {food.image_path ? (
                    <img src={food.image_path} alt={food.food_name} className="w-full h-full object-cover" />
                  ) : (
                    '📷'
                  )}
                </div>
                {/* 変更点3: スキーマの food_name を使用 */}
                <p className="mt-2 font-bold text-gray-800 text-sm truncate">
                  {food.food_name}
                </p>
              </div>

              {/* 右側：展開時のみ表示される情報（名前・重さ・賞味期限） */}
              {isOpen && (
                <div className="ml-6 flex-grow border-l pl-6 border-gray-200 text-sm text-gray-700">
                  {/* 食材名 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 truncate">
                    {food.food_name}
                  </h3>

                  {/* 詳細情報 */}
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-400">重さ/数量:</span>
                      <span className="font-semibold text-gray-800">
                        {/* 変更点4: 数値のweightに単位(g)を付与（nullの場合は未設定） */}
                        {food.weight !== null && food.weight !== undefined ? `${food.weight} g` : '未設定'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">賞味期限:</span>
                      <span className="font-bold text-red-500">
                        {/* 変更点5: スキーマの expiration_date を使用 */}
                        {food.expiration_date || '未設定'}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
