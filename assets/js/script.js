function openNav() {
    document.getElementById("mySideNav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}

function extractCodeQty(string) {
	var arr = string.split('\n\t\t\t\t\t\t\t'); console.log(arr);
	return {code: arr[6].substring(15), qty: Number.parseInt(arr[15].substring(1))};
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
	console.log("PCQ: " + prodCodeQty);
	
	// make XHR object and prep it
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "/updateCart", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	// make state change callback: print data from server
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200)
			console.log(this.responseText);
	};
	
	// stringify JSON data and POST to server
	var data = JSON.stringify(prodCodeQty);
	xhr.send(data);
}

$(document).ready(function () {
	updateTotals();
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
});
