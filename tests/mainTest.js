const assert = require("assert");
const sinon = require("sinon");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const {
  getDaysMenu,
  fetchMenuByDate,
  fetchAndDisplayOffers,
  sendOrder,
  sendJoinOrder,
  updateButtonVisibility,
} = require("./koodi.js");

const { window } = new JSDOM();
global.fetch = fetch;
global.document = window.document;

describe("getDaysMenu", () => {
  it("should fetch menu for the given date and year", async () => {
    const today = new Date();
    const year = today.getFullYear();
    const date = today.toISOString().slice(0, 10);
    const fetchMenuStub = sinon.stub(global, "fetch").resolves({
      ok: true,
      json: () => [{ burger_id: 1 }],
    });

    await getDaysMenu(date, year);

    assert(fetchMenuStub.calledOnceWith(`${date}${year}`));
    fetchMenuStub.restore();
  });

  it("should handle error when fetching menu", async () => {
    const today = new Date();
    const year = today.getFullYear();
    const date = today.toISOString().slice(0, 10);
    const fetchMenuStub = sinon
      .stub(global, "fetch")
      .rejects(new Error("Failed to fetch menu"));

    await getDaysMenu(date, year);

    fetchMenuStub.restore();
  });
});
describe("fetchAndDisplayOffers", () => {
  it("should fetch and display offers", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const fetchStub = sinon.stub(global, "fetch");
    fetchStub.onFirstCall().resolves({
      ok: true,
      json: () => [{ burger_id: 1 }],
    });
    fetchStub.onSecondCall().resolves({
      ok: true,
      json: () => [{ start_date: today, end_date: today }],
    });

    await fetchAndDisplayOffers();

    assert(fetchStub.calledTwice);
    fetchStub.restore();
  });

  it("should handle error when fetching offers", async () => {
    const fetchStub = sinon
      .stub(global, "fetch")
      .rejects(new Error("Failed to fetch offers"));

    await fetchAndDisplayOffers();

    fetchStub.restore();
  });
});

describe("sendOrder", () => {
  it("should send order successfully", async () => {
    const mockOrderId = 123;
    sinon.stub(global, "fetch").resolves({
      ok: true,
      json: () => ({ order_id: mockOrderId }),
    });

    const orderId = await sendOrder(1);

    assert.strictEqual(orderId, mockOrderId);
  });

  it("should handle error when sending order", async () => {
    const errorMessage = "Failed to send order";
    sinon.stub(global, "fetch").rejects(new Error(errorMessage));

    try {
      await sendOrder(1);
    } catch (error) {
      assert.strictEqual(error.message, errorMessage);
    }
  });
});
