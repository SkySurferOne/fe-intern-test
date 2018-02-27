'use strict';
var http = (function ($) {

    var get = function(url, callback, dataType, onError) {
        dataType = dataType || 'json';

        $.ajax({
            type: 'GET',
            url: url,
            success: callback,
            dataType: dataType,
            error: function (jqXHR, textStatus, errorThrown) {
                onError();
            }
        });
    };

    return {
        get: get
    }

})(jQuery);
