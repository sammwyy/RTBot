const TwitterPackage = require('twitter');
const Config = require("./config");

const client = new TwitterPackage(Config.auth);

client.stream('statuses/filter', { track: Config.track_query }, function(stream) {
    stream.on('data', function(tweet) {
        if (tweet.user.screen_name == Config.bot_username.toLowerCase()) {
            return;
        }

        if (Config.retweet)
            RT(tweet);

        if (Config.fav)
            FAV(tweet);
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

function RT (tweet) {
    client.post('statuses/retweet/' + tweet.id_str, function(error) {
        if (!error) {
            console.log("Retweeting: " + tweet.text + "\n");
        } else {
            console.log(error);
        }
    });
}

function FAV (tweet) {
    client.post('favorites/create.json', {"id": tweet.id_str}, function(error) {
        if (!error) {
            console.log("Fav: " + tweet.text + "\n");
        } else {
            console.log(error);
        }
    });
}