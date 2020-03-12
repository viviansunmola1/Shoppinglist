// dom element selectors
const loggedInPageE = document.getElementsByClassName("loggedIn")[0];
const loginPageE = document.getElementsByClassName("login")[0];

const profileIconE = document.getElementsByClassName("profileIcon")[0];
const displayNameE = document.getElementsByClassName("displayName")[0];

const groceryListE = document.getElementsByClassName("grocery-items")[0];
const groceryCountE = document.getElementsByClassName("groceryItemsCount")[0];

const cartListE = document.getElementsByClassName("cart-items")[0];
const cartListClearBtnE = document.getElementsByClassName("cartListClearBtn")[0];
const cartCountE = document.getElementsByClassName("cartItemsCount")[0];

const cartTotal = document.getElementsByClassName("cartItemsTotal")[0];

const firebaseConfig = {
    apiKey: "AIzaSyD0MgA1IuiARHcyPg-GkhBpc4gNBPxpMsM",
    authDomain: "g-shop-f7070.firebaseapp.com",
    databaseURL: "https://g-shop-f7070.firebaseio.com",
    projectId: "g-shop-f7070",
    storageBucket: "g-shop-f7070.appspot.com",
    messagingSenderId: "38703525828",
    appId: "1:38703525828:web:896b7eca4d88c20d8d7e91"
};

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(user => {
    user ? onLogin(user) : onLogout();
});

async function login() {
    const res = await firebase.auth().signInWithPopup(provider);

    const { additionalUserInfo, user } = res;

    if (additionalUserInfo.isNewUser) {
        const db = firebase.firestore();
        const users = db.collection("users").doc(`${user.uid}`);

        await users.set({
            groceries: defaultGroceryList,
            cart: {}
        });
    }
}

function logOut() {
    firebase.auth().signOut();
    cartListE.innerHTML = "";
    groceryListEListE.innerHTML = "";
}

async function onLogin(googleUser) {
    loggedInPageE.style.display = "block";
    loginPageE.style.display = "none";

    profileIconE.src = googleUser.photoURL;
    displayNameE.textContent = googleUser.displayName;

    renderCartItems(googleUser);
    renderGroceryItems(googleUser);
}

function onLogout() {
    loggedInPageE.style.display = "none";
    loginPageE.style.display = "flex";
}

async function renderCartItems(googleUser) {
    const db = firebase.firestore();
    const controller = await db.collection("users").doc(`${googleUser.uid}`);

    const user = await controller.get();
    const userData = user.data();

    const { cart } = userData;

    const cartCount = Object.keys(cart).length;

    cartCountE.textContent = cartCount;
    cartListE.innerHTML = "";



    if (cartCount === 0) {
        cartListClearBtnE.classList.add("hide");
        return cartCountE.innerText = "Your cart is Empty";
    }

    cartListClearBtnE.classList.remove("hide");

    cartListClearBtnE.addEventListener("click", () => {
        controller.update({
            groceries: defaultGroceryList,
            cart: {}
        });

        renderCartItems(googleUser);
        renderGroceryItems(googleUser);
    });

    var total = 0 

    for (const key in cart) {
        const item = cart[key];
        total = item.price + total

        const itemE =  genItemE({
            src: item.image,
            name: key,
            price: item.price

        }, {



            text: "Remove",
            callback() {
                // removes from cart and adds to groceries list.
                controller.update({
                    [`groceries.${key}`]: item,
                    [`cart.${key}`]: firebase.firestore.FieldValue.delete()
                });

                // re-render to see visual changes
                renderCartItems(googleUser);
                renderGroceryItems(googleUser);

            }

        });

        cartListE.appendChild(itemE);

    }
    cartTotal.textContent = total;

}



async function renderGroceryItems(googleUser) {
    const db = firebase.firestore();
    const controller = await db.collection("users").doc(`${googleUser.uid}`);

    const user = await controller.get();
    const userData = user.data();

    const { groceries } = userData;
    const groceryCount = Object.keys(groceries).length;

    groceryCountE.textContent = groceryCount;
    groceryListE.innerHTML = "";

    if (groceryCount === 0) {
        return groceryCountE.innerText = "Empty";
    }


    for (const key in groceries) {
        const item = groceries[key];

        const itemE =  genItemE({
            src: item.image,
            name: key,
            price: item.price
        }, {
            text: "Add to cart",
            callback() {
                // adds item to cart and removes from groceries list.
                controller.update({
                    [`cart.${key}`]: item,
                    [`groceries.${key}`]: firebase.firestore.FieldValue.delete()
                });

                // re-render to see visual changes
                renderCartItems(googleUser);
                renderGroceryItems(googleUser);
            }
        });

        groceryListE.appendChild(itemE);
    }
}
