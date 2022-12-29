const puppeteer = require('puppeteer');

const RENDER_CACHE = new Map();

const ssr = async (url) => {

    if (RENDER_CACHE.has(url)) {
        //return { html: RENDER_CACHE.get(url) };
    }
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    const html = await page.content(); // serialized HTML of page DOM.
    //RENDER_CACHE.set(url, html);
    await browser.close();
    return {html};
}

module.exports = {
    ssr
};