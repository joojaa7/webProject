import ShoppingCart from "./shoppingCart.js";

const mockLocalStorage = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe("Integration tests for main module", () => {
  it("should update cart display after adding an item", async () => {
    const item = {
      id: 1,
      name: "Test Item",
      price: 10.99,
    };

    ShoppingCart.addItem(item);

    expect(document.getElementById("cart-items").innerHTML).toContain(
      item.name
    );
    expect(document.getElementById("cart-total").textContent).toContain(
      item.price.toFixed(2)
    );
  });

  it("should update cart display after removing an item", async () => {
    const item = {
      id: 1,
      name: "Test Item",
      price: 10.99,
    };

    ShoppingCart.addItem(item);

    ShoppingCart.removeItem(item.id);

    expect(document.getElementById("cart-items").innerHTML).not.toContain(
      item.name
    );
    expect(document.getElementById("cart-total").textContent).toContain("0.00");
  });

  it("should send order successfully", async () => {
    const user = {
      user_id: 1,
    };

    await ShoppingCart.sendOrder(user.user_id);

    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });

  it("should join order items successfully", async () => {
    const orderId = 1;
    const items = [];

    await ShoppingCart.sendJoinOrder(orderId, items);

    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });
});
