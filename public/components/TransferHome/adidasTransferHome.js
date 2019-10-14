'use strict';

app.adidasTransferHome = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('adidasTransferHome');

(function (parent) {
    var
        transferModel = kendo.observable({
            sneakerList:[],
            data : [
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
            ],
            getSneaker: function(e){
                 var source = e.target.value;
                 if(source == "nike"){
                     transferModel.getAllSneaker();
                 } else  {
                     var result = app.queryApi("getSneaker", [source]);
                     var inventoryData =[];
                     if (result.status == 200) {
                         var list = JSON.parse(result.responseText);
                         var sneakers = list.transfer;
                         console.log(sneakers);
                         $.each(sneakers,function(k,v){
                             $.each(transferModel.data,function(key,val){
                                 var value = JSON.parse(v);
                                 if(value.id == val.barcode && value.to == source){
                                     inventoryData.push(val);
                                 }
                             })
                         })
                     }
 
                     var template = kendo.template($("#cartlistTemplate").html());
 
 
                     var tempData = {
                         data: inventoryData
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
                         $checkbox.prop("checked",!$checkbox.prop("checked"));
                         $('#qrprint').empty();
                         if($checkbox.prop("checked")){
                             var barcode = $("input[type='checkbox']:checked").val();
                             $('#qrprint').qrcode({
                                 text	: "http://localhost:6001/#components/trace/view.html?id="+barcode
                             });
                         }
                         e.preventDefault();
                       });
                 } 
             },
            getAllSneaker: function (e) {
                var result = app.queryApi("getSneaker", ["sneakerids"]);
                if (result.status == 200) {
                    transferModel.sneakerList = JSON.parse(result.responseText);
                }

                if(transferModel.sneakerList){

                    var message = transferModel.sneakerList;

                    var inventory = 0;
                    var inventoryData =[];
                    if (message != "null" && message != null) {
                        $.each(message.sneaker, function (k, v) {
                            inventory++;
                            for(var i =0;i< transferModel.data.length;i++){
                                if(v == transferModel.data[i].barcode){
                                    inventoryData.push(transferModel.data[i]);
                                }
                            }
                        });
                    }

                    transferModel.set("inventory",inventory);

                    var template = kendo.template($("#cartlistTemplate").html());


                    var tempData = {
                        data: inventoryData
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
                        $checkbox.prop("checked",!$checkbox.prop("checked"));
                        console.log($checkbox.prop("checked"));
                        if($checkbox.prop("checked")){
                            var barcode = $("input[type='checkbox']:checked").val();
                            console.log(barcode);
                            $('#qrprint').qrcode({
                                text	: barcode+""
                            });
                        }

                        e.preventDefault();
                      });

                }
                
            },
            createTransfers: function () {

                var barcode = $("input[type='checkbox']:checked").val();



                if (barcode) {
                    var block = app.getChain();
                    transferModel.createTransfer(block, barcode, $("#sender").val());
                } else {
                    app.showNotification("Please Pick one Sneaker  to transfer");
                }
            },
            createTransfer: function (prevBlock, barcode, sender) {
                var height = prevBlock.height;
                var args = [];

                var sneakerList = [];
                var from = $("#source").val();

                if(from == sender){
                    app.showNotification("Sender & Receiver should not be the same.")
                    return false;
                }

                var result1 = app.queryApi("getSneaker", [barcode]);
                if (result1.status == 200) {
                    var data1 = JSON.parse(result1.responseText);
                    var message1 = data1;
                    sneakerList.push(message1);
                }

                // args[0]
                var zeroarg = {
                    id: barcode,
                    value: JSON.stringify(sneakerList),
                    header: "Transfered to "+sender,
                    from: from,
                    to: sender,
                    date: new Date().toLocaleDateString()
                }

                args.push(JSON.stringify(zeroarg));
               
                // args[1]
                args.push(from);
                // args[2]
                args.push(sender);
                console.log(sneakerList);

                var result = app.invokeApi("createSneakerTransfer", args);
                if (result.status == 202) {
                    var data = JSON.parse(result.responseText);
                    app.showNotification("Sneaker Transfered successfully");

                    

                }

                var type = "TRANSFER";

                if(from == "Factory"){
                    type = "RMTRANSFER";
                }

                for (var i = 0; i < sneakerList.length ; i++) {
                    var adidasid = sneakerList[i].adidasid;
                    args = []
                    args[0] = "";
                    args[1] = "sneakerhdr-" + adidasid;
                    var headerjson = {
                        block: height + "",
                        type: type,
                        value: sender,
                        prevHash: prevBlock.currentBlockHash
                    };

                    args.push(JSON.stringify(headerjson));
                    result = app.invokeApi("updateHdr", args);
                }
            }

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

        transferModel.getAllSneaker();

        $("#source").on("change",function(e){
            transferModel.getSneaker(e);
            if(e.target.value == "Factory"){
                $("#factoryprocess").show();
                $("#factorycol").addClass("col-md-3");
                $("#transfercol").removeClass("col-md-offset-2")
                $("#qrprint").empty();
            }else{
                $("#factorycol").removeClass("col-md-3");
                $("#factoryprocess").hide();
                $("#transfercol").addClass("col-md-offset-2");
            }

        })

        $("#factoryprocess").hide();
        
        
    });

    parent.set('afterShow', function (e) {
        
    });
})(app.adidasTransferHome);
