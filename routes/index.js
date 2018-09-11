var express = require('express');
var router = express.Router();
var imdb = require('imdb-api');
var YouTube = require('simple-youtube-api');

var render_page = function (res, query, omdb_data = [], youtube_data = []) {
    res.render('pages/index', {query: query, omdb_data: omdb_data, youtube_data: youtube_data});
}

/* GET home page. */
router.get('/', function (req, res, next) {
    var query = req.query.query;
    var omdb_key = "91f34a38"
    var youtube_key = "AIzaSyDWsdThdgbK6twD2jhuYS2mKMknXzHnWcI"
    var youtube = new YouTube(youtube_key);

    if (query == undefined || query == '') {
        render_page(res, "Hello World")
        return;
    }
    if (query.startsWith("tt")) {
        console.log("IMDB id found as query")
        imdb.get({id: query}, {apiKey: omdb_key}).then(movie_details => {
            youtube.searchVideos(movie_details['title'] + " " + movie_details['year'], 10)
                .then(youtube_data => {
                    render_page(res, query, [movie_details], youtube_data);
                })
                .catch(err => {
                    console.log("Error while searching results for ", query)
                    console.log(err)
                    render_page(res, query)
                });
        }).catch(err => {
            console.log("Error while searching results for ", query)
            console.log(err)
            render_page(res, query)
        });

    } else if (query != undefined && query != '') {
        console.log("Searching for ", query)
        imdb.search({name: query}, {apiKey: omdb_key, timeout: 30000}).then(search_results => {
            if (!'results' in search_results) {
                console.log("Error fetching movie details")
                render_page(res, query)
            }
            console.log("Found results:", search_results.length)
            var search_results = search_results.results
            var found = false
            var matched = []
            for (res_id in search_results) {
                if (search_results[res_id].title.toLowerCase() == query.toLowerCase().replace("+", " ")) {
                    matched.push(search_results[res_id])
                    found = true
                }
            }
            if (search_results.length == 1) {
                matched = search_results
            }
            console.log("Matched Results:", matched.length)
            if (!found) {
                render_page(res, query, search_results);
            } else {
                if (matched.length == 1) {
                    imdb.get({id: matched[0]['imdbid']}, {apiKey: omdb_key}).then(movie_details => {
                        youtube.searchVideos(matched[0]['title'] + " " + movie_details['year'], 10)
                            .then(youtube_data => {
                                render_page(res, query, [movie_details], youtube_data);
                            })
                            .catch(err => {
                                console.log("Error while searching results for ", query)
                                console.log(err)
                                render_page(res, query)
                            });
                    }).catch(err => {
                        console.log("Error while searching results for ", query)
                        console.log(err)
                        render_page(res, query)
                    });
                } else {
                    render_page(res, query, matched);
                }
            }
            omdb_data = search_results
        }).catch(err => {
            console.log("Error while searching results for ", query)
            console.log(err)
            render_page(res, query)
        });
    } else {
        render_page(res, query)
    }


});

module.exports = router;
