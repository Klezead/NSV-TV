/*jslint browser: true*/
/*global $, jQuery, alert, config*/

$(document).ready(function () {
    "use strict";

    $.createStreamersPresentation = function () {
        $.each(config.streamers, function (index, streamer) {
            $.when($.getJSON(config.twitch.apiUrl.channels.replace("<channelName>", streamer.twitch.channelName) + "?client_id=" + config.twitch.applicationClientId)).then(function (channelJSON) {

                var presentation = $("#presentation-template").clone();
                presentation.attr("id", "presentation" + streamer.twitch.channelName);
                if (null !== channelJSON.logo) {
                    presentation.find(".presentationImg").attr("src", channelJSON.logo);
                } else {
                    presentation.find(".presentationImg").attr("src", config.twitch.nsvDefaultProfilImg);
                }
                presentation.find(".presentationStreamerName").html(streamer.twitch.channelName);
                presentation.find(".presentationText").html(streamer.presentation);
                $("#presentationDiv").append(presentation);
            });
        });
    };
});
