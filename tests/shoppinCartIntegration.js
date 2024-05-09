import ShoppingCart from "./ShoppingCart";

describe("ShoppingCart Integration Test", () => {
  beforeEach(() => {
    ShoppingCart.items = [];
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("should add an item to the cart", () => {
    const item = {
      id: 1,
      name: "Test Item",
      price: 10.99,
    };

    ShoppingCart.addItem(item);

    expect(ShoppingCart.items.length).toBe(1);
    expect(ShoppingCart.items[0]).toEqual(expect.objectContaining(item));
  });

  it("should remove an item from the cart", () => {
    const item = {
      id: 1,
      name: "Test Item",
      price: 10.99,
    };

    ShoppingCart.addItem(item);

    ShoppingCart.removeItem(item.id);

    expect(ShoppingCart.items.length).toBe(0);
  });

  it("should clear the cart", () => {
    const item = {
      id: 1,
      name: "Test Item",
      price: 10.99,
    };

    ShoppingCart.addItem(item);

    ShoppingCart.clearCart();

    expect(ShoppingCart.items.length).toBe(0);
  });
});
