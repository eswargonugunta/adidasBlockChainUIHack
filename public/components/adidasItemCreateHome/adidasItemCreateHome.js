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

                    for (var i = len-1 ; i >= 0 ; i--) {
                        var hdrinfo = JSON.parse(message1.blockheader[i]);

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

                        } else if (hdrinfo.type == "RAWMEATBATCH") {
                            rmbatchdata = {};
                            rmbatchdata["block"] = hdrinfo.block;
                            rmbatchdata["type"] = hdrinfo.type;
                            rmbatchdata["value"] = hdrinfo.value;
                            rmbatchdata["prevHash"] = hdrinfo.prevHash;

                            var rmid = hdrinfo.value.split(":")[1];

                            for (var j = 0; j < rmtransferarr.length; j++) {
                                var transferrmid = rmtransferarr[j].value.split(":")[1];
                                if (rmid == transferrmid) {
                                    items = [];
                                    items.push(rmtransferarr[j])
                                    rmbatchdata["items"] = items;
                                }
                            }

                            rmbatch.push(rmbatchdata)
                        } else if (hdrinfo.type == "RAWMEATCREATION") {
                            rmcreationarr = [];
                            var value1 = hdrinfo.value;
                            if (typeof value != "object") {
                                value1 = eval(value1);
                            }
                            for (var j = 0 ; j < value1.length; j++) {
                                rmcreationdata = {};
                                var rmid = value1[j];
                                rmcreationdata["block"] = hdrinfo.block;
                                rmcreationdata["type"] = hdrinfo.type;
                                rmcreationdata["value"] = rmid;
                                rmcreationdata["prevHash"] = hdrinfo.prevHash;

                                for (var k = 0; k < rmbatch.length; k++) {
                                    var rmbatchvalue = rmbatch[k].value.split(":");
                                    if (rmid == rmbatchvalue[1]) {
                                        items=[];
                                        items.push(rmbatch[k])
                                        rmcreationdata["items"] = items;
                                    }
                                }

                                rmcreationarr.push(rmcreationdata);
                            }
                        } else if (hdrinfo.type == "TRANSFER") {
                            transferdata["block"] = hdrinfo.block;
                            transferdata["type"] = hdrinfo.type;
                            transferdata["value"] = hdrinfo.value;
                            transferdata["prevHash"] = hdrinfo.prevHash;
                            transferdata["items"] = rmcreationarr;
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
                            createdata["block"] = hdrinfo.block;
                            createdata["type"] = hdrinfo.type;
                            createdata["value"] = hdrinfo.value;
                            createdata["prevHash"] = hdrinfo.prevHash;
                            items.push(transferdata);
                            createdata["items"] = items;
                        }
                    }

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

        if (dataItem.type == "CREATE") {
            name = "Sneaker  - " + dataItem.adidasid;
            title = dataItem.SneakerModel;
            image = "img/adidas_logo1.png";
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
        else if (dataItem.type == "TRANSFER") {
            name = dataItem.value;
            title = "";
            image = "components/home/transfer.png";
            gradientcolor = "#00e68a";
            content = "Transfered to Dealer";
        }
        else if (dataItem.type == "RAWMEATCREATION") {
            name = "Raw Meat";
            title = dataItem.value;
            image = "components/home/rawmeatcreate.png";
            gradientcolor = "#f44336";
            content = "Raw meats creation";
        } else if (dataItem.type == "RAWMEATBATCH") {
            name = "Raw Meat Batch";
            title = dataItem.value;
            image = "components/home/meat.gif";
            gradientcolor = "#ffaa00";
            content = "Raw meats Batch creation";
        } else if (dataItem.type == "RMTRANSFER") {
            name = "Meat Packaging Ltd";
            title = dataItem.value.split(":")[1];
            image = "components/home/transfer.png";
            gradientcolor = "#00e68a";
            content = "Transfered to Meat Packaging Ltd";
            width =250;
        } else if (dataItem.type == "PKGCREATION") {
            name = "Package Creation";
            title = dataItem.value;
            image = "components/home/pkg.png";
            gradientcolor = "#e600e6";
            content = "Package Creation";
        } else if (dataItem.type == "PKGTRANSFER") {
            name = "Package Transfer";
            title = dataItem.value;
            image = "components/home/retailer.png";
            gradientcolor = "#1e4c96";
            content = "Package Transfer";
        }

        g.append(new dataviz.diagram.Rectangle({
            width: width,
            height: 65,
            stroke: {
                width: 0
            },
            tooltip: {
                shared: true,
                content: content,
                autoHide: false,
                position: "right"
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
        }));

        g.append(new dataviz.diagram.TextBlock({
            text: name,
            x: 55,
            y: 10,
            fill: "#fff"
        }));

        if (via) {
            g.append(new dataviz.diagram.TextBlock({
                text: "to",
                x: 75,
                y: 30,
                fill: "#fff"
            }));

            g.append(new dataviz.diagram.TextBlock({
                text: title,
                x: 55,
                y: 50,
                fill: "#fff"
            }));
        } else {
            g.append(new dataviz.diagram.TextBlock({
                text: title,
                x: 55,
                y: 30,
                fill: "#fff"
            }));
        }

       

        g.append(new dataviz.diagram.Image({
            source: image,
            x: 3,
            y: 3,
            width: 50,
            height: 50
        }));

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
        var html = "<table class='table' style='width:600px'>";
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
            html += "<tr><td>" + channelHtml + "</td></tr>";

            
            if(data.transactionEnvelope.payload.data){
                var nsWrites = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset;
                var payloadTemplate = kendo.template($("#payloadTemplate").html());
                var payloadHtml = payloadTemplate({data: nsWrites[0]});
                html += "<tr><td><strong>Payload </strong>" + payloadHtml + "</td></tr>";
            }

            html += "</table>";

            swal({
                title: 'Block Information',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success",
                customClass: 'swal-wide',
                html:html
                }).catch(swal.noop)

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
            click: onSelect
        });

        var diagram = $("#diagram").getKendoDiagram();
        diagram.bringIntoView(diagram.shapes);
    }

})(app.adidasItemCreateHome);
