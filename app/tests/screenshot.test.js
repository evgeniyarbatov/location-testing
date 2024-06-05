const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'http://localhost:80';

describe('Screenshot tests', function() {
  let browser;
  let page;

  const locations = [
    { name: 'new-york', latitude: 40.7128, longitude: -74.0060 },
    { name: 'los-angeles', latitude: 34.0522, longitude: -118.2437 },
    { name: 'chicago', latitude: 41.8781, longitude: -87.6298 },
  ];

  before(async () => {
    browser = await puppeteer.launch();

    // Give geolocation permission
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(URL, ['geolocation']);

    page = await browser.newPage();

    // Emulate mobile phone
    await page.setViewport({ width: 375, height: 812, isMobile: true });
  });

  after(async () => {
    await browser.close();
  });

  // Iterate over each location we want to test
  locations.forEach(({ name, latitude, longitude }) => {
    it(`take a screenshot for ${name}`, async () => {
      // Set location for the test
      await page.setGeolocation({
        latitude: latitude, 
        longitude: longitude,
      });

      await page.goto(URL);
      await page.click('button#get-location');

      // Make sure the page loaded after button click
      await page.waitForFunction(() => {
        const element = document.querySelector('p#location');
        return element && element.textContent.trim() !== '';
      });

      await page.screenshot({ path: path.join(__dirname, 'screenshots', `${name}.png`) });
    });
  });
});
