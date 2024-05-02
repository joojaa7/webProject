const ShoppingCart = {
  items: [],

  addItem(item) {
    const existingItem = this.items.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1; // Increment the quantity if the item already exists
    } else {
      item.quantity = 1; // Set the initial quantity for new items
      this.items.push(item); // Add the new item to the cart
    }
    this.saveCart();
    this.updateCartDisplay();
  },

  removeItem(id) {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      // Check if the item is found
      if (this.items[itemIndex].quantity > 1) {
        this.items[itemIndex].quantity -= 1; // Decrement the quantity
      } else {
        this.items.splice(itemIndex, 1); // Remove the item if the quantity is 1
      }
      this.saveCart();
      this.updateCartDisplay();
    }
  },

  saveCart() {
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(this.items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  },

  loadCart() {
    try {
      const cartData = localStorage.getItem("shoppingCart");
      this.items = cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  },

  updateCartDisplay() {
    const cartItemsElement = document.getElementById("cart-items");
    cartItemsElement.innerHTML = ""; // Clear existing items

    this.items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";

      // Item display
      const itemInfo = document.createElement("span");
      const itemName = document.createElement("p");
      const itemPrice = document.createElement("p");
      itemName.setAttribute("class", "item-paragraph");
      itemPrice.setAttribute("class", "item-paragraph");
      itemName.textContent = `${item.name}`;
      itemPrice.textContent = `${item.price.toFixed(2)} €`;
      itemInfo.append(itemName);
      itemInfo.append(itemPrice);

      // Quantity management
      const quantityControl = document.createElement("div");
      quantityControl.className = "quantity-control";

      const decrementBtn = document.createElement("button");
      decrementBtn.textContent = "-";
      decrementBtn.onclick = () => {
        this.removeItem(item.id); // Decrement or remove item
      };

      const quantityDisplay = document.createElement("span");
      quantityDisplay.textContent = ` Quantity: ${item.quantity}`;

      const incrementBtn = document.createElement("button");
      incrementBtn.textContent = "+";
      incrementBtn.onclick = () => {
        this.addItem({ ...item, quantity: 1 }); // Add the same item (increments quantity)
      };

      // Assembling the quantity controls
      quantityControl.appendChild(decrementBtn);
      quantityControl.appendChild(quantityDisplay);
      quantityControl.appendChild(incrementBtn);

      // Assembling the item element
      itemElement.appendChild(itemInfo);
      itemElement.appendChild(quantityControl);
      cartItemsElement.appendChild(itemElement);
    });

    // Update total price display
    document.getElementById(
      "cart-total"
    ).textContent = `${this.getTotalPrice().toFixed(2)} `;
  },

  getTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartDisplay();
  },
};

export default ShoppingCart;
