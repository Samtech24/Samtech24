var cartBtn = document.getElementsByClassName('cart-logo')[0]
var continueShoppingBtn = document.getElementById('ctnshop')
var checkoutBtn = document.getElementById('checkout-btn')
var okBtn = document.getElementById('ok-btn')
var modalContainer = document.getElementById('modal-container');
var summaryModalBox = document.getElementsByClassName('summary-modal-box')[0];
var cartModalBox = document.getElementsByClassName('cart-modal-box')[0]
var form = document.getElementById('form');


cartBtn.addEventListener('click', showCart)
ctnshop.addEventListener('click', hideCart)
checkoutBtn.addEventListener('click', submitForm)
okBtn.addEventListener('click', reloadPage)
form.addEventListener('submit', (e) => {
	e.preventDefault()
})

function reloadPage(event) {
	window.location.reload()
}


function showCart(event) {
	modalContainer.style.display = 'block';
	cartModalBox.style.display = 'block';
}

function hideCart(event) {
	modalContainer.style.display = 'none';
}

function closeCart() {
	cartModalBox.style.display = 'none';
}

function showSummary() {
	summaryModalBox.style.display = 'block';
	modalContainer.style.display = 'block';
}

function closeSummary() {
	summaryModalBox.style.display = 'none';
	modalContainer.style.display = 'none';
}

function submitForm(event) {
	var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
	if (cartRows.length == 0) {
		alert('Please select a product')
		return
	}
	//validateForm()
	if (validateForm() == true) {
		closeCart();
		payWithPaystack();
	}
}

function validateForm() {
	var nameError = document.getElementById("nameError");
	var name = document.getElementById("customerName");
	var emailError = document.getElementById("emailError");
	var email = document.getElementById("customerEmail");
	var numberError = document.getElementById("numberError");
	var number = document.getElementById("customerNumber");
	var errors = document.getElementsByClassName('errors');

	if ( name.value == "" ) {
			nameError.innerHTML = "Please enter your name";
			name.style.borderColor = 'red';
		} else {
			nameError.innerHTML = "";
			name.style.borderColor = 'green';
		};

	if ( email.value == "" ) {
			emailError.innerHTML = "Please enter an email";
			email.style.borderColor = 'red';
		} else if (!email.value.includes("@")) {
			emailError.innerHTML = "invalid email";
			email.style.borderColor = 'red';
		} else {
			emailError.innerHTML = ""
			email.style.borderColor = 'green'
		};

	if ( number.value == "" ) {
			numberError.innerHTML = "Please enter your telephone number";
			number.style.borderColor = 'red';
		} else if (number.value == "Aa") {
			numberError.innerHTML = "Phone number cannot contain letters";
			summaryModalBox.style.display = 'none'
		} else if (number.value.length < 11) {
			numberError.innerHTML = "Phone number must be 11 digits"
			number.style.borderColor = 'red';
		} else if (number.value.length > 11) {
			numberError.innerHTML = "Phone number must not be more than 11 digits"
			number.style.borderColor = 'red';
		} else if (number.value == 'a-zA-Z') {
			numberError.innerHTML = "Phone number cannot contain letters"
			number.style.borderColor = 'red';
		} else {
			numberError.innerHTML = "";
			number.style.borderColor = 'green';
		};

	switch (''){
		case numberError.innerHTML || emailError.innerHTML || nameError.innerHTML:
		return true;

		default:
		return false;
	}
}

//Add to cart clicked  
var addToCartButton = document.getElementsByClassName("add-to-cart-btn");
for (var i = 0; i < addToCartButton.length; i++) {
	var button = addToCartButton[i];
	button.addEventListener('click', addToCartClicked)
}

function addToCartClicked(event) {
    var button = event.target
    button.style.display = 'none'
    var shopItem = button.parentElement.parentElement
    var item = shopItem.getElementsByClassName('gadget-name')[0].innerText
    var price = shopItem.getElementsByClassName('gadget-price-value')[0].innerText
    var priceValue =price.replace(',', '')
    addItemToCart(item, priceValue)
}

