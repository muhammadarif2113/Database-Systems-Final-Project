let carts = document.querySelectorAll('.add-cart'); 
console.log(carts); 
let stage = 'dev'; 
let products = []; 
async function getProducts(){
    const host = stage ==='dev' ? 'http://localhost:3001': 'http://143.198.114.216:3001' 
    const response = await axios.get(`${host}/products`); 
    console.log(response.data); 
    products = response.data.products


    populateProducts();
}
getProducts(); 


function populateProducts() {
    const container = document.querySelector('.container'); 

    const productsHtml = products.map((product, i) => { //in our store 
        return (
            `
            <div class ="image">
                <img src = "${product.image}" alt="${product.name}" height="200" width="200">
                <h3> ${product.name}</h3>
                <h3> $${product.price}</h3>
                <a class="add-cart cart${i+1}" href="#"> Add Cart </a>
            </div>
            `
        )
    })

    if(container){
        container.innerHTML += productsHtml.toString().replaceAll(',', '');
        addCartActions(); 
        
    }
}

function addCartActions(){ //displays add to cart for every item when hovered over 
    const hoverProducts = document.getElementsByClassName('image'); 
    let carts = document.querySelectorAll('.add-cart'); 

    for(let i=0; i<hoverProducts.length; i++){
        hoverProducts[i].addEventListener('mouseover', () => {
            carts[i].classList.add('showAddCart'); 
        })
        hoverProducts[i].addEventListener('mouseout', () => { //so add to cart disappears when not hovered over 
            carts[i].classList.remove('showAddCart'); 
        })
    }

    for (let i=0; i <carts.length; i++){
        carts[i].addEventListener('click', () => {
            cartNumbers(products[i]); 
            totalCost(products[i]); 
        })
    }
}

function onLoadCartNumbers(){ //to save cart number when refreshed 
    let productNumbers = localStorage.getItem('cartNumbers'); 

    if(productNumbers){
        document.querySelector('.cart span').textContent = productNumbers; 
    }
}


//add to cart logic
function cartNumbers(product, action){ //function is called onclick for each item
    let productNumbers = localStorage.getItem('cartNumbers'); 
    productNumbers = parseInt(productNumbers); //convert string to int
    
    let cartItems = localStorage.getItem('productsInCart'); 
    cartItems = JSON.parse(cartItems); 

    if(action == "decrease"){
        localStorage.setItem('cartNumbers', productNumbers -1); 
        document.querySelector('.cart span').textContent = productNumbers -1; 
    } else if (productNumbers){
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers;  
    } else {
        localStorage.setItem('cartNumbers', 1); 
        document.querySelector('.cart span').textContent = 1; 
    }

    setItems(product); 
}

function setItems(product){
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems); 
    
    if(cartItems != null) {  //so each item's own quanitity is added and not all together as one item
        if (cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems, 
                [product.tag]: product 
            }
        }
        cartItems[product.tag].inCart +=1; 
    } else {
        product.inCart = 1;
        cartItems = {
        [product.tag]: product
        }
    }
     
    localStorage.setItem("productsInCart", JSON.stringify(cartItems)); 
}

function totalCost(product, action){
    let cartCost = localStorage.getItem('totalCost');

    console.log("My cartCost is", cartCost);
    console.log(typeof cartCost); 
    if(action == "decrease"){
        cartCost = parseInt(cartCost); 
        localStorage.setItem('totalCost', cartCost - product.price); 
    } else if(cartCost != null){
        cartCost = parseInt(cartCost);  
        localStorage.setItem("totalCost", cartCost + product.price); 
    } else {
        localStorage.setItem("totalCost", product.price); 
    }
}

function displayCart(){ //see products in cart page when added from store page 
    let cartItems = localStorage.getItem("productsInCart"); 
    cartItems = JSON.parse(cartItems); 
    let productContainer = document.querySelector(".products"); 
    let cartCost = localStorage.getItem('totalCost'); 
  //  console.log(cartItems); 
    if(cartItems && productContainer ) {
        productContainer.innerHTML = ''; 
        Object.values(cartItems).map(item => { //price, name, quantity added to cart for each item
            productContainer.innerHTML +=  ` 
            <div class= "product"> 
                <ion-icon name="close-circle"></ion-icon>
                <img src="Images/${item.tag}.jpg" height=150 width=150> 
                <span>${item.name}</span> 
            </div>
            <div class="price">$${item.price},00</div> 
            <div class="quantity">
                <ion-icon class = "decrease"
                name="chevron-back-circle"></ion-icon> 
                <span>${item.inCart}</span> 
                <ion-icon class="increase"
                name="chevron-forward-circle"></ion-icon>
            </div>  
            <div class="total">
                $${item.inCart * item.price},00
            </div>
            `;
        }); 

        productContainer.innerHTML += ` 
            <div class= "basketTotalContainer"> 
                <h4 class = "basketTotalTitle"> 
                    Basket Total 
                </h4>
                <h4 class="basketTotal"> 
                    $${cartCost},00
                </h4> 
        `; 
    }

    deleteButtons(); 
    manageQuantitiy(); 
}

function deleteButtons(){ //functionality to delete button
    let deleteButtons = document.querySelectorAll('.product ion-icon'); 
    let productName; 
    let productNumbers = localStorage.getItem('cartNumbers'); 
    let cartItems = localStorage.getItem('productsInCart'); 
    cartItems = JSON.parse(cartItems); 
 //   console.log(cartItems); 
    let cartCost = localStorage.getItem('totalCost'); 

    for(let i =0; i < deleteButtons.length; i++){
        deleteButtons[i].addEventListener('click', () => {   //to get item name the same as item tag 
            productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');
            console.log(productName); 
           // console.log(cartItems[productName]); 
            localStorage.setItem('cartNumbers', productNumbers -  cartItems[productName].inCart ); 
            localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart)); 

            delete cartItems[productName]; 
            localStorage.setItem('productsInCart', JSON.stringify(cartItems)); 

            displayCart(); 
            onLoadCartNumbers(); 
        }); 
    }
}

function manageQuantitiy(){
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart'); 
    let currentQuantity = 0;
    let currentProduct = "";  
    cartItems = JSON.parse(cartItems); 
    console.log(cartItems); 

    for (let i =0; i <decreaseButtons.length; i++){
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent; 
            console.log(currentQuantity); 
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim(); 
            console.log(currentProduct); 

            if (cartItems[currentProduct].inCart > 1) { //so you cant decrease  a product if 1 is left in cart
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease"); 
                totalCost(cartItems[currentProduct], "decrease"); 
                localStorage.setItem('productsInCart', JSON.stringify(cartItems)); 
                displayCart();
            } 
        })
    }
    for (let i =0; i <increaseButtons.length; i++){
        increaseButtons[i].addEventListener('click', () => {
            console.log("increase button"); 
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent; 
            console.log(currentQuantity); 

            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim(); 
            console.log(currentProduct); 

                cartItems[currentProduct].inCart += 1;
                cartNumbers(cartItems[currentProduct]); 
                totalCost(cartItems[currentProduct]); 
                localStorage.setItem('productsInCart', JSON.stringify(cartItems)); 
                displayCart(); 
        })
    }

}

onLoadCartNumbers();
displayCart();  