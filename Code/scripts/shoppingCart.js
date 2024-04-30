// shoppingCart.js
const ShoppingCart = {
  items: [],

  addItem(item) {
    this.items.push(item);
    this.saveCart();
    this.updateCartDisplay();
  },

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.saveCart();
    this.updateCartDisplay();
  },

  saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(this.items));
  },

  loadCart() {
    this.items = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  },

  updateCartDisplay() {
    const cartItemsElement = document.getElementById("cart-items");
    cartItemsElement.innerHTML = ""; // Clear existing items
    this.items.forEach((item) => {
      const itemElement = document.createElement("li");
      itemElement.textContent = `Burger ID: ${item.id}, Name: ${
        item.name
      }, Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(
        2
      )}`;

      // Create a button for removing the item
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.onclick = () => {
        this.removeItem(item.id); // Remove the item on click
      };

      // Append the remove button to the item element
      itemElement.appendChild(removeButton);
      cartItemsElement.appendChild(itemElement);
    });

    // Update the total price display
    document.getElementById("cart-total").textContent =
      this.getTotalPrice().toFixed(2);
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
