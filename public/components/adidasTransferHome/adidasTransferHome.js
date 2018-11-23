'use strict';

app.adidasTransferHome = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('adidasTransferHome');

(function (parent) {
    var
        transferModel = kendo.observable({
            

        });

    parent.set('transferModel', transferModel);

    
    parent.set('onShow', function (e) {
        
        var $full_page = $('.dashboard-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('height', '100%');
            $full_page.css('width', '100%');
            $full_page.css('background-size', 'contain');
            $full_page.fadeIn('fast');
        });

        var template = kendo.template($("#cartlistTemplate").html());

        var data = [
            {
                "cartItem": "MEN'S ADIDAS RUNNING PUREBOOST RBL SHOES",
                "cartId":1,
                "img": "img/cart/shoes1.jpg",
                "saleType":1, "itemVerified":1,
                "price":"$100"
            },
            {
                "cartItem": "ADIDAS GOLETTO VI FG FOOTBALL SHOES FOR MEN",
                "cartId":2,
                "img": "img/cart/shoes2.jpg",
                "saleType":1, "itemVerified":1,
                "price":"$120"
            },
            {
                "cartItem": "ADIDAS NEMEZIZ MESSI 18.4 FXG FOOTBALL SHOES FOR MEN",
                "cartId":3,
                "img": "img/cart/shoes3.jpg",
                "saleType":2, "itemVerified":2,
                "price":"$200"
            },
            {
                "cartItem": "ADIDAS ACE 16.4 FXG J SOCCER FOR MEN",
                "cartId":1,
                "img": "img/cart/shoes4.jpg",
                "saleType":1, "itemVerified":1,
                "price":"$150"
            }
        ];

        var tempData = {
            data: data
        }
        var result = template(tempData);
        $("#cartlist").html(result);

        $(".image-checkbox").each(function () {
            if ($(this).find('input[type="checkbox"]').first().attr("checked")) {
              $(this).addClass('image-checkbox-checked');
            }
            else {
              $(this).removeClass('image-checkbox-checked');
            }
          });
          
          // sync the state to the input
          $(".image-checkbox").on("click", function (e) {
            $(this).toggleClass('image-checkbox-checked');
            var $checkbox = $(this).find('input[type="checkbox"]');
            $checkbox.prop("checked",!$checkbox.prop("checked"))
          
            e.preventDefault();
          });
        
    });

    parent.set('afterShow', function (e) {
        
    });
})(app.adidasTransferHome);
