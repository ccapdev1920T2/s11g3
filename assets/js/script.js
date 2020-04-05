function openNav() {
    document.getElementById("mySideNav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}

function extractCodeQty(string) {
	var arr = string.split('\n\t\t\t\t\t\t\t');
	return {code: arr[7].substring(15), qty: Number.parseInt(arr[16].substring(1))};
}

function updateTotals() {
	var prices = $("strong.price"), qtys = $(".qtyBuy"),
			pArr = [], qArr = [];
	prices.each(function() {
		var p = $(this).text();
		pArr.push(Number.parseFloat(p.substring(4)));
	});
	qtys.each(function() {
		qArr.push(Number.parseFloat($(this).text()));
	});

	var tPrice = 0.0, tQty = 0;
	for (var i = 0; i < pArr.length; i++) {
		tPrice += pArr[i]*qArr[i];
		tQty += qArr[i];
	}

	$(".tPrice").text('Total: Php ' + tPrice.toFixed(2));
	$(".tQty").text('Items: ' + tQty);
}

/* Sends a POST request to update the user's cart based on the submitted pCodes and qty
 * - get the product rows
 * - extract the product code and qty from each
 * - convert and send that as JSON
 */
function updateCartQty() {
	let rows = document.querySelectorAll('.prodRow');
	var prodCodeQty = [];
	
	rows.forEach(function(node) {
		prodCodeQty.push(extractCodeQty(node.textContent));
	});
	
	// make XHR object and prep it
	let xhr = new XMLHttpRequest();
	xhr.open("PUT", "/updateCart", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	// make state change callback: print data from server
	xhr.onreadystatechange = function() {
		// window.location.replace('/products');
	};
	 
	// stringify JSON data and PUT to server
	var data = JSON.stringify(prodCodeQty);
	xhr.send(data);
}

$(document).ready(function () {
	// for cart page
	updateTotals();
	
	$(".minus").click(function() {
		var qty = Number.parseInt($(this).next().text());
		if (qty > 1)
			$(this).next().text(qty-1);
		updateTotals();
	});
	
	$(".plus").click(function() {
		var qty = Number.parseInt($(this).prev().text());
		var max = Number.parseInt($(this).parent().prev().children("a").prev().children("strong").text());
		if (qty < max)
			$(this).prev().text(qty+1);
		updateTotals();
	});
	
	// check if email already exists in db and if email is email
	$('#email').keyup(function() {
		var emailIn = $('#email').val();
		$.get('/checkEmail', {email: emailIn}, function(result) { // result is bool
			if(result) { // if result is true, either NOT email or EXISTING user
				$('#email').css('border-color', 'red');
				// $('#error').text('email already exists');
				$('#regSub').prop('disabled', true);
			} else {
				$('#email').css('border-color', '#dfe7f1');
				// $('#error').text('');
				$('#regSub').prop('disabled', false);
			}
		});
	});
	
	// check if username already exists in db
	$('#username').keyup(function() {
		var userIn = $('#username').val();
		
		$.get('/checkUser', {user: userIn}, function(result) { // result is bool
			if(result) {
				$('#username').css('border-color', 'red');
				// $('#error').text('email already exists');
				$('#regSub').prop('disabled', true);
			} else {
				$('#username').css('border-color', '#dfe7f1');
				// $('#error').text('');
				$('#regSub').prop('disabled', false);
			}
		});
	});
	
	$("button.delCart").click(function() {
		let code = $(this).siblings(".desc").text(), codeDel = code.trim().split(/(\s)/)[4];
		let row = $(this).closest('.row');
		
		$.post('/delCartItem', {code: codeDel}, function(result) {
			if (result) {
				row.remove();
				updateTotals();
			} else alert('Error removing from cart!');
		});
	});
	
	$("button.delWish").click(function() {
		let code = $(this).siblings("div").text(), codeDel = code.trim().split(/(\s)/)[4];
		let row = $(this).closest('.row');
		console.log(codeDel);
		$.post('/delWishItem', {code: codeDel}, function(result) {
			if (result) {
				row.remove();
			} else alert('Error removing from wishlist!');
		});
	});
});
