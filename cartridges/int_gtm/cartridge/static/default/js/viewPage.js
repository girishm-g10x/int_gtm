window.dataLayer = window.dataLayer || [];
 
document.addEventListener('DOMContentLoaded', function () {
    var imageContainers = document.querySelectorAll('.image-container > a');
 
    imageContainers.forEach(function (link) {
        link.addEventListener('click', function () {
            var imgElement = link.querySelector('.tile-image');
 
            var productName = imgElement.getAttribute('alt');
           
            var productTitle = imgElement.getAttribute('title');
 
            dataLayer.push({
                'event': 'image_click',
                'Productname': productName,
                'Producttitle': productTitle,
            });
        });
    });
});
 
