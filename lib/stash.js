/*global require, exports */
"use strict";
var _ = require("lodash"),
    url = require("url"),
    request = require("request"),
    API_BASE = "/rest/api/1.0/";

var StashApi = exports.StashApi = function(protocol, hostname, port, user, password) {
    this.protocol = protocol || "http";
    this.hostname = hostname;
    this.port     = port;
    this.user     = user;
    this.password = password;

};

(function(){

    var _depaginate = function(options, callback, errback, values) {

    };

    this.request = function(options, callback, errback) {
        if(!_.isObject(options)) {
            options = {};
        }
        if(!_.isFunction(errback)) {
            errback = function(error) {
                callback(null, error);
            };
        }

        options.uri = decodeURIComponent(url.format({
            protocol: this.protocol,
            hostname: this.hostname,
            port: this.port,
            pathname: API_BASE + options.endpoint
        }));
        options.json = true;
        options.auth = {
            user: this.user,
            pass: this.password
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

    this.projects = function (callback, errback) {
        var options = {
            method: "GET",
            endpoint: "projects"
        };
        this.request(options, callback, errback);
    };

}).call(StashApi.prototype);