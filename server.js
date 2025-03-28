const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// เปลี่ยนจาก dist/project เป็น dist/project/browser
const distPath = path.join(__dirname, 'dist', 'project', 'browser');
console.log('Dist path:', distPath);

if (fs.existsSync(distPath)) {
  console.log('Dist folder exists. Files:', fs.readdirSync(distPath));
} else {
  console.log('Dist folder does not exist!');
}

app.use(express.static(distPath));

app.get('/*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
