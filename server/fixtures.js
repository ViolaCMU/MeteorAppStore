
if(Apps.find({}).count() < 1){

    var fs = Npm.require('fs');

    fs.readFile('../../../../../server/data.json', 'utf8', Meteor.bindEnvironment(function(err, data) {
        if (err) throw err;
        var newAppData = data.split("\n");

        for (var i = 0; i < newAppData.length - 1; i++) {
            var rawAppData = JSON.parse(newAppData[i]);
            var newApp = {};

            newApp.name = rawAppData.title;
            newApp.app_id = rawAppData.app_id;
            newApp.developer = rawAppData.developer;
            newApp.description = rawAppData.intro;
            newApp.avgRating = parseInt(rawAppData.score) / 2;
            newApp.iconUrl = rawAppData.thumbnail_url;
            newApp.reccomendedApps = rawAppData.top_5_app;
            newApp.numberOfRecommendations = 0;

            Apps.insert(newApp);
        }

        var appArray = Apps.find({}).fetch();
        for (var i = 0; i < appArray.length - 1; i++) {
            if(appArray[i].reccomendedApps != null){
                for(var j = 0; j < appArray[i].reccomendedApps.length; j++){

                    Apps.update({app_id:appArray[i].reccomendedApps[j]},{$set:{numberOfRecommendations : Apps.findOne({app_id:appArray[i].reccomendedApps[j]}).numberOfRecommendations + 1}});

                }
            }
        }
    }, function(err){
        throw err;
    }));
}
