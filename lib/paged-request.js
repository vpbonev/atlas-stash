/*global require, exports */
"use strict";
var _ = require("lodash"),
    url = require("url"),
    request = require("request"),
    API_BASE = "/rest/api/1.0/";

var PagedRequest = exports.PagedRequest = function(connectionDetails, size) {
    this.connectionDetails = connectionDetails;
    this.index = 0;
    this.size  = size || 10;
    this.callback = null;
    this.errback  = _.bind(this.callback, this, null);
};

(function(){

    var _request = function(options, callback, errback) {
        if(!_.isObject(options)) {
            options = {};
        }
        if(!_.isFunction(errback)) {
            errback = function(error) {
                callback(null, error);
            };
        }

        options.uri = decodeURIComponent(url.format({
            protocol: this.connectionDetails.protocol,
            hostname: this.connectionDetails.hostname,
            port: this.connectionDetails.port,
            pathname: this.connectionDetails.API_BASE + options.endpoint
        }));
        options.json = true;
        options.auth = {
            user: this.connectionDetails.user,
            pass: this.connectionDetails.password
        };
        console.log(options);

        request(options, function(error, response, body) {
            if(error) {
                errback(error);
                return;
            }

            callback(body);
        });
    };

    this.request = function(method, uri, callback, errback) {

    };


    this.setIndex = function(newIndex){
        this.index = newIndex;
    };

    this.next = function(){};

    this.reset = function(){};

}).call(PagedRequest.prototype);