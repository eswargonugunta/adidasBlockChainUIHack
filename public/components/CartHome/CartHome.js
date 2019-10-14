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
                    "cartItem": "Nike presto Yellow Running Shoes",
                    "barcode":"884895094173",
                    "img": "img/cart/shoe1.jpeg",
                    "model":"sport",
                    "color":"Yellow",
                    "price":"$100"
                },
                {
                    "cartItem": "Blue Men Nike Shoes",
                    "barcode":"884895094137",
                    "img": "img/cart/shoes2.jpg",
                    "model":"sport", 
                    "color":"blue",
                    "price":"$120"
                },
                {
                    "cartItem": "Nike Men Black FLY.BY LOW Basketball Shoes",
                    "barcode":"98090839624",
                    "img": "img/cart/shoes3.jpg",
                    "model":"sport", 
                    "color":"black",
                    "price":"$200"
                },
                {
                    "cartItem": "Nike Free RN 5.0",
                    "barcode":"884895093787",
                    "img": "img/cart/shoes4.png",
                    "model":"sport", 
                    "color":"blue",
                    "price":"$150"
                },
                {
                    "cartItem": "Nike Zoom Pegasus 33 Mens Running Shoes",
                    "barcode":"883947822023",
                    "img": "img/cart/shoes5.jpg",
                    "model":"sport", 
                    "color":"red",
                    "price":"$50"
                }
            ]
        });

    parent.set('cartModel', cartModel);     
    parent.set('onShow', function (e) {
        //localStorage.clear();

        localStorage.setItem("cartitems","0");


        var template = kendo.template($("#cartlistTemplate").html());

        var data = [
            {
                "cartItem": "Nike presto Yellow Running Shoes",
                "barcode":"884895094173",
                "img": "img/cart/shoe1.jpeg",
                "model":"sport",
                "color":"Yellow",
                "price":"$100",
                "seller":"seller-1"
            },
            {
                "cartItem": "Blue Men Nike Shoes",
                "barcode":"884895094137",
                "img": "img/cart/shoes2.jpg",
                "model":"sport", 
                "color":"blue",
                "price":"$120",
                "seller":"seller-1"
            },
            {
                "cartItem": "Nike Men Black FLY.BY LOW Basketball Shoes",
                "barcode":"98090839624",
                "img": "img/cart/shoes3.jpg",
                "model":"sport", 
                "color":"black",
                "price":"$200",
                "seller":"seller-1"
            }
        ];

        var tempData = {
            data: data
        }
        var result = template(tempData);
        $("#cartlist").html(result);

        var vendors = ["E-Commerce"];
        var templateData= [];

        for(var i = 0 ;i < vendors.length; i++){
            var result = app.queryApi("getSneaker", [vendors[i]]);
            
            if (result.status == 200) {
                var list = JSON.parse(result.responseText);
                var sneakers = list.transfer;

                $.each(sneakers,function(k,v){



                    $.each(cartModel.data,function(key,val){
                        var value = JSON.parse(v);
                        console.log(value);
                        if(value.id == val.barcode && value.to == vendors[i]){
                            var blockchainData = {};
                            blockchainData = val;
                            blockchainData["seller"] = vendors[i];
                            blockchainData["itemVerified"] = 1;
                            blockchainData["data"] = value.value;
                            blockchainData["transfer"] = value.value;
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
