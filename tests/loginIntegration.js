import { addBurger } from "./burgerFunctions";
import { fetchBurgersForMenu } from "./menuFunctions";
import { hamburgersUrl } from "./variables";

describe("Burger Integration Test", () => {
  beforeEach(() => {
    fetchBurgersForMenu.mockClear();
  });

  it("should add a burger to the menu", async () => {
    const burgerData = {
      name: "Test Burger",
      price: 10.99,
      ingredients: ["Beef", "Lettuce", "Tomato"],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Burger added successfully" }),
      })
    );

    await addBurger(burgerData);

    expect(fetchBurgersForMenu).toHaveBeenCalled();

    expect(fetch).toHaveBeenCalledWith(hamburgersUrl, {
      method: "POST",
      body: JSON.stringify(burgerData),
    });
  });
});
