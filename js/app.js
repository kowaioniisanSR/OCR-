const imageInput = document.getElementById("imageInput");
const pasteArea = document.getElementById("pasteArea");
const extractButton = document.getElementById("extractTextButton");
const resultElement = document.getElementById("extractedText");
const statusElement = document.getElementById("status");
const copyButton = document.getElementById("copyTextButton");
const imagePreview = document.getElementById("imagePreview");
const imageContainer = document.getElementById("imageContainer");
const deleteImageButton = document.getElementById("deleteImageButton");
const maxImageSize = 15 * 1024 * 1024;
const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

let selectedImage = null;
let previewUrl = null;
let isRecognizing = false;

deleteImageButton.disabled = true;

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) setImage(file);
});

pasteArea.addEventListener("paste", (event) => {
    const items = [...(event.clipboardData?.items || [])];
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    const file = imageItem?.getAsFile() || event.clipboardData?.files?.[0];

    if (file?.type.startsWith("image/")) {
        event.preventDefault();
        setImage(file);
    } else {
        setStatus("クリップボードに画像がありません。スクリーンショットをコピーしてください。");
    }
});

extractButton.addEventListener("click", async () => {
    if (!selectedImage) {
        setStatus("画像を選択するか、貼り付けエリアに画像を貼り付けてください。");
        return;
    }

    if (!window.Tesseract) {
        setStatus("OCRライブラリを読み込めません。インターネット接続を確認してください。");
        return;
    }

    isRecognizing = true;
    extractButton.disabled = true;
    imageInput.disabled = true;
    copyButton.disabled = true;
    deleteImageButton.disabled = true;
    resultElement.value = "";
    setStatus("OCRエンジンを準備しています…");

    try {
        const { data } = await Tesseract.recognize(selectedImage, "jpn+eng", {
            workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js",
            corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0",
            langPath: "https://tessdata.projectnaptha.com/4.0.0",
            workerBlobURL: true,
            logger: (message) => {
                if (message.status === "recognizing text") {
                    const percent = Math.round((message.progress || 0) * 100);
                    setStatus(`文字を読み取っています… ${percent}%`);
                }
            }
        });

        resultElement.value = data.text.trim();
        copyButton.disabled = !resultElement.value;
        setStatus(resultElement.value
            ? "読み取りが完了しました。"
            : "文字を読み取れませんでした。画像を確認してください。");
    } catch (error) {
        console.error(error);
        setStatus("読み取りに失敗しました。インターネット接続を確認してください。");
    } finally {
        isRecognizing = false;
        extractButton.disabled = false;
        imageInput.disabled = false;
        deleteImageButton.disabled = !selectedImage;
    }
});

copyButton.addEventListener("click", async () => {
    const text = resultElement.value;
    if (!text) return;

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            resultElement.select();
            document.execCommand("copy");
        }
        setStatus("読み取り結果をコピーしました。");
    } catch (error) {
        console.error(error);
        setStatus("コピーできませんでした。テキストを選択してコピーしてください。");
    }
});

function setImage(file) {
    if (isRecognizing) return;

    if (!allowedImageTypes.has(file.type)) {
        setStatus("PNG、JPEG、WebP形式の画像を選択してください。");
        return;
    }

    if (file.size > maxImageSize) {
        setStatus("画像は15MB以下のファイルを選択してください。");
        imageInput.value = "";
        return;
    }

    selectedImage = file;
    resultElement.value = "";
    copyButton.disabled = true;
    deleteImageButton.disabled = false;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    imagePreview.src = previewUrl;
    imagePreview.hidden = false;
    imageContainer.hidden = false;

    setStatus("画像を読み込みました。「文字を抽出」を押してください。");
}

function setStatus(message) {
    statusElement.textContent = message;
}

deleteImageButton.addEventListener("click", () => {
    if (isRecognizing || !selectedImage) return;

    selectedImage = null;
    imageInput.value = "";
    imagePreview.removeAttribute("src");
    imagePreview.hidden = true;
    imageContainer.hidden = true;
    resultElement.value = "";
    copyButton.disabled = true;
    deleteImageButton.disabled = true;

    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    setStatus("画像と読み取り結果を削除しました。");
});