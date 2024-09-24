import { fileURLToPath } from 'url';
import path from 'path';
import puppeteer from 'puppeteer';
import express from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====[Settings]=====

const SEARCH_BOT = [
    'googlebot', // Google
    'bingbot', // Bing
    'slurp', // Yahoo
    'duckduckbot', // DuckDuckGo
    'baiduspider', // Baidu
    'yandexbot', // Yandex
    'sogou', // Sogou
    'exabot', // Exalead
    'facebot', // Facebook
    'ia_archiver', // Alexa 
    'facebookexternalhit', // Facebook external hit
    'twitterbot', // Twitter bot
    'linkedinbot', // LinkedIn bot
    'pinterestbot', // Pinterest bot
    'line-poker', // Line link preview bot
    'linebot', // Other Line bot types    
    'bot' // Other bot keyword
];
const PORT = 7777;
const DOMAIN = 'http://localhost:7777'
const CACHE_TTL = 1000; // 快取 TTL 設定 (60 秒)
const FOLDER = 'dist';
const INDEX = 'index.html'

// ====================


const app = express();
let pageCache = new Map();  // 用於快取爬蟲渲染的頁面

// 檢查是否來自搜尋爬蟲的 User-Agent
function isSearchBot(req) {
    const userAgent = req.headers['user-agent'].toLowerCase();
    return SEARCH_BOT.some(bot => userAgent.includes(bot));
}

// 中間件：檢測 User-Agent 並使用 Puppeteer 渲染頁面
async function ua(req, res, next) {
    if (req.headers.accept.includes('text/html') && isSearchBot(req)) {
        const cacheKey = req.url;

        // 如果有快取且未過期，返回快取的內容
        if (pageCache.has(cacheKey) && Date.now() - pageCache.get(cacheKey).timestamp < CACHE_TTL) {
            console.log(`Serving from cache: ${cacheKey}`);
            return res.end(pageCache.get(cacheKey).htmlContent);
        }

        let browser = null;
        try {
            // 啟動 Puppeteer 並渲染頁面
            browser = await puppeteer.launch({
                headless: true, // 使用無頭模式
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // 避免權限問題
            });
            const page = await browser.newPage();

            // 自動處理對話框（如 alert, confirm 等）
            page.on('dialog', async dialog => {
                await dialog.accept();
            });

            // 設定超時以避免過久等待
            await page.goto(`${DOMAIN}${req.url}`, { waitUntil: 'networkidle0', timeout: 30000 });
            const htmlContent = await page.content();  // 獲取頁面內容

            // 將渲染結果加入快取
            pageCache.set(cacheKey, {
                htmlContent,
                timestamp: Date.now()
            });

            // 傳回渲染結果
            res.write(htmlContent);
            res.end();
        } catch (err) {
            console.error(`Error rendering ${req.url}:`, err);
            res.status(500).send('Error rendering page');
        } finally {
            if (browser) {
                await browser.close(); // 確保瀏覽器被關閉
            }
        }
    } else {
        next();
    }
}

// 設定靜態文件路徑
app.use(ua, express.static(path.join(__dirname, FOLDER)));

// 使用中間件處理所有請求
app.get('*', ua, (req, res) => {
    res.sendFile(path.join(__dirname, FOLDER, INDEX));
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
