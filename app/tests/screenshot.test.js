const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'http://localhost:80';

describe('Screenshot tests', function() {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch();

    // Give geolocation permission
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(URL, ['geolocation']);

    page = await browser.newPage();

    // Render mobile site page
    await page.setViewport({ width: 375, height: 812, isMobile: true });
  });

  after(async () => {
    await browser.close();
  });

  it('take a screenshot', async () => {
    await page.evaluateOnNewDocument( () => {
        navigator.geolocation.getCurrentPosition = cb => {
            setTimeout(() => {
                cb({
                    'coords': {
                        accuracy: 21,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        latitude: 1.3118026738144866,
                        longitude: 103.88932403191866,
                        speed: null
                    }
                })
            }, 1000)
        }
    });

    await page.goto(URL);

    await page.click('button#get-location');

    let name = 'current-location';
    await page.screenshot({ path: path.join(__dirname, 'screenshots', `${name}.png`) });
  });
});
