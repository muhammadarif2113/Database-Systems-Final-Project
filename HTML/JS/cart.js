"use strict";

/*
   
   Author: Mohammed Atef
   
   Filename: co_cart.js

*/ 

window.addEventListener("load", function() {
	calcCart();
	cart.elements.modelQty.onchange = calcCart;
	
	var shipOptions = document.querySelectorAll('input[name="shipping"]');
	for (var i = 0; i < shipOptions.length; i++) {
		shipOptions[i].onclick = calcCart;
	}
});

function calcCart() {
	//Retrieve the value of the cartForm variable.
	var cartForm = document.forms.cart;
	var qIndex = cartForm.elements.modelQty.selectedIndex;
	var qty = cartForm.elements.modelQty[qIndex].value;

	//Display the value of the orderCost variable in the orderCost field, formatted as U.S. currency.
	var orderCost = cartForm.elements.modelCost.value*qty;
	cartForm.elements.orderCost.value = formatUSCurrency(orderCost);
	
	//Display the value of the shipCost variable in the shippingCost field, formatted with a thousands separator and to two decimals places.
	var shipCost = document.querySelector('input[name="shipping"]:checked').value*qty;
	cartForm.elements.shippingCost.value = formatNumber(shipCost, 2);
	
	cartForm.elements.subTotal.value = formatNumber(orderCost + shipCost, 2);
	
	//Display the value of the salesTax variable in the salesTax field, formatted with a thousands separator and to two decimal places.
	var salesTax = 0.08*(orderCost + shipCost);
	cartForm.elements.salesTax.value = formatNumber(salesTax, 2);
	
	var cartTotal = orderCost + shipCost + salesTax;
	cartForm.elements.cartTotal.value = formatUSCurrency(cartTotal);
	
	cartForm.elements.shippingType.value =
		document.querySelector('input[name="shipping"]:checked').nextSibling.nodeValue;
	
	
}



function formatNumber(val, decimals) {
   return val.toLocaleString(undefined, {minimumFractionDigits: decimals, 
                                         maximumFractionDigits: decimals});
}

function formatUSCurrency(val) {
   return val.toLocaleString('en-US', {style: "currency", currency: "USD"} );
}