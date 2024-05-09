import {
  fetchAllergens,
  populateAllergensSelect,
  fetchBurgersForMenu,
  fetchBurgersForDelete,
  fetchBurgersForSpecialOffers,
} from "./functions.js";

describe("functions", () => {
  describe("fetchAllergens", () => {
    it("fetches allergens successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ ID: 1, name: "Allergen 1" }]),
        })
      );

      const allergens = await fetchAllergens();
      expect(allergens).toEqual([{ ID: 1, name: "Allergen 1" }]);

      expect(fetch).toHaveBeenCalledWith("https://10.120.32.51/web/allergens");
    });

    it("handles fetch error", async () => {
      global.fetch = jest.fn(() => Promise.reject("Fetch error"));

      await expect(fetchAllergens()).rejects.toEqual("Fetch error");
    });
  });

  describe("populateAllergensSelect", () => {
    it("populates select element with allergens", () => {
      document.body.innerHTML = '<select id="allergens-select"></select>';

      const allergens = [
        { ID: 1, name: "Allergen 1" },
        { ID: 2, name: "Allergen 2" },
      ];
      populateAllergensSelect(allergens);

      const select = document.getElementById("allergens-select");
      expect(select.children.length).toBe(2);
      expect(select.children[0].textContent).toBe("Allergen 1");
      expect(select.children[1].textContent).toBe("Allergen 2");
    });
  });

  describe("fetchBurgersForMenu", () => {
    it("fetches burgers for menu successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ ID: 1, Name: "Burger 1" }]),
        })
      );

      await fetchBurgersForMenu();

      expect(fetch).toHaveBeenCalledWith("https://10.120.32.51/web/hamburgers");
    });

    it("handles fetch error", async () => {
      global.fetch = jest.fn(() => Promise.reject("Fetch error"));

      console.error = jest.fn();

      await fetchBurgersForMenu();

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching burgers:",
        "Fetch error"
      );
    });
  });

  describe("addBurger", () => {
    it("adds burger successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ID: 1, Name: "New Burger" }),
        })
      );

      document.body.innerHTML = `
        <form id="add-burger-form">
          <!-- Form fields here -->
        </form>
      `;

      const form = document.getElementById("add-burger-form");
      const alertMock = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      await addBurger(form);

      expect(fetch).toHaveBeenCalledWith(
        "https://10.120.32.51/web/hamburgers",
        {
          method: "POST",
          body: expect.any(FormData),
        }
      );

      expect(alertMock).toHaveBeenCalledWith("Burger added successfully!");
    });

    it("handles fetch error", async () => {
      global.fetch = jest.fn(() => Promise.reject("Fetch error"));

      document.body.innerHTML = `
        <form id="add-burger-form">
          <!-- Form fields here -->
        </form>
      `;

      const form = document.getElementById("add-burger-form");
      const alertMock = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      await addBurger(form);

      expect(console.error).toHaveBeenCalledWith("Error:", "Fetch error");

      expect(alertMock).toHaveBeenCalledWith(
        "Error adding burger: Fetch error"
      );
    });
  });

  describe("addMenu", () => {
    it("adds menu item successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ ID: 1, burger_id: 1, date: "2024-05-09" }),
        })
      );

      document.body.innerHTML = `
        <select id="menu-burger"><option value="1">Burger 1</option></select>
        <input id="menu-date" value="2024-05-09">
      `;

      const alertMock = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      await addMenu();

      expect(fetch).toHaveBeenCalledWith("https://10.120.32.51/web/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ burger_id: "1", date: "09.05.2024" }),
      });

      expect(alertMock).toHaveBeenCalledWith("Menu item added successfully!");
    });

    it("handles fetch error", async () => {
      // Mock fetch to return an error
      global.fetch = jest.fn(() => Promise.reject("Fetch error"));

      document.body.innerHTML = `
        <select id="menu-burger"><option value="1">Burger 1</option></select>
        <input id="menu-date" value="2024-05-09">
      `;

      const alertMock = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      await addMenu();

      // Check if it logs the error
      expect(console.error).toHaveBeenCalledWith("Error:", "Fetch error");

      // Check if the error alert is shown
      expect(alertMock).toHaveBeenCalledWith(
        "Error adding menu item: Fetch error"
      );
    });
  });

  // Testit jatkuvat samalla tavalla muille funktioille
  // updatePreview, collectFormData, submitOfferData, convertDateFormat

  // Lisää tarvittavat testit lopuille funktioille vastaavalla tavalla
});
