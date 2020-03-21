function openNav() {
    document.getElementById("mySideNav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}

$(document).ready(function () {
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
		
		console.log(pArr, qArr, tPrice, tQty);
		
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
		var max = $(this).parent().siblings(".desc").children("p .qty").text();
		if (qty < Number.parseInt(max))
			$(this).prev().text(qty+1);
		updateTotals();
	});
});