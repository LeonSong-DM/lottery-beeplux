部署到服务器（Nginx 反代到本地 8888，挂载到 /lottery/）

本指南目标：
- 后端服务监听本机 8888 端口
- Nginx 将 https://你的域名/lottery/ 转发到该后端
- 服务器域名根路径已有服务，/lottery/ 单独使用本项目

注意：当前前端代码中的 API 请求使用了“绝对路径”（以 / 开头），例如 /getTempData、/getUsers 等。因此如果要把项目放在 /lottery/ 子路径下，需要做“路径处理”，请看「路径处理方案」一节。

一、构建前端
1) 安装依赖并构建
   cd product
   npm install
   npm run build

构建完成后产物在：
   product/dist

二、启动后端（监听 8888）
后端服务会从“当前工作目录”提供静态文件，因此需要在 product/dist 下启动 server.js：

   cd /path/to/lottery/product/dist
   node ../../server/server.js 8888

验证：
   curl -X POST http://127.0.0.1:8888/getUsers
   curl -X POST http://127.0.0.1:8888/getTempData

三、建议用 systemd 守护进程
示例：/etc/systemd/system/lottery.service

   [Unit]
   Description=Lottery Server
   After=network.target

   [Service]
   Type=simple
   WorkingDirectory=/path/to/lottery/product/dist
   ExecStart=/usr/bin/node /path/to/lottery/server/server.js 8888
   Restart=always
   RestartSec=3
   User=www-data
   Group=www-data
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target

启用：
   sudo systemctl daemon-reload
   sudo systemctl enable --now lottery
   sudo systemctl status lottery

四、Nginx 反向代理配置
把以下片段放到你已有的 server 块内（域名根路径已有服务时，只新增 /lottery/ 这一段即可）：

   location /lottery/ {
       proxy_pass http://127.0.0.1:8888/;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }

说明：
- 末尾带 / 的 proxy_pass 会自动去掉 /lottery/ 前缀，转发到后端根路径
- 访问地址为：https://你的域名/lottery/

五、路径处理方案（非常重要）
当前前端代码里 API 使用了绝对路径，例如：
   /getTempData
   /getUsers
   /saveData
   /errorData
   /export

当页面在 /lottery/ 下访问时，浏览器会请求：
   https://你的域名/getTempData
而不是：
   https://你的域名/lottery/getTempData

如果根路径已有服务，可能会冲突。你有两种选择：

方案 A（推荐）：改前端 API 为相对路径
把 product/src/lottery/index.js 里的请求 URL 改为相对路径（去掉前面的 /）：
   "/getTempData"  -> "getTempData"
   "/getUsers"     -> "getUsers"
   "/saveData"     -> "saveData"
   "/errorData"    -> "errorData"
   "/export"       -> "export"

改完后重新 npm run build，并重新部署 product/dist。
这样在 /lottery/ 下访问时，请求会自动带上 /lottery/ 前缀。

方案 B：Nginx 把这些根路径 API 也转发到本服务
如果根路径服务不占用这些接口，可以在 Nginx 增加以下规则：

   location ~ ^/(getTempData|getUsers|saveData|reset|errorData|export)$ {
       proxy_pass http://127.0.0.1:8888;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }

六、常见问题
1) 页面空白或资源 404
   - 确认你访问的是 https://你的域名/lottery/
   - 确认后端工作目录为 product/dist
2) 接口 404 或被其他服务拦截
   - 按「路径处理方案」选择 A 或 B
3) Excel 数据文件路径
   - 用户数据在 server/data/users_.xlsx
   - 抽奖结果会写入 server/data 相关文件
