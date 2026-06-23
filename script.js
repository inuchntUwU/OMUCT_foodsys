document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  // 通常のページ遷移を防止
  event.preventDefault();

  const cameraInput = document.getElementById('cameraInput');
  const weightInput = document.getElementById('weightInput');
  const expiryInput = document.getElementById('expiryInput');

  // 写真が選択されているかチェック
  if (cameraInput.files.length === 0) {
    alert('写真を撮影してください');
    return;
  }

  // FormDataを作成（これを使うと画像と数値を一緒に送れます）
  const formData = new FormData();
  formData.append('image', cameraInput.files[0]); // 画像ファイル
  formData.append('weight', parseInt(weightInput.value, 10)); // 整数に変換
  formData.append('expiryDays', parseInt(expiryInput.value, 10)); // 整数に変換

  try {
    // サーバーのAPIエンドポイントURLに置き換えてください
    const response = await fetch('/api/upload-food', {
      method: 'POST',
      body: formData // Content-Typeはブラウザが自動で multipart/form-data に設定してくれます
    });

    if (response.ok) {
      const result = await response.json();
      alert('送信に成功しました！');
      console.log(result);
    } else {
      alert('送信に失敗しました');
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    alert('通信エラーが発生しました');
  }
});