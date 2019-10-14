'use strict';

(function() {
    var app = {
        data: {},
        user:{},
        networkId:"0.0.0.0:3000/api/fabric/1_0",
        channelname:"mychannel",
        chaincodeId:"fabcar",
	data:"data",
        localization: {
            defaultCulture: 'en',
            cultures: [{
                name: "English",
                code: "en"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        },
        showMore: {
            viewModel: kendo.observable()
        }
    };
    
    var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'nova',
                initial: 'components/home/view.html'
            });

            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function() {

        var navigationShowMoreView = $('#navigation-show-more-view').find('ul'),
            allItems = $('#navigation-container-more').find('a'),
            navigationShowMoreContent = '';

        allItems.each(function(index) {
            navigationShowMoreContent += '<li>' + allItems[index].outerHTML + '</li>';
        });

        navigationShowMoreView.html(navigationShowMoreContent);
        kendo.bind($('#navigation-show-more-view'), app.showMore.viewModel);

        app.notification = $("#notify");

        $.getJSON('components/home/user.json',function(data){
            app["user"] = data;
         });

    });

    app.listViewClick = function _listViewClick(item) {
        var tabstrip = app.mobileApp.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        tabstrip.clear();
    };

    app.showNotification = function (message, time) {
        var autoHideAfter = time ? time : 2000;
        swal({
            title: "Message!",
            text: message,
            timer: autoHideAfter,
            showConfirmButton: false
        }).catch(swal.noop);
    };

    
    app.getBlockHeight = function(){
		var result = app.getData("http://0.0.0.0:3000/api/fabric/1_0/channels/mychannel");
		var data = JSON.parse(result.responseText);
		return data.queryInfo.height.low;
	}
    
    app.queryApi = function (methodname, args) {
        var url = app.createPeer("/channels/"+app.channelname+"/ledger","chaincodeId="+app.chaincodeId);
        var data = {
        		  "args": args,
        		         "fcn": methodname
        		       };
    
        return this.postData(url, data);
    }


    app.invokeApi = function (methodname, args) {
        var url = "http://0.0.0.0:3000/api/fabric/1_0/channels/"+app.channelname+"/transactions";
        var data = {
    		"proposal": {
	            "chaincodeId": app.chaincodeId,
	            "fcn": methodname,
	            "args": args
	         }
        };

        console.log(JSON.stringify(data));

        return this.postData(url, data); 
    }

    app.getChain = function () {
        var blockheight = app.getBlockHeight()-1;
        var result = app.getData("http://0.0.0.0:3000/api/fabric/1_0/channels/mychannel/blocks?blockId="+blockheight);
		var data = JSON.parse(result.responseText);
        
		var block = {
				currentBlockHash:data.header.data_hash,
				height:blockheight
		}
		
		return block;
    }
    
    app.getTransaction = function (transactionid){
    	var url ="http://0.0.0.0:3000/api/fabric/1_0/channels/"+app.channelname+"/transactions/"+transactionid+"?access_token=cd96d5260ad4757551ed4a5a991e62130f8008a0bf996e4e4b84cd097a747fec_sk";
    	
    	return app.getData(url);
    	
    }

    app.getBlock = function (block) {
        var url = "http://0.0.0.0:3000/api/fabric/1_0/channels/mychannel/blocks?blockId=" + block;
        var result = {};
        $.ajax({
            async: false,
            timeout: 15000,
            type: "GET",
            url: url,
            success: function (json) {
                result = json
            },
            error: function (e) {
                console.log('Error - failed to get chain data');
            }
        });
        return result;
    }

    app.postData = function (url, data) {
        var result = {};
        $.ajax({
            async: false,
            type: "POST",
            url: url,
            data: data,
            dataType: "application/json",
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    }

    app.getData = function (url) {
        var result = {};
        $.ajax({
            async: false,
            type: "GET",
            url: url,
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    }
    
    app.createPeer = function (api,querystring) {
        return "http://" + app.networkId + (api != null ? api : "") +"?access_token=cd96d5260ad4757551ed4a5a991e62130f8008a0bf996e4e4b84cd097a747fec_sk" +(querystring != null ? "&"+querystring :"");
    }

    app.login = function (userName, peer, data, chaincodeid, securecontext) {
        if (localStorage) {
            localStorage.setItem("peer", peer);
            localStorage.setItem("userName", userName);
            localStorage.setItem("chaincodeid", chaincodeid);
            localStorage.setItem('displayname', data);
            localStorage.setItem('securecontext', securecontext);
            app.mobileApp.navigate("components/" + peer + "Home/view.html?name="+data);
        }
    };

    app.checkuser = function () {
        if (localStorage) {
            var peer = localStorage.getItem("peer")
            if (peer != null) {
                if (localStorage.getItem("peer") && localStorage.getItem("userName")) {
                    app.mobileApp.navigate("components/" + peer + "Home/view.html");
                } 
            } else {
                app.logout();
            }
        }
    };

    app.logout = function () {
        if (localStorage) {
            localStorage.clear();
            app.mobileApp.navigate("components/home/view.html?value=logout");
        }
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    

    app.getGeoLocation = function () {
        navigator.geolocation.getCurrentPosition(
            function (position) {
               /* alert('Latitude: ' + position.coords.latitude + '\n' +
                      'Longitude: ' + position.coords.longitude + '\n' +
                      'Altitude: ' + position.coords.altitude + '\n' +
                      'Accuracy: ' + position.coords.accuracy + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                      'Heading: ' + position.coords.heading + '\n' +
                      'Speed: ' + position.coords.speed + '\n' +
                      'Timestamp: ' + position.timestamp + '\n');*/
            },
            function (error) {
                alert('code: ' + error.code + '\n' +
                      'message: ' + error.message + '\n');
            });
    };


    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };




    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
}());

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
            cultures: app.localization.cultures,
            defaultCulture: app.localization.defaultCulture,
            currentCulture: '',
            strings: {},
            viewsNames: [],
            registerView: function (viewName) {
                app[viewName].set('strings', getStrings() || {});

                this.viewsNames.push(viewName);
            }
        }),
        i, culture, cultures = localization.cultures,
        getStrings = function() {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function() {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
                app.showMore.viewModel.set('strings', strings);
            }
        },
        loadCulture = function(code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);
