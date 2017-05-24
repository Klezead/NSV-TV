/*jslint browser: true*/
/*global $, jQuery, alert, config*/

$(document).ready(function () {
    "use strict";

    $.createStreamersIcon = function () {
        $.each(config.streamers, function (index, streamer) {
            $.when($.getJSON(config.twitch.apiUrl.streams.replace("<channelName>", streamer.twitch.channelName) + "?client_id=" + config.twitch.applicationClientId)).then(function (streamJSON) {

                var streamerLink = $("#streamer-link-template").clone();
                streamerLink.find(".streamerLinkDiv").attr("href", config.twitch.url.nsvChannel.replace("<channelName>", streamer.twitch.channelName));
                streamerLink.attr("id", "streamerLink" + streamer.twitch.channelName);
                streamerLink.find(".streamerChannelName").html(streamer.twitch.channelName);
                if (null === streamJSON.stream) {
                    $.when($.getJSON(config.twitch.apiUrl.channels.replace("<channelName>", streamer.twitch.channelName) + "?client_id=" + config.twitch.applicationClientId)).then(function (channelJSON) {
                        if (null !== channelJSON.logo) {
                            streamerLink.find(".streamerLinkImg").attr("src", channelJSON.logo);
                        } else {
                            streamerLink.find(".streamerLinkImg").attr("src", config.twitch.nsvDefaultProfilImg);
                        }
                        $("#streamersLink").append(streamerLink);
                    });
                } else {
                    streamerLink.attr("id", "streamerLink" + streamer.twitch.channelName);
                    if (undefined !== streamJSON.stream.channel.logo) {
                        streamerLink.find(".streamerLinkImg").attr("src", streamJSON.stream.channel.logo);
                    } else {
                        streamerLink.find(".streamerLinkImg").attr("src", config.twitch.nsvDefaultProfilImg);
                    }
                    streamerLink.find(".streamerOffline").addClass("streamerLive");
                    streamerLink.find(".streamerOffline").removeClass("streamerOffline");
                    streamerLink.find(".streamerLive").html(config.twitch.live);
                    $("#streamersLink").append(streamerLink);
                }
            });
        });
    };
});
