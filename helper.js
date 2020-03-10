// used for when creatign new user doc in filestore.
const defaultGroceryList = {
    apple: {
        image: "https://image.flaticon.com/icons/svg/415/415733.svg",
        price: 0.30
    },
    banana: {
        image: "https://image.flaticon.com/icons/svg/1135/1135549.svg",
        price: 0.40
    },
    bread: {
        image: "https://image.flaticon.com/icons/svg/2646/2646984.svg",
        price: 1.10
    },
    butter: {
        image: "https://image.flaticon.com/icons/svg/2166/2166054.svg",
        price: 1.50
    },
    egg: {
        image: "https://image.flaticon.com/icons/svg/837/837560.svg",
        price: 0.20
    }
};

// generates a dom element for item to be appended to a list.
function genItemE({src, name, price}, cta) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");

    const itemImage = document.createElement("img");
    itemImage.src = src;

    const itemMame = document.createElement("p");
    itemMame.textContent = name;

    const itemPrice = document.createElement("p");
    itemPrice.textContent = `£${price}`;

    const itemButton = document.createElement("button");
    itemButton.textContent = cta.text;

    itemButton.addEventListener("click", cta.callback);

    // bundles the different elements into the parent element.
    itemElement.appendChild(itemImage);
    itemElement.appendChild(itemMame);
    itemElement.appendChild(itemPrice);
    itemElement.appendChild(itemButton);

    return itemElement;
}
