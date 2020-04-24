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
		if (xhr.status === 303 && xhr.readyState === 4) {
			alert('Cart has been saved!');
			window.location.href = '/cart';
		}
	};
	 
	// stringify JSON data and PUT to server
	var data = JSON.stringify(prodCodeQty);
	xhr.send(data);
}

function postChOut() {
	// make XHR object and prep it
	let xhr = new XMLHttpRequest();
	let data = $('input:checked').map(function() {
		return $(this).attr('name');
	}).get();
	
	xhr.open("POST", "/checkout", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	// make state change callback: print data from server
	xhr.onreadystatechange = function() {
		if (xhr.status === 200 && xhr.readyState === 4) {
			alert('Checked out successfully!');
			window.location.href = '/cart';
		}
	};
	
	xhr.send(data);
}

$(document).ready(function() {
	
	/* LOGIN METHODS */
	
	// LOGIN: validation of form when submitting
	// checking if fields are not empty + email is in right format
	$('#submitLogin').click(function() {
		var email = $('#emailLogin').val();
		var pass = $('#passwordLogin').val();
		
		$('#emErr').text('');
		$('#pwErr').text('');
		
		if (validator.isEmpty(email)) {
			$('#emErr').text('Empty field!');
		} else if (!validator.isEmail(email)) {
			$('#emErr').text('Wrong email format!');
		}
		if (validator.isEmpty(pass)) {
			$('#pwErr').text('Empty field!');
		}
		
		if (!validator.isEmpty(email) || validator.isEmail(email) || !validator.isEmpty(pass)) {
			// send post request, check if user exists
			$.post('/login', {email: email, pass: pass}, function(result) {
				switch (result.status) {
					case 200: {
						window.location.href = '/'; break;
					}
					case 401: {
						$('#pwErr').text('No user found!'); break;
					}
					case 500: {
						$('#pwErr').text('Server error!'); break;
					}
				}
			});
		}
	});
	
	/* REGISTER METHODS */
	
	// REGISTER: validation of form when submitting
	$('button#submitReg').click(function() {
		var formArr = $('form#regForm').serializeArray();
		
		/* debugging, expected to get:
		 * - fname
		 * - lname
		 * - username
		 * - email
		 * - password
		 * - password_conf
		 * - address
		 * - phone
		 * - checkbox
		 */
		console.log(formArr);
		
		// REGISTER: check if email already exists in db and if email is email
		$.get('/checkEmail', {email: emailIn}, function(result) { // result is bool
			if(result) { // if result is true, either NOT email or EXISTING user
				$('#email').css('border-color', 'red');
				// $('#error').text('email already exists');
				$('#submitReg').prop('disabled', true);
			} else {
				$('#email').css('border-color', '#dfe7f1');
				// $('#error').text('');
				$('#submitReg').prop('disabled', false);
			}
		});
		
		// REGISTER: check if username already exists in db
		$.get('/checkUser', {user: userIn}, function(result) { // result is bool
			if(result) {
				$('#username').css('border-color', 'red');
				// $('#error').text('email already exists');
				$('#submitReg').prop('disabled', true);
			} else {
				$('#username').css('border-color', '#dfe7f1');
				// $('#error').text('');
				$('#submitReg').prop('disabled', false);
			}
		});
	});
	
	/* CHANGE PW METHODS */
	
	// CHANGE PW: validation of form when submitting
	$('button#changepwsubmit').click(function() {
		var oldpass = $('#oldpass').val();
		var newpass = $('#newpass').val();
		var cnewpass = $('#confnewpass').val();
		
		if (validator.isEmpty(oldpass)) {
			$('#oldpassErr').text('Empty field!');
		}
		if (validator.isEmpty(newpass)) {
			$('#newpassErr').text('Empty field!');
		}
		if (validator.isEmpty(cnewpass)) {
			$('#cnewpassErr').text('Empty field!');
		}
		// check if equal
		
		
		if ( true ) {
			// send post request, check if user exists
			$.post('/', {}, function(result) {
				switch (result.status) {
					case 200: {
					}
					case 401: {
					}
					case 500: {
					}
				}
			});
		}
	});
	
	/* CART METHODS */
	
	// CART: for cart page, initial get totals
	updateTotals();
	
	// CART: changing cart qty -
	$(".minus").click(function() {
		var qty = Number.parseInt($(this).next().text());
		if (qty > 1)
			$(this).next().text(qty-1);
		updateTotals();
	});
	
	// CART: changing cart qty +
	$(".plus").click(function() {
		var qty = Number.parseInt($(this).prev().text());
		var max = Number.parseInt($(this).parent().prev().children("a").prev().children("strong").text());
		if (qty < max)
			$(this).prev().text(qty+1);
		updateTotals();
	});
	
	// CART: delete item from cart
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
	
	/* WISHLIST METHOD */
	
	// WISHLIST: delete item from wishlist
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
