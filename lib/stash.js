/*global require, exports */
"use strict";
var _ = require("lodash"),
    url = require("url"),
    request = require("request"),
    PagedRequest = require("./paged-request").PagedRequest,
    API_BASE = "/rest/api/1.0/";

var StashApi = exports.StashApi = function(protocol, hostname, port, user, password) {
    this.protocol = protocol || "http";
    this.hostname = hostname;
    this.port     = port;
    this.user     = user;
    this.password = password;

};

(function(){
    
    var _connectionDetails = function (obj) {
        return {
            protocol: obj.protocol,
            hostname: obj.hostname,
            port:     obj.port,
            user:     obj.user,
            password: obj.password
        };
    }

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

    this.projects = function () {
        var pReq = new PagedRequest(_connectionDetails(this));
        _.defer(_.bind(pReq.remaining, pReq));
        return pReq.start("GET", "projects");
    };
    
    this.repos = function (projectKey) {
        var pReq = new PagedRequest(_connectionDetails(this));
        _.defer(_.bind(pReq.remaining, pReq));
        return pReq.start("GET", "projects/"+projectKey+"/repos")
    }

}).call(StashApi.prototype);