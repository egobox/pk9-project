(function($) {
    var service = {};

    service.init = function (url) {
        var userData = getInitUserData();

        // Request to server to get init state params
        if (userData === null) {
            var keys;

            //TODO: Uncomment, set url and use for init
            /*url = 'hardcodedvalue';
             userData = service.post(url);
             userData = JSON.parse(config)*/

            // TODO: Remove when backend API finished
            userData = {
                "profileID": "12323435325",
                "hash": "{'state':'appleliker', 'money': '1378' }",
                "location": ""
            };

            service.utils.bulkUpdate(userData);
        }

        console.log('Page Observe is Up and Running');

        // Update local storage

        // Check local storage for user
        function getInitUserData() {
            var requieredKeys = ['profileId', 'hash'],
                result = {};

            for (var key of requieredKeys) {
                var value = localStorage.getItem(key);

                if (value === null) {
                    result = null;
                    break;
                }
                result[key] = value;
            }

            return result;
        }
    };

    service.handlers = {

    };

    service.listeners = {

    };

    service.emitter = {
        event: function (name, target, details) {
            var e = new CustomEvent(name, details);
            console.log('{EventEmitter}: Event:', name);
            target.dispatchEvent(e);
        }
    };

    service.utils = {
        update: function (key, value, option) {
            var ls = localStorage,
                option = option || false;

            if (ls.getItem(key) !== value) {
                ls.setItem(key, value);

                if (option) {
                    return service.emitter.event('Update', document);
                }
                return true;
            }
            return false;
        },
        bulkUpdate: function (object) {
            var keys = Object.keys(object),
                res = false;

            res = keys.some(function (key) {
                return service.utils.update(key, object[key])
            });

            if (res) {
                service.emitter.event('Update', document);
            }
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