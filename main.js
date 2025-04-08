let isProcessing = false;
   
       
// Cấu hình Firebase
const firebaseConfig = {
apiKey: "AIzaSyCstVjJU-Ux0JZbeAcWY4y7l5q9cfDJCDg",
authDomain: "menukoder2.firebaseapp.com",
databaseURL: "https://menukoder2-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "menukoder2",
storageBucket: "menukoder2.firebasestorage.app",
messagingSenderId: "820376638525",
appId: "1:820376638525:web:aeb36e5c1f5184ffbb4654",
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database(); 
// thông báo
function closeNotification() {
     document.getElementById("notificationBox").style.display = "none";
 }

 // Hàm hiển thị thông báo
 function displayNotification(message) {
     const notificationBox = document.getElementById("notificationBox");
     const notificationMessage = document.getElementById("notificationMessage");

     notificationMessage.innerHTML = message;
     notificationBox.style.display = "block";
 }

 // Lắng nghe thông báo từ Firebase
 function listenForNotifications() {
     db.ref("notifications").on("child_added", (snapshot) => {
         const notification = snapshot.val();
         console.log("Thông báo nhận được:", notification);

         // Hiển thị thông báo
         displayNotification(notification.message);
     });
 }

 // Khởi động việc lắng nghe thông báo khi trang được tải
 listenForNotifications(); 


function checkMaintenance() {
db.ref("/maintenance").on("value", (snapshot) => {
 const isMaintenance = snapshot.val();
 const content = document.getElementById("content");
 const maintenanceMessage = document.getElementById("maintenanceMessage");

 if (isMaintenance) {
     content.style.display = "none"; 
     maintenanceMessage.style.display = "block";

     // Lấy nội dung thông báo bảo trì từ Firebase
     db.ref("/maintenanceMessage").once("value").then((messageSnapshot) => {
         const maintenanceText = messageSnapshot.val();
         if (maintenanceText) {
             maintenanceMessage.innerHTML = maintenanceText; // Cập nhật nội dung từ server
         } else {
             maintenanceMessage.innerHTML = "Hệ thống đang bảo trì, vui lòng quay lại sau!";
         }
     }).catch((error) => {
         console.error("Lỗi tải nội dung bảo trì:", error);
         maintenanceMessage.innerHTML = "Hệ thống đang bảo trì, vui lòng quay lại sau!";
     });

 } else {
     content.style.display = "block"; 
     maintenanceMessage.style.display = "none"; 
 }
});
}

checkMaintenance(); 

function verifyKey() {
const inputKey = document.getElementById("keyInput").value.trim();
const now = new Date();
const keyRef = db.ref("daily_key");

keyRef.once("value")
 .then((snapshot) => {
     const keyData = snapshot.val();
     if (!keyData) {
         alert("🚫 Không tìm thấy dữ liệu key!");
         return;
     }

     let isValid = false;

     for (let keyID in keyData) {
         let keyInfo = keyData[keyID];

         if (!keyInfo.key || !keyInfo.startDate || !keyInfo.endDate) continue; 

         const start = new Date(keyInfo.startDate);
         const end = new Date(keyInfo.endDate);

         if (inputKey === keyInfo.key) {
             if (now < start) {
                 alert("⏳ Key chưa tới ngày kích hoạt!");
                 return;
             }
             if (now > end) {
                 alert("❌ Key đã hết hạn!");
                 return;
             }

             isValid = true;
             break;
         }
     }

     if (isValid) {
         alert("✅ Key chính xác! Đang truy cập menu...");
         // Cập nhật lượt đăng nhập vào Firebase
         function updateKeyUsage() {
const dbRef = db.ref("key_log");
const now = new Date();

// Định dạng ngày, tuần và tháng
const dailyKey = now.toISOString().split("T")[0]; // YYYY-MM-DD
const weeklyKey = `${now.getFullYear()}-${Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7)}`; // YYYY-WW
const monthlyKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

// Hàm cập nhật giá trị trong Firebase
function incrementCount(refPath) {
 db.ref(refPath).transaction((count) => (count || 0) + 1);
}

// Cập nhật dữ liệu
incrementCount(`key_log/daily/${dailyKey}`);
incrementCount(`key_log/weekly/${weeklyKey}`);
incrementCount(`key_log/monthly/${monthlyKey}`);
}


// Gọi hàm này khi key nhập thành công
updateKeyUsage();

         document.getElementById("menu").style.display = "block";
         document.getElementById("keyInput").style.display = "none";
         document.getElementById("verifyBtn").style.display = "none";
         document.getElementById("titlekey").style.display = "none";
         document.getElementById("newtitle").style.display = "none";
         document.getElementById("getkey").style.display = "none";
         document.getElementById("footerby").style.display = "none";
         document.getElementById("mxhkey").style.display = "none";
         document.getElementById("hrmxh").style.display = "none";
         document.getElementById("grkey").style.display = "none";
         document.getElementById("ytbkey").style.display = "none";
         document.getElementById("shopkey").style.display = "none";
     } else {
         alert("❌ Sai key rồi bro!");
     }
 })
 .catch((error) => {
     console.error("Lỗi truy vấn Firebase:", error);
     alert("🚫 Lỗi kết nối Firebase hoặc key không tồn tại.");
 });
}


function hideMenu() {
    document.getElementById("menuBox").style.display = "none";
}

//thông báo và chặn 
// Hàm đóng thông báo và ẩn overlay
function closeNotification() {
document.getElementById("notificationBox").style.display = "none";
document.getElementById("overlay").style.display = "none";
}

// Hàm hiển thị thông báo và hiển thị overlay
function displayNotification(message) {
const notificationBox = document.getElementById("notificationBox");
const notificationMessage = document.getElementById("notificationMessage");

notificationMessage.innerHTML = message;
notificationBox.style.display = "block";
document.getElementById("overlay").style.display = "block";  // Hiển thị overlay để che chắn trang
}


// marquee
// Lấy nội dung marquee từ Firebase và cập nhật
function loadMarqueeContent() {
 const marqueeElement = document.getElementById("marqueeContent");

 db.ref("marqueeContent").once("value", (snapshot) => {
     const data = snapshot.val();
     if (data) {
         marqueeElement.textContent = data.content;
     }
 });
}

window.onload = loadMarqueeContent;

let isCooldown = false;

function playBeep() {
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "square";
oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
oscillator.start();

setTimeout(() => {
 oscillator.stop();
}, 100);
}

function toggleFeature(button, featureName) {
if (isCooldown) return;

isCooldown = true;
button.disabled = true;

const isActive = button.classList.contains("active");

if (isActive) {
 button.classList.remove("active");
 showNotify(`${featureName}: OFF`);
} else {
 button.classList.add("active");
 showNotify(`${featureName}: ON`);
}

playBeep();

setTimeout(() => {
 button.disabled = false;
 isCooldown = false;
}, 2000);
}

function showNotify(message) {
const notify = document.getElementById("notify");
const text = document.getElementById("notify-text");
text.textContent = message;

// reset checkmark animation
const checkmark = notify.querySelector(".checkmark");
checkmark.style.animation = "none";
void checkmark.offsetWidth; // trigger reflow
checkmark.style.animation = "";

notify.classList.add("show");

setTimeout(() => {
 notify.classList.remove("show");
}, 2000);
}

// nền cho panel
particlesJS("particles-js", {
     particles: {
         number: { value: 80, density: { enable: true, value_area: 800 } },
         color: { value: "#008cff" },
         shape: { type: "circle" },
         opacity: { value: 0.5, random: true },
         size: { value: 3, random: true },
         line_linked: {
             enable: true,
             distance: 250,
             color: "#008cff",
             opacity: 0.4,
             width: 1
         },
         move: {
             enable: true,
             speed: 2,
             direction: "none",
             random: false,
             straight: false,
             out_mode: "out",
             bounce: false
         }
     },
     interactivity: {
         detect_on: "canvas",
         events: {
             onhover: { enable: true, mode: "grab" },
             onclick: { enable: true, mode: "push" }
         },
         modes: {
             grab: { distance: 200, line_linked: { opacity: 1 } },
             push: { particles_nb: 4 }
         }
     },
     retina_detect: true
 });

 // xử lý code
 function handleFile() {
document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", function (event) {
const file = event.target.files[0];
if (!file) return;

const popup = document.createElement("div");
popup.className = "center-popup";
document.body.appendChild(popup);

// Kiểm tra tên file
if (file.name !== "nchoaifree.py") {
popup.innerHTML = ' <span class="gear-icon">⚙️</span><div>Đang khởi động file...</div>';
popup.style.display = "block";

setTimeout(() => {
popup.innerHTML = '❌ Thất bại: File không đúng!';
setTimeout(() => popup.remove(), 2500);
}, 3000);
return;
}

// Đọc nội dung file và kiểm tra chữ "NC Hoài"
const reader = new FileReader();
reader.onload = function(e) {
const fileContent = e.target.result;

if (fileContent.includes("NC Hoài")) {
popup.innerHTML = ' <span class="gear-icon">⚙️</span><div>Đang khởi động file...</div>';
popup.style.display = "block";

setTimeout(() => {
 popup.innerHTML = '<span class="success-icon">✔️ Thành công </span><div> Code được tạo bởi NC Hoài <br> Loại: free</div>';
 setTimeout(() => popup.remove(), 3000);
}, 3000);
} else {
popup.innerHTML = ' <span class="gear-icon">⚙️</span><div>Đang khởi động file...</div>';
popup.style.display = "block";

setTimeout(() => {
 popup.innerHTML = '❌ Thất bại: Nội dung file không hợp lệ!';
 setTimeout(() => popup.remove(), 2500);
}, 3000);
}
};

reader.readAsText(file); // Đọc file như một văn bản
});
// Ngăn chặn F12, Ctrl+Shift+I, Ctrl+Shift+J
document.addEventListener('keydown', function(e) {
if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
e.preventDefault();  // Ngăn không cho mở DevTools
}
});

// Ngăn chặn sao chép văn bản
document.addEventListener('copy', function(e) {
e.preventDefault();  // Ngăn không cho sao chép
});

// Ngăn chặn chuột phải
document.addEventListener('contextmenu', function(e) {
e.preventDefault();  // Ngăn không cho mở menu chuột phải
});
