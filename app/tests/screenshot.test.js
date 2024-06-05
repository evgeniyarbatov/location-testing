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

  locations.forEach(({ name, latitude, longitude }) => {
    it(`take a screenshot for ${name}`, async () => {
      await page.evaluateOnNewDocument(() => {
          navigator.geolocation.getCurrentPosition = cb => {
            setTimeout(() => {
              cb({
                'coords': {
                  accuracy: 21,
                  altitude: null,
                  altitudeAccuracy: null,
                  heading: null,
                  latitude: latitude,
                  longitude: longitude,
                  speed: null
                }
              })
            }, 1000)
          }
      });

      await page.goto(URL);
      await page.click('button#get-location');

      // await page.waitForFunction(() => {
      //   const element = document.querySelector('p#location');
      //   return element && element.textContent.trim() !== '';
      // });

      await page.screenshot({ path: path.join(__dirname, 'screenshots', `${name}.png`) });
    });
  });
});
