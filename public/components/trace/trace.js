'use strict';

app.trace = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('trace');

(function (parent) {
    var
        traceModel = kendo.observable({
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
            showTransaction: function () {
                var tag = traceModel.item;
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
                            rmtransferdata["block"] =  parseInt(hdrinfo.block)+1;
                            rmtransferdata["type"] = hdrinfo.type;
                            rmtransferdata["value"] = hdrinfo.value;
                            rmtransferdata["prevHash"] = hdrinfo.prevHash;
                            rmtransferdata["items"] = foodpkgcreation;
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
                            createdata["block"] =parseInt(hdrinfo.block)+1;
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
            }

        });

    parent.set('traceModel', traceModel);

    
    parent.set('onShow', function (e) {
        traceModel.set("currentMonth", localStorage.getItem("currentMonth"));
        var $full_page = $('.dashboard-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('height', '100%');
            $full_page.css('width', '100%');
            $full_page.css('background-size', 'contain');
            $full_page.fadeIn('fast');
        });

        setTimeout(function () {
            $('.card.wizard-card').addClass('active');
        }, 600);
        traceModel.set("item",e.view.params.id) ;
        traceModel.showTransaction();
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
            image = "img/trace_logo.png";
            gradientcolor = "#2196f3";
            content = "Nike";
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
        } else if (dataItem.type == "RMTRANSFER") {
            name = dataItem.value;
            title = "";
            image = "img/transfer.png";
            gradientcolor = "#1e4c96";
            content = "Transfered to "+dataItem.value;
        } else if (dataItem.type == "PKGCREATION") {
            console.log(dataItem);
            name = "Purchased";
            title = dataItem.value;
            image = "img/user.png";
            gradientcolor = "#e600e6";
            content = "Bought by "+dataItem.value;
        } else if (dataItem.type == "PKGTRANSFER") {
            name = "Package Transfer";
            title = dataItem.value;
            image = "components/home/retailer.png";
            gradientcolor = "#1e4c96";
            content = "Bought by "+dataItem.value;
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
        var html = "<table class='table' style='width:600px'>";
        var dataItem = e.item.dataItem;

        

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

})(app.trace);
