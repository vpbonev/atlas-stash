/*global require, exports */
"use strict";
var _ = require("lodash"),
    url = require("url"),
    request = require("request");

var StashApi = exports.StashApi = function() {

};

(function(){
    this.request = function(options, callback, errback) {
        if(!_.isObject(options)) {
            options = {};
        }
        if(!_.isFunction(errback)) {
            errback = function(error) {
                callback(null, error);
            };
        }
        request(options, function(error, response, body) {
            if(error) {
                errback(error);
                return;
            }

            callback(JSON.parse(body));
        });
    };

}).call(StashApi.prototype);