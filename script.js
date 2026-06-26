const video = document.querySelector('#video');
const canvas = document.createElement('canvas');
const submitBtn = document.querySelector('#submitBtn');
 
// 撮影済み画像を保持するBlob
let capturedBlob = null;
 
initVideoCamera();
initPhoto();
document.querySelector('#shoot').addEventListener('click', photoShoot);
 
// ビデオのカメラ設定(デバイスのカメラ映像をビデオに表示)

function initVideoCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch(e => console.log(e));
}
 
// 写真の初期描画

function initPhoto() {
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#photo").src = canvas.toDataURL("image/png");
}
 
// 写真の撮影描画
function photoShoot() {
    let drawSize = calcDrawSize();
    canvas.width = drawSize.width;
    canvas.height = drawSize.height;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    document.querySelector("#photo").src = canvas.toDataURL("image/png");
 
    // canvasの内容をBlobに変換して保持、送信ボタンを有効化
    canvas.toBlob((blob) => {
        capturedBlob = blob;
        submitBtn.disabled = false;
    }, 'image/png');
}
 
// 描画サイズの計算
// 縦横比が撮影(video)が大きい時は撮影の縦基準、それ以外は撮影の横基準で計算
function calcDrawSize() {
    let videoRatio = video.videoHeight / video.videoWidth;
    let viewRatio = video.clientHeight / video.clientWidth;
    return videoRatio > viewRatio ?
        { height: video.clientHeight, width: video.clientHeight / videoRatio }
        : { height: video.clientWidth * videoRatio, width: video.clientWidth };
}
 
// fetch
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
 
    // 撮影済みか
    if (!capturedBlob) {
        alert('写真を撮影してください');
        return;
    }
 
    const weightInput = document.getElementById('weightInput');
    const expiryInput = document.getElementById('expiryInput');
 
    // FormDataに画像と数値をセット
    const formData = new FormData();
    formData.append('image', capturedBlob, 'photo.png'); // 撮影画像(png)
    formData.append('weight', parseInt(weightInput.value, 10));// 重量(g)
    formData.append('expiryDate', expiryInput.value);// 賞味期限(YYYY-MM-DD)
 
    try {
        // サーバーのAPIまち
        const response = await fetch('/api/upload-food', {
            method: 'POST',
            body: formDatas
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
 