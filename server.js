const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// ✅ ใช้ path แบบชัดเจนและปลอดภัยสำหรับ Render
const distFolder = path.join(__dirname, 'dist', 'project');

app.use(express.static(distFolder));

app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
