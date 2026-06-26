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
const video = document.querySelector('#video');
const canvas = document.createElement('canvas');

initVideoCamera();
initPhoto();
document.querySelector('#shoot').addEventListener('click', photoShoot);

/**
 * ビデオのカメラ設定(デバイスのカメラ映像をビデオに表示)
 */
function initVideoCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch(e => console.log(e));
}

/**
 * 写真の初期描画
 */
function initPhoto() {
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#photo").src = canvas.toDataURL("image/png");
}

/**
 * 写真の撮影描画
 */
function photoShoot() {
    let drawSize = calcDrawSize();
    canvas.width = drawSize.width;
    canvas.height = drawSize.height;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    document.querySelector("#photo").src = canvas.toDataURL("image/png");
}

/**
 * 描画サイズの計算
 * 縦横比が撮影(video)が大きい時は撮影の縦基準、それ以外は撮影の横基準で計算
 */
function calcDrawSize() {
    let videoRatio = video.videoHeight / video.videoWidth;
    let viewRatio = video.clientHeight / video.clientWidth;
    return videoRatio > viewRatio ?
        { height: video.clientHeight, width: video.clientHeight / videoRatio }
        : { height: video.clientWidth * videoRatio, width: video.clientWidth }
}