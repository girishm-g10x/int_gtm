window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {
    var productLinks = document.querySelectorAll('.pdp-link > a');
 
    productLinks.forEach(function (element) {
        element.addEventListener('click', function () {
            var productName = element.textContent.trim();
 
            console.log("Product Name:", productName);
           
            var product = {
                name: productName,
            };
           
            dataLayer.push({
                'event': 'product_link_click',
                'Productname': product.name,
            });
        });
    });
});