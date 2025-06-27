const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const ipsFile = path.join(__dirname, 'ips.json');

// 提供静态文件，允许访问上级目录下的index.html
app.use(express.static(path.join(__dirname, '..')));

// 访问根路径返回 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 接收访客IP，记录访问次数
app.post('/save-ip', (req, res) => {
  const ip = req.body.ip;
  if (!ip) {
    return res.status(400).json({ error: 'IP 地址不能为空' });
  }

  // 读取已有数据
  let data = {};
  if (fs.existsSync(ipsFile)) {
    const content = fs.readFileSync(ipsFile, 'utf8');
    if (content) {
      try {
        data = JSON.parse(content);
      } catch (err) {
        console.error('解析 ips.json 失败:', err);
      }
    }
  }

  // 计数累加
  data[ip] = (data[ip] || 0) + 1;

  // 保存回文件
  fs.writeFileSync(ipsFile, JSON.stringify(data, null, 2));

  // 返回结果
  res.json({ ip, views: data[ip] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


