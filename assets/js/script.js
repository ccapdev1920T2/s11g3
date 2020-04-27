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
	let data = $('input:checked').map(function() {
		return $(this).attr('name');
	}).get();
	console.log(data);
	
	if (false) {
		// make XHR object and prep it
		let xhr = new XMLHttpRequest();
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
}

$(document).ready(function() {
	
	/* LOGIN METHODS */
	
	// LOGIN: validation of form when submitting
	$('#submitLogin').click(function() {
		var user = $('#usernameLogin').val();
		var pass = $('#passwordLogin').val();
		
		$('#usErr').text('');
		$('#pwErr').text('');
		
		// checking if fields are not empty
		if (validator.isEmpty(user)) {
			$('#usErr').text('Empty field!');
		}
		if (validator.isEmpty(pass)) {
			$('#pwErr').text('Empty field!');
		}
		
		if (!validator.isEmpty(user) && !validator.isEmpty(pass)) {
			// send post request, check if user exists
			$.post('/login', {user: user, pass: pass}, function(result) {
				switch (result.status) {
					case 200: {
						window.location.href = '/'; break;
					}
					case 401: {
						alert('No user found!'); break;
					}
					case 500: {
						alert('Server error. Please try again in a while.'); break;
					}
				}
			});
		}
	});
	
	/* REGISTER METHODS */
	
	// REGISTER: validation of form when submitting
	$('button#submitReg').click(function() {
		$('p.text-danger').text(''); // resetting form
		var formArr = $('form#regForm').serializeArray();
		
		/* expected to get:
		 * 0 - fname
		 * 1 - lname
		 * 2 - username
		 * 3 - email
		 * 4 - password
		 * 5 - confirm
		 * 6 - address
		 * 7 - phone
		 * 8 - checkbox
		 */
		formArr.forEach(function(e) {
			e.value = validator.trim(e.value);
		});
		
		// empty, isEmail, username length 8-15, password length 8-inf, password match, contact is num, checkbox ticked
		var checks = Array(7).fill(true);
		
		formArr.forEach(function(e) {
			if (validator.isEmpty(e.value)) {
				$('p#' + e.name + 'Error').text('This field is required.');
				checks[0] = false;
			}
		});
		
		if (formArr.length !== 9) {
			$('p#checkboxError').text('This must be checked.');
			checks[6] = false;
		}
		if (checks[0]) {
			if (!validator.isEmail(formArr[3].value)) {
				$('p#emailError').text('Invalid email inputted.');
				checks[1] = false;
			}
			if (!validator.isLength(formArr[2].value, {min: 8, max: 15})) {
				$('p#usernameError').text('Username must be 8 to 15 characters long.');
				checks[2] = false;
			}
			if (!validator.isLength(formArr[4].value, {min: 8})) {
				$('p#passwordError').text('Password must be at least 8 characters long.');
				checks[3] = false;
			}
			if (!validator.equals(formArr[4].value, formArr[5].value)) {
				$('p#confirmError').text('Passwords do not match.');
				checks[4] = false;
			}
			if (!/^09[0-9]{2}( |-)?[0-9]{3}( |-)?[0-9]{4}$/.test(formArr[7].value)) {
				$('p#phoneError').text('Please enter a mobile number (11 digits).');
				checks[5] = false;
			}
		}
		
		if (checks.every(Boolean)) {
			$.post('/registration', formArr, function(res) {
				switch(res.status) {
					case 200: {
						window.location.href = '/login'; break;
					}
					case 401: {
						alert(res.msg); break;
					}
					case 500: {
						alert(res.msg); break;
					}
				}
			});
		}
	});
	
	/* CONFIRM EMAIL METHOD */
	
	// CONFIRM EMAIL: validation of form when submitting
	$('button#confemailsubmit').click(function() {
		$('p.text-danger').text(''); // resetting form
		var code = $('#otp').val();
		
	});
	
	/* CHANGE PW METHODS */
	
	// CHANGE PW: validation of form when submitting
	$('button#changepwsubmit').click(function() {
		$('p.text-danger').text(''); // resetting form
		var oldpass = $('#oldpass').val();
		var newpass = $('#newpass').val();
		var cnewpass = $('#confnewpass').val();
		var checks = Array(5).fill(true);
		
		if (validator.isEmpty(oldpass)) {
			$('#oldpassErr').text('Empty field!');
			checks[0] = false;
		}
		if (validator.isEmpty(newpass)) {
			$('#newpassErr').text('Empty field!');
			checks[1] = false;
		}
		if (validator.isEmpty(cnewpass)) {
			$('#cnewpassErr').text('Empty field!');
			checks[2] = false;
		}
		if (!validator.equals(newpass, cnewpass)) {
			$('#cnewpassErr').text('Passwords must match!');
			checks[3] = false;
		}
		if (checks[2] && !validator.isLength(newpass, {min: 8})) {
			$('#newpassErr').text('New password must be at least 8 characters long!');
			checks[4] = false;
		}
		
		if (checks.every(Boolean)) {
			// send post request
			$.post('/changepass', {oldpass: oldpass, newpass: newpass, confnewpass: cnewpass}, function(result) {
				switch (result.status) {
					case 200: {
						window.location.href = '/account'; break;
					}
					case 401: {
						alert(result.msg); break;
					}
					case 500: {
						alert(result.msg); break;
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
