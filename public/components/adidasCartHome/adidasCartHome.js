'use strict';

app.adidasCartHome = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('adidasCartHome');

(function (parent) {
    var
        homeModel = kendo.observable({
            logout: function (e) {
                app.logout();
            }
        });

    parent.set('homeModel', homeModel);     
    parent.set('onShow', function (e) {
        localStorage.clear();

        var template = kendo.template($("#cartlistTemplate").html());

        var data = [
            {
                "cartItem": "MEN'S ADIDAS RUNNING PUREBOOST RBL SHOES",
                "cartId":1,
                "img": "img/cart/shoes1.jpg",
                "saleType":1,
                "price":"$100"
            },
            {
                "cartItem": "ADIDAS GOLETTO VI FG FOOTBALL SHOES FOR MEN",
                "cartId":2,
                "img": "img/cart/shoes2.jpg",
                "saleType":1,
                "price":"$120"
            },
            {
                "cartItem": "ADIDAS NEMEZIZ MESSI 18.4 FXG FOOTBALL SHOES FOR MEN",
                "cartId":3,
                "img": "img/cart/shoes3.jpg",
                "saleType":2,
                "price":"$200"
            },
            {
                "cartItem": "ADIDAS ACE 16.4 FXG J SOCCER FOR MEN",
                "cartId":1,
                "img": "img/cart/shoes4.jpg",
                "saleType":1,
                "price":"$150"
            },
            {
                "cartItem": "ADIDAS X 16.1 FG FOOTBALL SHOES FOR MEN",
                "cartId":1,
                "img": "img/cart/shoes5.jpg",
                "saleType":2,
                "price":"$50"
            },
            {
                "cartItem": "ADIDAS X TANGO 18.3 TF FOOTBALL SHOES FOR MEN",
                "cartId":1,
                "img": "img/cart/shoes6.jpg",
                "saleType":1,
                "price":"$130"
            }
        ];

        var tempData = {
            data: data
        }
        var result = template(tempData);
        $("#cartlist").html(result);

        /* // Step show event
        $("#smartwizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection, stepPosition) {
            if(stepPosition === 'first'){
                $("#prev-btn").addClass('invisible disabled');
            
            }else if(stepPosition === 'final'){
                $("#next-btn").addClass('invisible disabled');
                
            }else{
                $("#prev-btn").removeClass('invisible disabled');
                $("#next-btn").removeClass('invisible disabled');
            }
         });
         
         
         $('#smartwizard').smartWizard({
                 selected: 0,
                 theme: 'circles',
                 transitionEffect:'fade',
                 showStepURLhash: false,
                 toolbarSettings: {toolbarPosition: 'bottom'}
         }); */
       
    });

    parent.set('afterShow', function (e) {
        
    });
})(app.adidasCartHome);
