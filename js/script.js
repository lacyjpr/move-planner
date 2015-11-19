
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NYT AJAX request

    var nytimesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=d1512e2b21713ead29a75ea7c3196698:7:73525042'
    $.getJSON(nytimesURL, function (data) {
            console.log(data);
            $nytHeaderElem.text('New York Times Articles About ' + city);

            articles = data.response.docs;
            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];
                $nytElem.append('<li class="article">'+
                    '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                    '<p>' + article.snippet + '</p>'+
                '</li>');
            };

        }).fail(function(e) {
            $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
        });

    // Wikipedia AJAX request

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '")>' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });
        
    
    return false;
};

$('#form-container').submit(loadData);
