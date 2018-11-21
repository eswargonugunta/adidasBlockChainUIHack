'use strict';

app.admin = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('admin');

(function (parent) {
    var
        adminModel = kendo.observable({
        	blockheight:0,
        	blockloaded:0,
            getBlockHeight: function(){
        		adminModel.set("blockheight",app.getBlockHeight());
        	},
        	refresh: function(){
        		 var loaded = adminModel.blockloaded;
        		 
        		 var height = app.getBlockHeight();
        		 
        		 adminModel.set("blockheight",height);
        		 
        		 if(height > loaded){
        			 adminModel.load();
        		 } else{
        			 app.showNotification("Blocks are upto Date.")
        		 }
        		
        	},
        	load: function() {
                var pb = $("#loadingProgressBar").data("kendoProgressBar");
                pb.value(0);

                var interval = setInterval(function () {
                    if (pb.value() < 100) {
                        pb.value(pb.value() + 1);
                    } else {
                        clearInterval(interval);
                    }
                }, 30);
            }      
        });

    parent.set('adminModel', adminModel);

    parent.set('onShow', function (e) {
    	
    	var myWindow = $("#window");
    	 
    	 myWindow.kendoWindow({
             width: "715px",
             title: "Payload Details"
         });
    	 
    	myWindow.data("kendoWindow").close();
    	adminModel.getBlockHeight();
    	$(".reloadButton").hide();
    	 $("#loadingProgressBar").kendoProgressBar({
             orientation: "vertical",
             showStatus: false,
             animation: false,
             change: function(e){$(".loadingStatus").text(e.value + "%");},
             complete: function(){
            	 var loaded = adminModel.blockloaded;

            	 if(loaded != adminModel.blockheight){
            		 var result = app.getData("http://0.0.0.0:3000/api/fabric/1_0/channels/mychannel/blocks?blockId="+adminModel.blockloaded);
            		 
            		 if(result.status != 404){
	            		 var data = JSON.parse(result.responseText);
	            		 
	            		 var template=  kendo.template($("#blocktemplate").html());
	            		 
	            		 var colorArr = ["green","orange","violet","aqua","lime","red","teal","brown","purple"];
	            		 var randomIndex = Math.floor(Math.random() * colorArr.length); 
	            		 var randomElement = colorArr[randomIndex];
	            		 
	            		 var temp = {
	            				 json:data,
	            				 color:randomElement
	            		 };
	            		 
	            		 var resultHtml = template(temp);
	            		 
	            		 $("#listview").prepend(resultHtml);
	            		 $("#listview li").hide().fadeIn("slow");
	            		 
	            		 adminModel.set("blockloaded",loaded+1);
	            		 
	            		 if(data.data.data[0]){
	            			 $("#"+data.data.data[0].payload.header.channel_header.tx_id).bind("click",function(e){ 
	            				 var txid = e.target.id;
	            				 try{
		            				 var result = app.getTransaction(txid);
		            				 var data = JSON.parse(result.responseText);
		            				 var channelheader = data.transactionEnvelope.payload.header.channel_header;
		            				 var channelHeaderTemplate = kendo.template($("#channelHeaderTemplate").html());
		            				 var channelHtml = channelHeaderTemplate({data: channelheader});
		            				 
		            				 $("#channelHeader").html(channelHtml);
		            				 
		            				console.log(data.transactionEnvelope.payload);
		            				 
		            				 if(data.transactionEnvelope.payload.data){
		            					 var nsWrites = data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset;
		            					 var payloadTemplate = kendo.template($("#payloadTemplate").html());
			            				 var payloadHtml = payloadTemplate({data: nsWrites[0]});
			            				 
			            				 $("#payload").html(payloadHtml);
			            				 
			            				 $("#grid1").kendoGrid({
		            	                        height: 250
		            	                    });
		            				 }
		            				 
		            				 var dialog = $("#window").data("kendoWindow");
		            				 if(dialog){
		            					 $("#grid").kendoGrid({
		            	                        height: 250
		            	                    });
		            					 
		            					 dialog.open();
		            				 }
		            				 
	            				 }catch(e){
	            					 app.showNotification("The Block doesn't have proper details to show. If problem persist, contact system admin.")
	            				 }
	            			 });
	            				 
	            		 }
	            		 
	            		 if(loaded+1 != adminModel.blockheight){
	            			 adminModel.load();
	            			 
	            		 }else{
	            			 $("#listview").kendoMobileListView();
	                		 $(".reloadButton").show();
	                		 
	            		 }
            		 }
            	 }
             }
         });
        
    	 adminModel.load();
    });

    parent.set('afterShow', function (e) {
    	
    });
    
    function open(td){
    	alert(td);
    }
    
})(app.admin);
