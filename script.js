const galleryBtn = document.getElementById("galleryBtn");
const galleryInput = document.getElementById("galleryInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");

let currentFrameSrc = "frame1.png";
let userImage = null;

// เลือกกรอบ
document.querySelectorAll(".frame-option").forEach(frameEl => {
  frameEl.addEventListener("click", () => {
    document.querySelectorAll(".frame-option").forEach(el => el.classList.remove("selected"));
    frameEl.classList.add("selected");
    currentFrameSrc = frameEl.dataset.frame;
    if (userImage) drawCanvas(userImage, currentFrameSrc);
  });
});

// เลือกจากแกลอรี่
galleryBtn.addEventListener("click", () => galleryInput.click());
galleryInput.addEventListener("change", handleFile);

// โหลดภาพ
function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      userImage = img;
      drawCanvas(userImage, currentFrameSrc);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// วาด canvas
function drawCanvas(userImg, frameSrc) {
  const frame = new Image();
  frame.onload = function() {
    const maxSize = 720;
    let frameW = frame.width;
    let frameH = frame.height;

    if (frameW > maxSize || frameH > maxSize) {
      const ratio = Math.min(maxSize / frameW, maxSize / frameH);
      frameW = Math.round(frameW * ratio);
      frameH = Math.round(frameH * ratio);
    }

    canvas.width = frameW;
    canvas.height = frameH;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(frameW / userImg.width, frameH / userImg.height);
    const newWidth = userImg.width * scale;
    const newHeight = userImg.height * scale;
    const x = (frameW - newWidth) / 2;
    const y = (frameH - newHeight) / 2;

    ctx.drawImage(userImg, x, y, newWidth, newHeight);
    ctx.drawImage(frame, 0, 0, frameW, frameH);
  };
  frame.src = frameSrc;
}

// ดาวน์โหลด
downloadBtn.addEventListener("click", () => {
  if (!userImage) return alert("กรุณาเลือกภาพก่อนดาวน์โหลด");

  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);

    // เปิดแท็บใหม่ (LINE จะให้ user กดเซฟภาพเอง)
    window.open(url, "_blank");

    // ปล่อย URL หลังใช้
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
});