function addItemToCart(item, priceValue) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == item) {
            alert('This item is already added to the cart')
            return
        }
    }

    var cartRowContents = `
         <span class="counter cart-serial-number cart-column"></span>
						<span class="cart-item-name cart-item cart-column">${item}</span>
                		<span class="cart-price cart-column">${priceValue}</span>
                		<div class="cart-quantity cart-column">
                			<button class="Sub btn">-</button>
                				<span class="cart-quantity-value">1</span>
                			<button class="Add btn" >+</button>
                		</div>
                		<span>	
                			<button class="Rembtn btn cart-column">Remove</button>
                		</span>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)

	cartRow.getElementsByClassName('Rembtn')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName("Add")[0].addEventListener('click', increaseQuantityValue)
    cartRow.getElementsByClassName("Sub")[0].addEventListener('click', decreaseQuantityValue)
    
    addToCartNumber();
    updateCartTotal();
}

//Cart total
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-value')[0]
        var price = parseFloat(priceElement.innerText.replace('₦', ''))
        var quantity = quantityElement.innerText
        total = total + (price * quantity)
    }
    var cartTotalPrice = document.getElementById('cartTotal').innerText = total;
}

//Display cart Number on add to cart button click
var cartNum = 0;
function addToCartNumber(event) {
	cartNum++;
	document.getElementById('cart-number').innerText = cartNum; 
}

//Increase quantity value
function increaseQuantityValue(event) {
	var increaseQuantityClicked = event.target

	var cartQuantity = increaseQuantityClicked .parentElement

	cartQuantityValue = cartQuantity.getElementsByClassName('cart-quantity-value')[0].innerText
	cartsQuantityValue = parseInt(cartQuantityValue)
	cartsQuantityValue ++
	cartQuantity.getElementsByClassName("cart-quantity-value")[0].innerText = cartsQuantityValue;
	console.log(cartQuantityValue)
	updateCartTotal();
}

//Decrease quantity value
function decreaseQuantityValue(event) {
	var decreaseQuantityClicked = event.target

	var cartQuantity = decreaseQuantityClicked .parentElement

	cartQuantityValue = cartQuantity.getElementsByClassName('cart-quantity-value')[0].innerText
	cartsQuantityValue = parseInt(cartQuantityValue)
	cartsQuantityValue --
	if (cartsQuantityValue < 1) {
		alert("You cannot have less than 1 item. If you wish to remove the item click remove")
		cartsQuantityValue = 1;
	}
	cartQuantity.getElementsByClassName("cart-quantity-value")[0].innerText = cartsQuantityValue;
	console.log(cartsQuantityValue)
	updateCartTotal();	
	}

//Remove item from cart
function removeCartItem(event) {
		var buttonClicked = event.target
		buttonClicked.parentElement.parentElement.remove()
		var cartRow= buttonClicked.parentElement.parentElement
		var cartItem = cartRow.getElementsByClassName('cart-item-name')[0].innerText
		console.log (cartItem)

		var gadgets = document.getElementsByClassName('gadgets')[0]
    	var gadget = gadgets.getElementsByClassName('gadget')

    	for (var i = 0; i < gadget.length; i++) {
        	var gadgetItems = gadget[i]
        	var addToCartBtn = gadgetItems.getElementsByClassName('add-to-cart-btn')[0]
        	var gadgetName = gadgetItems.getElementsByClassName('gadget-name')[0]
       		var gadgetNameValue = gadgetName.innerText
    
       		if (cartItem == gadgetNameValue) {
         		addToCartBtn.style.display = 'inline-block';
       			}
       	}
   	removeCartNumber();
	updateCartTotal();
	addToCartClicked();
};

//Display cart Number on remove button click
function removeCartNumber(event) {
	cartNum--;
	document.getElementById('cart-number').innerText = cartNum; 
};

//Remove item from cart using remove from cart button
var removeFromCartButton = document.getElementsByClassName('remove-from-cart-btn')
	for (var i = 0; i < removeFromCartButton.length; i++) {
		button = removeFromCartButton[i];
		button.addEventListener('click', removeFromCart)
	}

function removeFromCart(event) {
	button = event.target;
	var shopItem = button.parentElement.parentElement
	var gadgetName = shopItem.getElementsByClassName('gadget-name')[0].innerText
	var addToCartBtn = shopItem.getElementsByClassName('add-to-cart-btn')[0]

	var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var cartItems = cartRow.getElementsByClassName('cart-item-name')[0]
       	var itemName = cartItems.innerText
    
       if (itemName == gadgetName) {
        	cartRow.remove();
        	addToCartBtn.style.display = 'inline-block';
       }
    }
   updateCartTotal();
   removeCartNumber();
}

//Summary value
var checkout =document.getElementById('checkout-btn');
checkout.addEventListener('click', summary)

function summary() {
	if (validateForm() == false){
		return
	} else { var customerName = document.getElementById('customerName').value;
			document.getElementById('summary-name').innerText = customerName;

			var button = event.target
    		var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    		var cartRows = cartItemContainer.getElementsByClassName('cart-row')

    		for (var i = 0; i < cartRows.length; i++) {
        		var cartRow = cartRows[i]
    			var item = cartRow.getElementsByClassName('cart-item')[0].innerText
    			var quantity = cartRow.getElementsByClassName('cart-quantity-value')[0].innerText
    			addItemToSummary(item, quantity)
			}
	}
};

function  addItemToSummary(item, quantity){
	var summaryRow = document.createElement('div')
    summaryRow.classList.add('cart-row')
    var summaryItems = document.getElementsByClassName('summary-items')[0]

     var cartRowContents = `
         <span class="summary-counter cart-serial-number cart-column"></span>
						<span class="cart-item-name cart-item cart-column">${item}</span>
                		<div class="cart-quantity cart-column">
                				<span class="cart-quantity-value">${quantity}</span>
                		</div>
                		`
    summaryRow.innerHTML = cartRowContents
    summaryItems.append(summaryRow)
}

function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: 'pk_test_b69e0c319bb7e69880bbf1cdb778f12a86cd800f', // Replace with your public key
    email: document.getElementById("customerEmail").value,
    amount: parseInt(document.getElementById("cartTotal").innerText) * 100,
    ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    // label: "Optional string that replaces customer email"
    onClose: function(){
      alert('Window closed.');
    },
    callback: function(response){
      showSummary();
    }
  });
  handler.openIframe();
}
