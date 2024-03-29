import pizzaImg from "images/menu/pizza.png"
import burgerImg from "images/menu/burger.png"
import cocaImg from "images/menu/coca.png"
import saladImg from "images/menu/salad.png"
import waterImg from "images/menu/water.png"
import iceCreamImg1 from "images/menu/icecream1.png"
import iceCreamImg2 from "images/menu/icecream2.png"
import kebabImg from "images/menu/kebab.png"

export function getData() {
  return [
    {
      id: 0,
      title: "Falafel",
      price: 15,
      Image: pizzaImg,
      toppings: [
        "tomatoes",
        "pickled cucumbers",
        "hummus",
        "tahini",
        "spicy sauce",
      ],
      paidToppings: [
        { title: "Egg", price: 3 },
        { title: "Hacilim", price: 3 },
      ],
    },

    { id: 1, title: "Pizza", price: 17.99, Image: pizzaImg },
    { id: 2, title: "Burger", price: 15, Image: burgerImg },
    { id: 3, title: "Coca", price: 3.5, Image: cocaImg },
    { id: 4, title: "Kebab", price: 13.99, Image: kebabImg },
    { id: 5, title: "Salad", price: 2.5, Image: saladImg },
    { id: 6, title: "Bottle of water", price: 0.99, Image: waterImg },
    { id: 7, title: "Ice cream", price: 2.99, Image: iceCreamImg1 },
    { id: 8, title: "Ice cream big", price: 3.99, Image: iceCreamImg2 },
  ]
}
