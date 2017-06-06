/*jslint browser: true*/
/*global $, jQuery, alert, config, urlParam*/

var twitchChannelName = null;
var twitchChannel = null;
var twitchStream = null;

$(document).ready(function () {
    "use strict";

    /** Met &agrave; jour les informations sur la cha&icirc;ne twitch **/
    $.setChannelInfo = function () {
        $("#twitchChannelName").html(twitchChannelName);
        $("#twitchChannelName").attr("href",
            config.twitch.url.channel.replace("<channelName>", twitchChannelName));
        $("#twitchChannelName").attr("title",
            config.twitch.url.channelLinkTitle.replace("<channelName>", twitchChannelName));
        $("#twitchChannel").attr("src",
            config.twitch.url.source.replace("<channelName>", twitchChannelName));
        $("#twitchChat").attr("src",
            config.twitch.url.chat.replace("<channelName>", twitchChannelName));
    };

    /** Met &agrave; jour les informations sur le stream live. **/
    $.setStreamInfo = function () {
        $("#twitchStatus").html(config.twitch.liveStatus.replace("<game>", twitchChannel.game));
        $("#twitchTitle").html(twitchChannel.status);
    };

    /** Charge les informations de la cha&icirc;ne et du stream depuis twitch **/
    $.loadStream = function () {
        $.when($.getJSON(config.twitch.apiUrl.streams.replace("<channelName>", twitchChannelName) + "?client_id=" + config.twitch.applicationClientId)).then(function (json) {
            $.setChannelInfo();
            twitchStream = json.stream;
            if (null === twitchStream) {
                $("#twitchStatus").html("Offline");
            } else {
                twitchChannel = json.stream.channel;
                $.setStreamInfo();
            }
        });
    };

    /** Charge les 6 derni&egrave;res vid&eacute;os de la cha&icirc;ne twitch **/
    $.loadVideos = function () {
        $.when($.getJSON(config.twitch.apiUrl.channels.replace("<channelName>", twitchChannelName) + "/videos?broadcast_type=archive&limit=" + config.twitch.limit + "&client_id=" + config.twitch.applicationClientId)).then(function (json) {
            var videos = json.videos,
                twitchVideo = null;
            $.each(videos, function (index, video) {
                twitchVideo = $("#video-hidden-template").clone();
                twitchVideo.attr("id", "video_" + video.broadcast_id);
                twitchVideo.attr("href", video.url);
                twitchVideo.find(".video_title").html($.reduceTitleTextSize(video.title));
                twitchVideo.find(".video_game").html(video.game);
                twitchVideo.find(".stream_date").html($.convertDateToFrench(video.recorded_at));
                twitchVideo.find(".video_thumbnail").attr("src", video.preview);
                $("#twitchVideos").append(twitchVideo);
            });
            $("#video-hidden-template").hide();
        });
    };

    /** Permet l'ajout d'une cha&icirc;ne twitch **/
    $.addTwitchStream = function () {
        $("#content").load("./components/stream.html", function () {
            $.when($.getUrlParam()).then(function () {
                if (undefined !== urlParam.stream) {
                    twitchChannelName = urlParam.stream;
                    $('title').html(config.twitch.pageTitle.replace("<channelName>", twitchChannelName));
                    $.loadVideos();
                    $.loadStream();
                }
            });
        });
    };
});
