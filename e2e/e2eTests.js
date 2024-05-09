const { chromium } = require("playwright");

describe("End-to-End Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it("Should log in successfully", async () => {
    await page.goto("https://users.metropolia.fi/~mikaelea/b/views/");
  });

  it("Should add item to cart", async () => {
    await page.goto("https://users.metropolia.fi/~mikaelea/b/views/");

    it("Should place an order", async () => {
      await page.goto("https://users.metropolia.fi/~mikaelea/b/views/");
    });

    it("Should update user profile", async () => {
      await page.goto(
        "https://users.metropolia.fi/~mikaelea/b/views/login.html"
      );
    });

    it("Should log out successfully", async () => {
      await page.goto(
        "https://users.metropolia.fi/~mikaelea/b/views/login.html"
      );
    });
  });
});
