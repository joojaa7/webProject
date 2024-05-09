import ShoppingCart from "./ShoppingCart";

describe("ShoppingCart", () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    ShoppingCart.items = [];
  });

  test("addItem should add item to cart", () => {
    const item = { id: 1, name: "Test Product", price: 10.0 };
    ShoppingCart.addItem(item);
    expect(ShoppingCart.items.length).toBe(1);
    expect(ShoppingCart.items[0].quantity).toBe(1);
  });

  test("addItem should increment quantity if item already exists", () => {
    const item = { id: 1, name: "Test Product", price: 10.0 };
    ShoppingCart.items.push({ ...item, quantity: 1 });
    ShoppingCart.addItem(item);
    expect(ShoppingCart.items.length).toBe(1);
    expect(ShoppingCart.items[0].quantity).toBe(2);
  });

  test("removeItem should remove item from cart", () => {
    const item = { id: 1, name: "Test Product", price: 10.0, quantity: 1 };
    ShoppingCart.items.push(item);
    ShoppingCart.removeItem(1);
    expect(ShoppingCart.items.length).toBe(0);
  });

  test("removeItem should decrement quantity if item quantity > 1", () => {
    const item = { id: 1, name: "Test Product", price: 10.0, quantity: 2 };
    ShoppingCart.items.push(item);
    ShoppingCart.removeItem(1);
    expect(ShoppingCart.items.length).toBe(1);
    expect(ShoppingCart.items[0].quantity).toBe(1);
  });

  test("removeItem should remove item from cart if quantity = 1", () => {
    const item = { id: 1, name: "Test Product", price: 10.0, quantity: 1 };
    ShoppingCart.items.push(item);
    ShoppingCart.removeItem(1);
    expect(ShoppingCart.items.length).toBe(0);
  });

  test("saveCart should save items to localStorage", () => {
    const item = { id: 1, name: "Test Product", price: 10.0, quantity: 1 };
    ShoppingCart.items.push(item);
    ShoppingCart.saveCart();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      expect.stringMatching(/shoppingCart-\w+/),
      JSON.stringify(ShoppingCart.items)
    );
  });

  test("loadCart should load items from localStorage", () => {
    const storedItems = [
      { id: 1, name: "Test Product", price: 10.0, quantity: 1 },
    ];
    global.localStorage.getItem.mockReturnValue(JSON.stringify(storedItems));
    ShoppingCart.loadCart();
    expect(ShoppingCart.items).toEqual(storedItems);
  });

  test("getCartKey should return correct cart key", () => {
    ShoppingCart.setUserId("testUser");
    expect(ShoppingCart.getCartKey()).toBe("shoppingCart-testUser");
  });

  test("getTotalPrice should return correct total price", () => {
    const item1 = { id: 1, name: "Test Product 1", price: 10.0, quantity: 2 };
    const item2 = { id: 2, name: "Test Product 2", price: 20.0, quantity: 1 };
    ShoppingCart.items.push(item1, item2);
    const expectedTotalPrice =
      item1.price * item1.quantity + item2.price * item2.quantity;
    expect(ShoppingCart.getTotalPrice()).toBe(expectedTotalPrice);
  });

  test("clearCart should clear items from cart and localStorage", () => {
    const item = { id: 1, name: "Test Product", price: 10.0, quantity: 1 };
    ShoppingCart.items.push(item);
    ShoppingCart.clearCart();
    expect(ShoppingCart.items.length).toBe(0);
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      expect.stringMatching(/shoppingCart-\w+/)
    );
  });

  test("updateCartDisplay should update cart display", () => {
    document.body.innerHTML = `
      <div id="cart-items"></div>
      <div id="shopping-cart"></div>
      <span id="cart-total"></span>
    `;
    const item = { id: 1, name: "Test Product", price: 10.0, quantity: 1 };
    ShoppingCart.items.push(item);
    ShoppingCart.updateCartDisplay();
    expect(document.getElementById("cart-items").children.length).toBe(1);
    expect(document.getElementById("shopping-cart").style.display).toBe(
      "block"
    );
    expect(document.getElementById("cart-total").textContent).toContain(
      item.price.toFixed(2)
    );
  });
});
