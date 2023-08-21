import puppeteer, { Browser } from "puppeteer";

export interface SpiderProps {
    url: string;
}

class Spider {

    private props: SpiderProps;
    private browser?: Browser;

    constructor(props: SpiderProps) {
        this.props = props;
    }

    private async getBrowser() {
        if (this.browser) return this.browser;
        this.browser = await puppeteer.launch({
            ...(process.env.CHROMIUM && { executablePath: process.env.CHROMIUM }),
            timeout: 60000,
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        return this.browser;
    }

    async getPreview() {
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
        await page.goto(this.props.url);
        const content = await page.content();
        return content;
    }

    async close() {
        await this.browser?.close();
    }
}

export default Spider;