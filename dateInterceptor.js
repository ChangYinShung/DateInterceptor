(function (app) {
    app.factory('dateInterceptor', function () {
            var regexIsoUtc = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

            function matchDate(dateString) {
                return dateString.match(regexIsoUtc);
            };

            function convertDateStringsToDates(object) {
                // ensure that we're processing an object
                if (typeof object !== "object") {
                    return object;
                }

                for (var key in object) {
                    if (!object.hasOwnProperty(key)) {
                        continue;
                    }
                    var value = object[key];

                    // check for string properties with a date format
                    if (typeof value === "string" && matchDate(value)) {
                        var date = new Date(value); // create the date from the date string
                        object[key] = date; // we're mutating the response directly
                    } else if (typeof value === "object") {
                        convertDateStringsToDates(value); // recurse into object
                    }
                }
                return null;
            }

            var interceptor = {
                'response': function (response) {
                    if (response.data) {
                        convertDateStringsToDates(response.data);
                    }
                    return response;
                }
            };
            return interceptor;
        })
    app.config(HttpConfig);
    HttpConfig.$inject = ['$httpProvider'];
    function HttpConfig($httpProvider) {
        $httpProvider.interceptors.push('dateInterceptor'); // intercept responses and convert date strings into real dates
    }
})(angular.module('YC.Common'));