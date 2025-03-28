const express = require('express');
const path = require('path');
const app = express();

// เสิร์ฟไฟล์ static จากโฟลเดอร์ dist/project
const distPath = path.join(__dirname, 'dist', 'project');
app.use(express.static(distPath));

// ส่ง index.html สำหรับทุกเส้นทาง
app.get('/*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath); // Debug log
  res.sendFile(indexPath);
});

// ใช้พอร์ตจาก environment variable หรือ fallback เป็น 10000
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
