const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());                // Cho phép frontend gọi từ domain khác
app.use(express.json());        // Cho phép đọc JSON từ client

// File JSON chứa dữ liệu
const dataFile = path.join(__dirname, "data.json");

// =========================
// 1) API LẤY DANH SÁCH
// =========================
app.get("/messages", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
        res.json(data.list);
    } catch (err) {
        res.status(500).json({ error: "Cannot read data file" });
    }
});

app.get("/showcase/messages", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
        res.json(data.list);
    } catch (err) {
        res.status(500).json({ error: "Cannot read data file" });
    }
});


// =========================
// 2) API THÊM MỚI
// =========================
app.post("/messages", (req, res) => {
    const { senderName, content, userId } = req.body;

    // Kiểm tra dữ liệu
    if (!senderName || !content || !userId) {
        return res.status(400).json({
            error: "senderName, content, userId are required"
        });
    }

    try {
        // Đọc file
        const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
        const createdAt = new Date().toISOString();

        // Thêm vào list
        data.list.push({ senderName, content, userId, createdAt });

        // Ghi lại file
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");

        // Trả về list mới
        res.json({ success: true, list: data.list });
    } catch (err) {
        res.status(500).json({ error: "Cannot write to data file" });
    }
});

// =========================
// START SERVER
// =========================
app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
