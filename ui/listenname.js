const http = require('http');
const fs = require('fs');

// 创建一个HTTP服务器
const server = http.createServer((req, res) => {
    // 检查请求方法是否为GET
    if (req.method === 'GET') {
        // 获取请求的URL
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        // 获取查询参数
        const queryParams = url.searchParams;
        
        // 获取要写入文件的内容
        const content = queryParams.get('content');
        
        // 写入内容到文件（覆盖）
        try {
            fs.writeFileSync('name.txt', content);
            console.log('Content written to file successfully');
            res.statusCode = 200;
            res.end("<script>window.location.replace('//127.0.0.1:1017/setname.bat');</script>");
        } catch (err) {
            console.error('Error writing to file:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
});

// 服务器监听的端口
const PORT = 1016;

// 启动服务器
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
