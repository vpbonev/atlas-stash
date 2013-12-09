/*global require, exports */
"use strict";
var _ = require("lodash"),
    url = require("url"),
    request = require("request"),
    API_BASE = "/rest/api/1.0/";

var PagedRequest = exports.PagedRequest = function(connectionDetails, limit) {
    this.connectionDetails = connectionDetails;
    this.cursor = 0;
    this.limit = limit || 10;
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
            port:     this.connectionDetails.port,
            pathname: API_BASE + options.endpoint
        }));
        options.uri += "?limit="+this.limit+"&start="+this.cursor;
        options.json = true;
        options.auth = {
            user: this.connectionDetails.user,
            pass: this.connectionDetails.password
        };

        console.log(options);

        request(options, _.bind(function(error, response, body) {
            if(error) {
                errback(error);
                return;
            }
            this.atLastPage  = body.isLastPage;
            this.cursor     += body.nextPageStart || 0;

            callback(body.values);
        }, this));
    };

    this.start = function(method, endpoint, callback, errback) {
        this.reset();
        this.method     = method;
        this.endpoint   = endpoint;
        this.callback   = callback;
        this.errback    = errback;

        return this;
    };


    this.setIndex = function(newIndex){
        this.cursor = newIndex;
    };

    this.setLimit = function(newLimit) {
        this.limit = newLimit;
    };

    this.hasNext = function() {
        return !this.atLastPage;
    };

    this.next = function(){
        if(this.atLastPage) {
            this.callback([]);
        }
        else {
            _request.call(this, {
                method: this.method,
                endpoint: this.endpoint
            }, this.callback, this.errback);
        }
    };

    this.all = function() {
        this.reset();
        this.remaining();
    };

    var _buildValues = function(values) {
        if(this.hasNext()) {
            _request({
                method: this.method,
                endpoint: this.endpoint
            }, function(newValues) {
                _buildValues.call(this, values.concat(newValues));
            }, this.errback);
        }
        else {
            this.callback(values);
        }
    };

    this.remaining = function() {
        _buildValues.call(this, []);
    };

    this.reset = function(){
        this.setIndex(0);
        this.atLastPage = false;
        return this;
    };

}).call(PagedRequest.prototype);