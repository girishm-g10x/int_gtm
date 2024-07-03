window.dataLayer = window.dataLayer || [];
console.log("test");

document.addEventListener('DOMContentLoaded', function () {
    // Select all anchor elements within image containers
    var imageContainers = document.querySelectorAll('.image-container > a');

    // Add click event listener to each anchor element
    imageContainers.forEach(function (link) {
        link.addEventListener('click', function () {
            // Get the img element within the anchor tag
            var imgElement = link.querySelector('.tile-image');

            // Extract product name from the img element's alt attribute
            var productName = imgElement.getAttribute('alt');
            
            var productTitle = imgElement.getAttribute('title');

            // Push the product name to the dataLayer
            dataLayer.push({
                'event': 'image_click',
                'Productname': productName,
                'Producttitle': productTitle,
            });
        });
    });
});
