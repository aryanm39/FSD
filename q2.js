const pizzaPrices = {
    "Plain Cheese margherita": { small:80, medium: 120, large: 150 },
    "cheese burst": { small:150, medium: 120, large: 150 },
    "Peri Peri": { small:160, medium: 120, large: 150 },
    "Tandoori Panner": { small:170, medium: 120, large: 150 },
    "Mexican green": { small:180, medium: 120, large: 150 }

  };
  
  function placeOrder() {
    const pizzaType = document.getElementById("pizzaType").value;
    const pizzaSize = document.getElementById("pizzaSize").value;
  
    const price = pizzaPrices[pizzaType][pizzaSize];
  
    const orderDetails = document.getElementById("orderDetails");
    orderDetails.innerHTML =`<br>You ordered a ${pizzaSize} ${pizzaType} pizza.<br> Price:₹ ${price}`;
  }



     