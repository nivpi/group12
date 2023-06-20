let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

let products = [
    {
        id: 1,
        name: 'Broccoli',
        image: 'broccoli.PNG',
        price: 1.05
    },
    {
        id: 2,
        name: 'Banana',
        image: 'banana.PNG',
        price: 1.60
    },
    {
        id: 3,
        name: 'Blueberry',
        image: 'blueberry.PNG',
        price: 5.60
    },
    {
        id: 4,
        name: 'Pumpkin',
        image: 'pumpkin.PNG',
        price: 1.06
    },
    {
        id: 5,
        name: 'Tomato',
        image: 'tomato.PNG',
        price: 3.28
    },
    {
        id: 6,
        name: 'Orange',
        image: 'orange.PNG',
        price: 0.35
    },
    {
        id: 7,
        name: 'Strawberry',
        image: 'strawberry.PNG',
        price: 11.38
    },
    {
        id: 8,
        name: 'Watermelon',
        image: 'watermelon.PNG',
        price: 0.55
    }
];
let listCards  = [];
function initShop(){
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="../views/images/${value.image}">
            <div class="title">${value.name}</div>
            <div class="price">$${value.price.toLocaleString()} per kg</div>
            <button onclick="addToCart(${key})">Add To Cart</button>`;
        list.appendChild(newDiv);
    })
}
initShop();
function addToCart(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
    }
    reloadCard();
}
function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key)=>{
        totalPrice = totalPrice + value.price;
        count = count + value.quantity;
        if(value != null){
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="../views/images/${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>`;
            listCard.appendChild(newDiv);
        }
    })
    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = count;
}
function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key].price = quantity * products[key].price;
    }
    reloadCard();
}