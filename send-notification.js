// send-notification.js

// Lịch trình của bạn
const schedule = [
    { time: "06:30", task: "Dậy thôi! Chuẩn bị cho một ngày mới nào!" },
    { time: "07:00", task: "Đến giờ đi làm rồi, xuất phát thôi!" },
    { time: "12:00", task: "Nghỉ trưa thôi! Nhớ ăn uống đầy đủ nhé." },
    { time: "12:30", task: "Power Nap 15 phút hoặc lên kế hoạch chiều nay." },
    { time: "17:15", task: "Tan làm rồi, lên xe về nhà cẩn thận nhé!" },
    { time: "19:00", task: "Giờ Vàng Gia Đình! Chơi với con thôi." },
    { time: "21:30", task: "Bắt đầu giờ 'Deep Work' cho tương lai!" },
    { time: "22:45", task: "Tắt máy, bắt đầu 'Hạ nhiệt' để chuẩn bị ngủ." },
    { time: "23:15", task: "Lên giường ngủ thôi! Chúc ngủ ngon." }
];

// Lấy khóa API từ GitHub Secrets
const userKey = process.env.PUSHOVER_USER_KEY;
const apiToken = process.env.PUSHOVER_API_TOKEN;

if (!userKey || !apiToken) {
    console.error("Lỗi: Không tìm thấy PUSHOVER_USER_KEY hoặc PUSHOVER_API_TOKEN. Hãy kiểm tra lại GitHub Secrets.");
    process.exit(1); // Thoát nếu thiếu key
}

// Hàm lấy giờ hiện tại ở Việt Nam (UTC+7)
function getCurrentVietnamTime() {
    const now = new Date();
    // Chuyển đổi sang múi giờ Asia/Ho_Chi_Minh
    const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const hours = vietnamTime.getHours().toString().padStart(2, '0');
    const minutes = vietnamTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Hàm gửi thông báo qua Pushover
async function sendPushoverNotification(task) {
    console.log(`Đến giờ! Đang gửi thông báo: "${task}"`);
    try {
        const response = await fetch("https://api.pushover.net/1/messages.json", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: apiToken,
                user: userKey,
                title: "🔔 Nhắc nhở lịch trình!",
                message: task,
                sound: "pushover"
            })
        });

        if (response.ok) {
            console.log("Gửi thông báo thành công!");
        } else {
            const errorData = await response.json();
            console.error("Gửi thông báo thất bại:", errorData);
        }
    } catch (error) {
        console.error("Lỗi mạng khi gửi thông báo:", error);
    }
}

// Hàm chính để kiểm tra lịch trình
function checkSchedule() {
    const currentTime = getCurrentVietnamTime();
    console.log(`Kiểm tra lúc: ${currentTime} (Giờ Việt Nam)`);

    const scheduledTask = schedule.find(item => item.time === currentTime);
    if (scheduledTask) {
        sendPushoverNotification(scheduledTask.task);
    } else {
        console.log("Chưa đến giờ thông báo.");
    }
}

// Chạy hàm chính
checkSchedule();
