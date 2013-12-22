atlas-stash
===========

REST Client for Atlassian's Stash

This is still in progress and so the API should be considered unstabled, but
it's in a good enough shape to start playing with.

Example
-------

    var StashApi = require("atlas-stash").StashApi;
    
    var user = "username",
        password = "password",
        stash = new StashApi("https", "stash.vodori.com", null, user, password);
    
    var projects = stash.projects();
    projects.on("error", function (error){
        console.error(error);
    }).on("allPages", function(allPages) {
        console.log("All Pages", allPages);
    });
    
    stash.repos("PEPPER").on("allPages", function(repos) {
        console.log("Repos: ", repos);
    });