window.dataLayer = window.dataLayer || [];
        document.addEventListener('DOMContentLoaded', function() {
            var gtmElement = document.getElementById('gtmid');
            var gtmID = gtmElement ? gtmElement.textContent.trim() : '';
            console.log(gtmID);
            if (gtmID) {
                var flag = false;
                var product = {};

                var removeButtons = document.querySelectorAll('.remove-product');
                removeButtons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        var productId = this.getAttribute('data-product-id');
                        var productName = this.getAttribute('data-product-name');
                        var productPrice = this.getAttribute('data-product-price');

                        // Set the product information
                        product = {
                            id: productId,
                            name: productName,
                            price: productPrice
                        };

                        // Set the flag to indicate a product is selected for removal
                        flag = true;
                    });
                });

                var deleteConfirm = document.querySelectorAll('.cart-delete-confirmation-btn');
                deleteConfirm.forEach(function(button) {
                    button.addEventListener('click', function() {
                        if (flag && product.id) {
                            dataLayer.push({
                                event: 'remove_from_cart',
                                Productname: product.name,
                                price: product.price,
                                productid: product.id,
                                gtmID: product.gtmID
                            });

                            // Reset the flag and product object after pushing to dataLayer
                            flag = false;
                            product = {};
                        }
                    });
                });
            }
        });