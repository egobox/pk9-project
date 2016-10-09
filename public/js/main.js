(function($){
    $('#big-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false
    });

    $('#carousel-slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false
    });

    $('#carousel-slider-vertical').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        vertical: true,
        verticalSwiping: true
    });



})(jQuery);


"use strict";
(function($) {
    var service = {},
        eventList = {
            "ItemAction" : {
                // HTML Example
                // <div data-plugin='item-click'></div>
                prefix: 'item',
                events: [
                    'show',
                    'click',
                    'view',
                    'addToCart',
                    'removeFromCart',
                    'buy',
                    'like',
                    'comment',
                    'rate',
                    'share',
                    'return',
                    'refund',
                    'dislike'
                ]
            }
        },
        widgetConfig = null;

    // PRIVATE FUNCTIONS
    // Check local storage for user
    function _getInitUserData() {
        var requiredKeys = ['profileId', 'hash'],
            result = {};

        for (var key of requiredKeys) {
            var value = localStorage.getItem(key);

            if (value === null) {
                result = null;
                break;
            }
            result[key] = value;
        }

        return result;
    }

    // Check if click was made on plugin observed object
    function _isTargetPluginObject(e) {
        if (e.target.getAttribute('data-plugin')) {
            return true;
        }
    }

    // Get event type of click on plugin observed object
    function _getEventType(target) {
        var keys = Object.keys(eventList),
            prop = target.getAttribute('data-plugin').split('-'),
            eventType = null;

        for (key of keys) {
            if (eventList[key]['prefix'] === prop[0]) {
                var events = eventList[key]['events'];
                for (evt of events) {
                    if (evt === prop[1]) {
                        eventType = key + ' ' + evt;
                        break;
                    }
                }
                if (eventType) { break; }
            }
        }
        return eventType;
    }

    // PUBLIC
    service.init = function (url) {
        var userData = _getInitUserData(),
            widgetList;

        // Request to server to get init state params
        if (userData === null) {
            userData = service.handlers.getUserData();
            service.utils.bulkUpdateStorage(userData);
        }

        // Get widgets
        widgetList = $('[data-id]');
        if (widgetList.length === 0) {
            console.log('Could not obtain array of widgets');
        }

        if (widgetList.length > 0) {
            // Get widget config
            widgetConfig = $.getJSON('../json/config/widget.json');
            // Render widgets
            service.render.addWidgets(widgetList);
        }

        // Init event listeners
        service.listeners.add(document.body, 'click', service.listeners.process);

        console.log('{Core}: Page Observer is up and running');
    };

    service.render = {
        addWidget: function (widget, data, cb) {
            console.log('{Render} ' + widget.attr('data-id') + ' (Add Widget)');
            var el = document.createElement('div'),
                h1 = document.createElement('h1');

            $(h1).text(data.widgetId);
            el.setAttribute('id', data.widgetId);
            widget.append(h1).append(el);

            cb($(el));
        },
        addWidgets: function (widgetList) {
            widgetList.each(function () {
                //verticalFlat, bigFlat, multiFlat, flat - slick
                //popup
                var widget = $(this);

                console.log(widget);

                //TODO: Uncomment, set url and use for init
                /*
                 var url = '';
                 widgetData = service.utils.post(url, widget.id);
                 */

                $.getJSON('../json/' + widget.attr('data-id') + '.json', function(data) {
                    if (data.hasOwnProperty('type')) {
                        service.render.addWidget(widget, data, function(el) {
                            el.slick(widgetConfig[data.type]);
                        });
                    }
                });
            });
        }
    };

    service.handlers = {
        getUserData: function() {
            var userData;
            //TODO: Uncomment, set url and use for init
            /*
             var url = '';
             userData = service.utils.post(url);
             */

            // TODO: TEMP! Remove when backend API finished
            userData = {
                "profileID": "12323435325",
                "hash": "{'state':'appleliker', 'money': '1378' }",
                "location": ""
            };

            return userData
        }
    };

    service.listeners = {
        add: function(target, event, cb) {
            target.addEventListener(event, cb);
        },
        process: function (e) {
            // Check if event occurred on plugin element
            if (!_isTargetPluginObject(e)) {
                return false;
            }

            var event = _getEventType(e.target);

            service.utils.post('http://front-controller:3000/update', {
                event: event,
                localStorage: '',
                clientData: ''
            });
        }
    };

    service.emitter = {
        event: function (name, target, details) {
            var e = new CustomEvent(name, details);
            target.dispatchEvent(e);
            console.log('{EventEmitter}: Event:', name);
        },
        updateEvent: function(target, details) {
            var target = target || document;
            service.emitter.event('Update', target, details);
        }
    };

    service.utils = {
        updateStorage: function (key, value, option) {
            var ls = localStorage,
                option = option || false;

            if (ls.getItem(key) !== value) {
                ls.setItem(key, value);

                console.log('{Update}: Updating:', key, value);

                if (option) {
                    return service.emitter.updateEvent();
                }
                return true;
            }
        },
        bulkUpdateStorage: function (object) {
            var keys = Object.keys(object),
                res = false,
                arr = [];

            keys.forEach(function (key) {
                arr.push(service.utils.updateStorage(key, object[key]));
            });

            res = arr.some(function(r) { return r });

            if (res) {
                service.emitter.updateEvent();
            }
        },
        getStorage: function() {
            var ls = localStorage;
            //    bla bla bla
        },
        post: function(url, data) {
            return $.post(url, data);
        },
        get: function(url, data) {
            return $.get(url, data);
        }
    };

    return service.init();
})(jQuery);