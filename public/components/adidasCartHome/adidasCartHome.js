'use strict';

app.adidasCartHome = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('adidasCartHome');

(function (parent) {
    var
        cartModel = kendo.observable({
            logout: function (e) {
                app.logout();
            },
            showData: function(e){
                console.log(e.target.value);
            },
            data:[
                {
                    "cartItem": "MEN'S ADIDAS RUNNING PUREBOOST RBL SHOES",
                    "barcode":"884895094173",
                    "img": "img/cart/shoes1.jpg",
                    "model":"sport",
                    "color":"Orange",
                    "price":"$100"
                },
                {
                    "cartItem": "ADIDAS GOLETTO VI FG FOOTBALL SHOES FOR MEN",
                    "barcode":"884895094173",
                    "img": "img/cart/shoes2.jpg",
                    "model":"sport", 
                    "color":"black",
                    "price":"$120"
                },
                {
                    "cartItem": "ADIDAS NEMEZIZ MESSI 18.4 FXG FOOTBALL SHOES FOR MEN",
                    "barcode":"98090839624",
                    "img": "img/cart/shoes3.jpg",
                    "model":"sport", 
                    "color":"green",
                    "price":"$200"
                },
                {
                    "cartItem": "ADIDAS ACE 16.4 FXG J SOCCER FOR MEN",
                    "barcode":"884895093787",
                    "img": "img/cart/shoes4.jpg",
                    "model":"sport", 
                    "color":"DarkGreen",
                    "price":"$150"
                },
                {
                    "cartItem": "ADIDAS X 16.1 FG FOOTBALL SHOES FOR MEN",
                    "barcode":"883947822023",
                    "img": "img/cart/shoes5.jpg",
                    "model":"sport", 
                    "color":"While",
                    "price":"$50"
                },
                {
                    "cartItem": "ADIDAS X TANGO 18.3 TF FOOTBALL SHOES FOR MEN",
                    "barcode":"884417886477",
                    "img": "img/cart/shoes6.jpg",
                    "model":"sport", 
                    "color":"Yellow",
                    "price":"$130"
                }
            ]
        });

    parent.set('cartModel', cartModel);     
    parent.set('onShow', function (e) {
        localStorage.clear();

        var template = kendo.template($("#cartlistTemplate").html());

        var data = [
            {
                "cartItem": "MEN'S ADIDAS RUNNING PUREBOOST RBL SHOES",
                "barcode":"884895094173",
                "img": "img/cart/shoes1.jpg",
                "model":"sport",
                "color":"Orange",
                "price":"$100",
                "seller":"Navigators"
            },
            {
                "cartItem": "ADIDAS GOLETTO VI FG FOOTBALL SHOES FOR MEN",
                "barcode":"884895094173",
                "img": "img/cart/shoes2.jpg",
                "model":"sport", 
                "color":"black",
                "price":"$120",
                "seller":"Navigators"
            },
            {
                "cartItem": "ADIDAS NEMEZIZ MESSI 18.4 FXG FOOTBALL SHOES FOR MEN",
                "barcode":"98090839624",
                "img": "img/cart/shoes3.jpg",
                "model":"sport", 
                "color":"green",
                "price":"$200",
                "seller":"Navigators"
            }
        ];

        var tempData = {
            data: data
        }
        var result = template(tempData);
        $("#cartlist").html(result);

        var vendors = ["Wholesale","E-Commerce"];
        var templateData= [];

        for(var i = 0 ;i < vendors.length; i++){
            var result = app.queryApi("getSneaker", [vendors[i]]);
            
            if (result.status == 200) {
                var list = JSON.parse(result.responseText);
                var sneakers = list.transfer;

                $.each(sneakers,function(k,v){
                    $.each(cartModel.data,function(key,val){
                        var value = JSON.parse(v);
                        if(value.id == val.barcode){
                            var blockchainData = {};
                            blockchainData = val;
                            blockchainData["seller"] = vendors[i];
                            blockchainData["itemVerified"] = 1;
                            blockchainData["data"] = value.value;
                            templateData.push(blockchainData);
                            
                        }
                    })
                })
            }
        }

        console.log(templateData);
        
        tempData = {
            data: templateData
        }

        $("#cartlist").prepend(template(tempData));
        
    });

    parent.set('afterShow', function (e) {
        
    });
})(app.adidasCartHome);
