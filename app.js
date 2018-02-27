/*

    Use https://codewise-fe-api.herokuapp.com/photos endpoint, to get list of objects that contain photos data, e.g.:

    {
        "width":5616,
        "height":3744,
        "author":"Alejandro Escamilla",
        "url":"https://unsplash.com/photos/N7XodRrbzS0/download"
    }

    This endpoint accepts two query parameters: 'offset' and 'limit'. If you use endpoint like this:
    https://codewise-fe-api.herokuapp.com/photos?offset=0&limit=5
    it will return first 5 records from the database,

    if you use it like this:
    https://codewise-fe-api.herokuapp.com/photos?offset=10&limit=5
    it will return records no. 10-14 end so on.

    If you don't pass any parameters, offset is set to 0 end limit is set to 50.
    
    To use lightweight placeholder images instead of real photos, set truthy value for 'placeholders' parameter, e.g.
    https://codewise-fe-api.herokuapp.com/photos?placeholders=1, or
    https://codewise-fe-api.herokuapp.com/photos?offset=10&limit=5&placeholders=1

    Good luck!

*/
'use strict';
(function($) {
    var $main;
    var $body;
    var apiUrl = 'https://codewise-fe-api.herokuapp.com/photos';
    var opt = {
        scrollStart: 0,
        refreshOffset: 600,
        apiOffsetStart: 0,
        apiOffsetLimit: 50,
        photoLimit: 10
    };
    var imageCollection = [];
    var currPointer = 0;

    var getApiUrl = function(offset, limit, placeholders) {
        var url = apiUrl + '?offset='+offset+'&limit='+limit;
        return placeholders ? url + '&placeholders=1' : url;
    };

    var injectPlaceholders = function (data) {
        data.forEach(function (imageData) {
            var img = $('<img src="'+imageData.url+'" alt="">');
            var imgWrap =  $('<div class="img-wrap"></div>');
            imgWrap.append(img);
            imageCollection.push(img);
            $main.append(imgWrap);
        });
    };

    var injectImages = function (data) {
        // console.log(data);
        //
        // for (var i=currPointer; i<opt.photoLimit; i++) {
        //     console.log(imageCollection[i]);
        //     $(imageCollection[i]).attr('src', data[i].src);
        // }
        // currPointer += opt.photoLimit;
        data.forEach(function (imageData) {
            var img = $('<div class="img-wrap">' +
                '<img src="'+imageData.url+'" alt="">' +
                '</div>');
            $main.append(img);
        });
    };

    var getPhotos = function() {
        var url = getApiUrl(opt.apiOffsetStart, opt.photoLimit);
        var urlPlaceholders = getApiUrl(opt.apiOffsetStart, opt.photoLimit, true);

        opt.apiOffsetStart += opt.photoLimit % opt.apiOffsetLimit;
        opt.apiOffsetStart %= opt.apiOffsetLimit;

        // http.get(urlPlaceholders, function (dataPlaceholders) {
        //     // console.log(dataPlaceholders);
        //     injectPlaceholders(dataPlaceholders);
        //
        //     http.get(url, function (data) {
        //         injectImages(data);
        //     }, 'json');
        // });
        http.get(url, function (data) {
            injectImages(data);
        }, 'json');
    };

    var onLoad = function() {
        $main = $('.main');
        setEvents();
        getPhotos();
    };

    var onScroll = function() {
        var scrollTop = $(window).scrollTop();
        if ((opt.scrollStart + opt.refreshOffset) - scrollTop < 0) {
            opt.scrollStart = scrollTop;
            getPhotos();
        }
    };

    var setEvents = function () {
        $(window).on('scroll', onScroll);
    };

    $(document).ready(onLoad);
})(jQuery);
