'use strict';

app.adidasItemCreateHome = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('adidasItemCreateHome');

(function (parent) {
    var
        spendModel = kendo.observable({
            category:"",
            item:"",
            material:"",
            color:"",
            model:"",
            currentBlock: {},
            sneakerList: [],
            inventory:"",
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
            createSneaker: function (e) {
                // Validation
                var block = app.getChain();
                spendModel.saveSneaker(block);

                setTimeout(function () {
                    spendModel.getAllSneaker();
                }, 7000);
            },
            saveSneaker: function (prevblock) {
                spendModel.set("currentBlock", prevblock);

                
                /*var result = app.queryApi("getSneaker", [spendModel.item]);

                console.log(result.responseText)

                if(result.responseText){
                    alert("The design already available in Blockchain network");
                    return;
                }*/

                var args = [];
                var func = "createSneaker";
                args.push(spendModel.model); //model
                args.push("sneaker"); // type
                args.push("" +new Date()); //manufacture date
                args.push("" + spendModel.item); // adidas id
                args.push("certificate1.jpg"); // certificate
                args.push("Active"); //status
                args.push(localStorage.getItem("userName")); // user
                args.push(spendModel.color); // color
                args.push("Shoe"); // parts
                args.push(""+spendModel.material); // material
                args.push("" + prevblock.height);
                args.push(localStorage.getItem("userName"));
                args.push(prevblock.currentBlockHash);

                var result = app.invokeApi(func, args);
                if (result.status == 202) {
                    var data = JSON.parse(result.responseText);
                    console.log(data);
                    app.showNotification("Sneaker created successfully");

                    $("#finish").hide();

                    $('#qrcode').show();

                    $('#qrcode').qrcode({
                        text	: result.responseText
                    });
                }
                
                
            },
            getAllSneaker: function (e) {
                var result = app.queryApi("getSneaker", ["sneakerids"]);
                if (result.status == 200) {
                    spendModel.sneakerList = JSON.parse(result.responseText);
                }

                if(spendModel.sneakerList){

                    var message = spendModel.sneakerList;

                    var inventory = 0;
                    if (message != "null" && message != null) {
                        $.each(message.sneaker, function (k, v) {
                            inventory++;
                        });
                    }

                    spendModel.set("inventory",inventory);
                }
                
            },
            showInventory: function(){
                var message = spendModel.sneakerList;

                var inventory = 0;
                var html = '<table class="table"><thead class="text-primary"><th>Sneakers</th></thead><tbody>';
                if (message != "null" && message != null) {
                    $.each(message.sneaker, function (k, v) {
                        inventory++;
                        html += '<tr><td>'+v+'</td></tr>';
                    });
                }

                html += "</tbody></table>"

                swal({
                    title: 'Inventory List',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-success",
                    html:html
                    }).catch(swal.noop)

            },
            showTransaction: function () {
                var tag = spendModel.item;
                if (tag == "") {
                    app.showNotification("Please Provide Barcode");
                    return false;
                }
                var masterdata = [], datavalue = {}, items = [], itemsvalue = {};

                // Cattle information
                var cattleinfo = [];
                var result = app.queryApi("getSneaker", [tag]);
                if (result.status == 200) {
                    var data = JSON.parse(result.responseText);
                    try {
                        cattleinfo.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (cattleinfo.length < 0) {
                    app.showNotification("Sneaker information is not found");
                    return false;
                }

                var cattlehdrmessage =[]

                var result1 = app.queryApi("getSneaker", ["sneakerhdr-" + tag]);
                if (result1.status == 200) {
                    var data1 = JSON.parse(result1.responseText);
                    var message1 = data1;
                    cattlehdrmessage.push(message1);

                    var createdata = {};
                    var batchdata = {}, batcharr =[];
                    var transferdata = {},trnasferarr =[];
                    var rmcreationdata = {}, rmcreationarr = [];
                    var rmbatchdata = {},rmbatch =[];
                    var rmtransferdata = {}, rmtransferarr = [];
                    var foodpkgcreationdata = {}, foodpkgcreation= [];
                    var foodpkgbatchdata = {}, foodpkgbatcharr =[];
                    var foodpkgtransferdata = {},foodpkgtransfer =[];
                   
                    var len = message1.blockheader.length;

                    for (var i = len-1 ; i >= 0 ; i--) {var hdrinfo = JSON.parse(message1.blockheader[i]);

                        console.log(hdrinfo);

                        if (hdrinfo.type == "PKGTRANSFER") {
                            foodpkgtransferdata = {};
                            foodpkgtransferdata["block"] = hdrinfo.block;
                            foodpkgtransferdata["type"] = hdrinfo.type;
                            foodpkgtransferdata["value"] = hdrinfo.value;
                            foodpkgtransferdata["prevHash"] = hdrinfo.prevHash;
                            foodpkgtransfer.push(foodpkgtransferdata)

                        } else if (hdrinfo.type == "PKGCREATION") {
                            foodpkgcreationdata = {};
                            foodpkgcreationdata["block"] = hdrinfo.block;
                            foodpkgcreationdata["type"] = hdrinfo.type;
                            foodpkgcreationdata["value"] = hdrinfo.value;
                            foodpkgcreationdata["prevHash"] = hdrinfo.prevHash;
                            foodpkgcreation.push(foodpkgcreationdata)

                        } else if (hdrinfo.type == "RMTRANSFER") {
                            rmtransferdata = {};
                            rmtransferdata["block"] = hdrinfo.block;
                            rmtransferdata["type"] = hdrinfo.type;
                            rmtransferdata["value"] = hdrinfo.value;
                            rmtransferdata["prevHash"] = hdrinfo.prevHash;

                            var rmid = hdrinfo.value.split(":")[1];
                            console.log(rmid);
                            for (var j = 0; j < foodpkgcreation.length; j++) {
                                var pkgvalue = foodpkgcreation[j].value;
                                
                                if(typeof pkgvalue != "object"){
                                    pkgvalue = JSON.parse(pkgvalue);
                                }
                                console.log(pkgvalue);
                                if (pkgvalue.rmid == rmid) {
                                    items = [];
                                    for (var k = 0 ; k < pkgvalue.pkgids.length ; k++) {
                                        foodpkgcreationdata = {};
                                        foodpkgcreationdata["block"] = foodpkgcreation[j].block;
                                        foodpkgcreationdata["type"] = foodpkgcreation[j].type;
                                        foodpkgcreationdata["value"] = pkgvalue.pkgids[k];
                                        foodpkgcreationdata["prevHash"] = foodpkgcreation[j].prevHash;
                                        var inneritems = [];
                                        for (var h = 0 ; h < foodpkgtransfer.length ; h++) {
                                            var pkgid = foodpkgtransfer[h].value.split(":")[1];
                                            if (pkgvalue.pkgids[k] == pkgid) {
                                                inneritems.push(foodpkgtransfer[h]);
                                                foodpkgcreationdata["items"] = inneritems;
                                            }
                                        }

                                        items.push(foodpkgcreationdata);
                                    }
                                    rmtransferdata["items"] = items;
                                }
                            }

                            rmtransferarr.push(rmtransferdata);

                        } else if (hdrinfo.type == "TRANSFER") {
                            transferdata["block"] = parseInt(hdrinfo.block)+1;
                            transferdata["type"] = hdrinfo.type;
                            transferdata["value"] = hdrinfo.value;
                            transferdata["prevHash"] = hdrinfo.prevHash;
                            transferdata["items"] = rmtransferarr;
                        }  else if (hdrinfo.type == "CREATE") {
                            items = [];
                            createdata["sneakermodel"] = cattleinfo[0].sneakermodel;
                            createdata["sneakertype"] = cattleinfo[0].sneakertype;
                            createdata["manufacturedate"] = cattleinfo[0].manufacturedate;
                            createdata["adidasid"] = cattleinfo[0].adidasid;
                            createdata["certificate"] = cattleinfo[0].certificate;
                            createdata["user"] = cattleinfo[0].user;
                            createdata["status"] = cattleinfo[0].status;
                            createdata["color"] = cattleinfo[0].color;
                            createdata["parts"] = cattleinfo[0].parts;
                            createdata["material"] = cattleinfo[0].material;
                            createdata["block"] = parseInt(hdrinfo.block)+1;
                            createdata["type"] = hdrinfo.type;
                            createdata["value"] = hdrinfo.value;
                            createdata["prevHash"] = hdrinfo.prevHash;
                            items.push(transferdata);
                            createdata["items"] = items;
                        }
                    }
                    createDiagram
                    masterdata.push(createdata);

                    createDiagram(masterdata);

                }
            },
            initMaterialWizard: function () {
                // Code for the Validator
                var $validator = $('.wizard-card form').validate({
                    rules: {
                        item: {
                            required: true,
                            minlength: 3
                        },
                        material: {
                            required: true
                        },
                        date: {
                            required: true
                        }
                    },

                    errorPlacement: function (error, element) {
                        $(element).parent('div').addClass('has-error');
                    }
                });

                // Wizard Initialization
                $('.wizard-card').bootstrapWizard({
                    'tabClass': 'nav nav-pills',
                    'nextSelector': '.btn-next',
                    'previousSelector': '.btn-previous',

                    onNext: function (tab, navigation, index) {
                        var $valid = $('.wizard-card form').valid();
                        if (!$valid) {
                            $validator.focusInvalid();
                            return false;
                        }
                    },

                    onInit: function (tab, navigation, index) {
                        //check number of tabs and fill the entire row
                        var $total = navigation.find('li').length;
                        var $wizard = navigation.closest('.wizard-card');

                        var $first_li = navigation.find('li:first-child a').html();
                        var $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
                        $('.wizard-card .wizard-navigation').append($moving_div);

                        refreshAnimation($wizard, index);

                        $('.moving-tab').css('transition', 'transform 0s');
                    },

                    onTabClick: function (tab, navigation, index) {
                        var $valid = $('.wizard-card form').valid();

                        if (!$valid) {
                            return false;
                        } else {
                            return true;
                        }
                    },

                    onTabShow: function (tab, navigation, index) {
                        var $total = navigation.find('li').length;
                        var $current = index + 1;

                        var $wizard = navigation.closest('.wizard-card');

                        // If it's the last tab then hide the last button and show the finish instead
                        if ($current >= $total) {
                            $($wizard).find('.btn-next').hide();
                            $($wizard).find('.btn-finish').show();
                        } else {
                            $($wizard).find('.btn-next').show();
                            $($wizard).find('.btn-finish').hide();
                        }

                        var button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                        setTimeout(function () {
                            $('.moving-tab').text(button_text);
                        }, 150);

                        var checkbox = $('.footer-checkbox');

                        if (!index == 0) {
                            $(checkbox).css({
                                'opacity': '0',
                                'visibility': 'hidden',
                                'position': 'absolute'
                            });
                        } else {
                            $(checkbox).css({
                                'opacity': '1',
                                'visibility': 'visible'
                            });
                        }

                        refreshAnimation($wizard, index);
                    }
                });


                // Prepare the preview for profile picture
                $("#wizard-picture").change(function () {
                    readURL(this);
                });

                $('[data-toggle="wizard-radio"]').click(function () {
                    var wizard = $(this).closest('.wizard-card');
                    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
                    $(this).addClass('active');
                    $(wizard).find('[type="radio"]').removeAttr('checked');
                    $(this).find('[type="radio"]').attr('checked', 'true');
                    var category = $(this).find('[type="radio"]').val();
                    spendModel.set("category",category);

                    var selectedCategory = spendModel.category;

                    spendModel.set("item",selectedCategory); 
                    var model = "sport",color="default";
                    $.each(spendModel.data,function(k,v){
                        if(v.barcode == selectedCategory){
                            model = v.model;
                            color = v.color;

                        }
                    });

                    spendModel.set("color",color);
                    spendModel.set("model",model);

                });

                $('[data-toggle="wizard-checkbox"]').click(function () {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $(this).find('[type="checkbox"]').removeAttr('checked');
                    } else {
                        $(this).addClass('active');
                        $(this).find('[type="checkbox"]').attr('checked', 'true');
                    }
                });

                $('[name="transactiontype"]').click(function () {
                    var transactiontype = $(this).val();
                    spendModel.set("transactiontype",transactiontype);
                });

                $('.set-full-height').css('height', 'auto');

                //Function to show image before upload

                function readURL(input) {
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
                        }
                        reader.readAsDataURL(input.files[0]);
                    }
                }

                $(window).resize(function () {
                    $('.wizard-card').each(function () {
                        var $wizard = $(this);

                        var index = $wizard.bootstrapWizard('currentIndex');
                        refreshAnimation($wizard, index);

                        $('.moving-tab').css({
                            'transition': 'transform 0s'
                        });
                    });
                });

                function refreshAnimation($wizard, index) {
                    var $total = $wizard.find('.nav li').length;
                    var $li_width = 100 / $total;

                    var total_steps = $wizard.find('.nav li').length;
                    var move_distance = $wizard.width() / total_steps;
                    var index_temp = index;
                    var vertical_level = 0;

                    var mobile_device = $(document).width() < 600 && $total > 3;

                    if (mobile_device) {
                        move_distance = $wizard.width() / 2;
                        index_temp = index % 2;
                        $li_width = 50;
                    }

                    $wizard.find('.nav li').css('width', $li_width + '%');

                    var step_width = move_distance;
                    move_distance = move_distance * index_temp;

                    var $current = index + 1;

                    if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
                        move_distance -= 8;
                    } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
                        move_distance += 8;
                    }

                    if (mobile_device) {
                        vertical_level = parseInt(index / 2);
                        vertical_level = vertical_level * 38;
                    }

                    $wizard.find('.moving-tab').css('width', step_width);
                    $('.moving-tab').css({
                        'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
                        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                    });
                }
            }

        });

    parent.set('spendModel', spendModel);

    
    parent.set('onShow', function (e) {
        spendModel.set("currentMonth", localStorage.getItem("currentMonth"));
        var $full_page = $('.dashboard-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('height', '100%');
            $full_page.css('width', '100%');
            $full_page.css('background-size', 'contain');
            $full_page.fadeIn('fast');
        });
        var template = kendo.template($("#categorylistTemplate").html());

        var tempData = {
            data: spendModel.data
        }
        var result = template(tempData);
        $("#categorylist").html(result);

        spendModel.initMaterialWizard();

        setTimeout(function () {
            $('.card.wizard-card').addClass('active');
        }, 600);

        $(".tagsinput").tagsinput();

        spendModel.getAllSneaker();
       
    });

    parent.set('afterShow', function (e) {
        
    });

    function visualTemplate(options) {
        var dataviz = kendo.dataviz;
        var g = new dataviz.diagram.Group();
        var dataItem = options.dataItem;

        console.log(JSON.stringify(dataItem));

        var name = "", title = "", image = "",gradientcolor="", via = false, content="",height=65,width=190;
        console.log(dataItem);
        if (dataItem.type == "CREATE") {
            name = "Sneaker  - " + dataItem.adidasid;
            title = dataItem.sneakermodel;
            image = "img/trace_logo.png";
            gradientcolor = "#2196f3";
            content = "Adidas";
            width =250;
        } else if (dataItem.type == "BATCH") {
            name = "Lot ID -" + dataItem.value;
            title = "";
            image = "components/home/batch.png";
            gradientcolor = "#8700ff";
            content = "Batch Created";
        }
        else if (dataItem.type == "TRANSFER" && dataItem.value == "Factory") {
            name = dataItem.value;
            title = "";
            image = "img/factory.png";
            gradientcolor = "#00e68a";
            content = "Transfered to Dealer";
        }
        else if (dataItem.type == "TRANSFER" && dataItem.value != "Factory") {
            name = dataItem.value;
            title = "";
            image = "img/transfer.png";
            gradientcolor = "#00e68a";
            content = "Transfered to Dealer";
        }else if (dataItem.type == "PKGTRANSFER") {
            name = "Package Transfer";
            title = dataItem.value;
            image = "components/home/retailer.png";
            gradientcolor = "#1e4c96";
            content = "Package Transfer";
        }

        var path ="";
        path = new dataviz.diagram.Path({
            data:"M 182 1 C 202 1 202 1 202 21 V 81 C 202 101 202 101 182 101 H 22 C 2 101 2 101 2 81 V 21 C 2 1 2 1 22 1 z",
            width:300,
            height:80,
            stroke:{
                color:"black"
            },
            fill: {
                gradient: {
                    type: "linear",
                    stops: [{
                        color: gradientcolor,
                        offset: 0,
                        opacity: 0.5
                    }, {
                        color: gradientcolor,
                        offset: 1,
                        opacity: 1
                    }]
                }
            }
        });

        g.append(path);

        g.append(new dataviz.diagram.Image({
            source: image,
            x: 5,
            y: 15,
            width: 65,
            height: 50
        }));
        
        g.append(new dataviz.diagram.TextBlock({
            text: name,
            x:85,
            y: 25,
            fill: "#fff"
        }));
        
        if(dataItem.type == "CREATE"){

            g.append(new dataviz.diagram.Circle({
                radius: 9,
                x:85,
                y:50,
                fill: "#FF5722"
            }));

            g.append(new dataviz.diagram.Circle({
                radius: 9,
                x:125,
                y:50,
                fill: "#FFC107"
            }));


            g.append(new dataviz.diagram.Circle({
                radius: 9,
                x:165,
                y:50,
                fill: "#8BC34A"
            }));
        
            g.append(new dataviz.diagram.Circle({
                radius: 9,
                x:205,
                y:50,
                fill: "#3F51B5"
            }));

        }

        return g;
    }

    var diagram = kendo.dataviz.diagram;
    var Shape = diagram.Shape;
    var Connection = diagram.Connection;
    var Point = diagram.Point;

    function elementText(element) {
        var text;
        if (element instanceof Shape) {
            text = element.dataItem;
        } else if (element instanceof Point) {
            text = "(" + element.x + "," + element.y + ")";
        } else if (element instanceof Connection) {
            var source = element.source();
            var target = element.target();
            var sourceElement = source.shape || source;
            var targetElement = target.shape || target;
            text = elementText(sourceElement) + " - " + elementText(targetElement);
        }
        return text;
    }

    function onSelect(e) {

        var dialog = $("#blockwindow").data("kendoWindow");
        var html = "<table class='table' style='width:100%'>";
        var dataItem = e.item.dataItem;

        console.log(dataItem);

        try {
            var block = dataItem.block;
            var blockdata = app.getBlock(block);

            var txid = blockdata.data.data[0].payload.header.channel_header.tx_id;
            
            var result = app.getTransaction(txid);
            var data = JSON.parse(result.responseText);
            var channelheader = data.transactionEnvelope.payload.header.channel_header;
            var channelHeaderTemplate = kendo.template($("#channelHeaderTemplate").html());
            var channelHtml = channelHeaderTemplate({data: channelheader});
            
            console.log(data.transactionEnvelope.payload);
            html += "<tr><td><strong>Transaction Id : </strong>" + txid + "</td></tr>";
            if(data.transactionEnvelope.payload.data){
                var nsWrites = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset;
                var payloadTemplate = kendo.template($("#payloadTemplate").html());
                var payloadHtml = payloadTemplate({data: { pay: nsWrites[0], key:dataItem.adidasid }});
                html += "<tr><td><strong>Payload </strong>" + payloadHtml + "</td></tr>";
            }
            html += "<tr><td>" + channelHtml + "</td></tr>";

            html += "</table>";

            swal({
                title: 'Block Information',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success",
                customClass: 'swal-wide',
                html:html
                }).catch(swal.noop)


            var text = $(".text-b");
            text.click(function() {
                if (text.hasClass("hidden-b")) {
                    text.removeClass("hidden-b");
                } else {
                text.addClass("hidden-b");
                }
            });

        } catch (e) {
            console.log("Error getting block information" + e);
        }
    }

    function createDiagram(data) {
        $("#diagramsection").show();
        $("#diagram").kendoDiagram({
            dataSource: new kendo.data.HierarchicalDataSource({
                data: data,
                schema: {
                    model: {
                        children: "items"
                    }
                }
            }),
            layout: {
                type: "layered"
            },
            shapeDefaults: {
                visual: visualTemplate
            },
            connectionDefaults: {
                stroke: {
                    color: "#979797",
                    width: 2
                },
                startCap: "FilledCircle",
                endCap: "ArrowEnd"
            },
            click: onSelect,
            zoomStart: function(ev) {
                if (!ev.meta.ctrlKey) {
                  ev.preventDefault(true);
                }
              }
        });

        var diagram = $("#diagram").getKendoDiagram();
        diagram.bringIntoView(diagram.shapes);
    }

})(app.adidasItemCreateHome);
