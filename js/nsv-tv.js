/*jslint browser: true*/
/*global $, jQuery, alert*/

var urlParam = {};
var config = null;

$(document).ready(function () {
    "use strict";

    /** R&eacute;cup&eacute;ration des &eacute;l&eacute;ments de configurations pr&eacute;sent dans le fichier de configuration JSON **/
    config = $.getJSON({
        'url': "./js/config.json",
        'async': false
    });
    config = JSON.parse(config.responseText);

    /** Permet de r&eacute;duire la taille des titres des vid&eacute;os et stream **/
    $.reduceTitleTextSize = function (textToReduce) {
        if (config.video.titleMaxLength < textToReduce.length) {
            return textToReduce.trim().split(' ', config.video.titleNumWords).join(' ') + "...";
        } else {
            return textToReduce;
        }
    };

    /** 2017-05-08T14:07:39Z to 08/05/2017 à 14h07 **/
    $.convertDateToFrench = function (twitchDate) {
        var dateHeure = twitchDate.split('T'),
            date = dateHeure[0].split('-'),
            heure = dateHeure[1].split(':'),
            frenchDate = date[2] + "/" + date[1] + "/" + date[0],
            frenchHour = heure[0] + "h" + heure[1];
        return frenchDate + " &agrave; " + frenchHour;
    };

    /** Charge une image de fond de mani&egrave;re al&eacute;atoire **/
    $.setRandomBackground = function () {
        var backgroundNumber = Math.floor((Math.random() * 10) + 1);
        $(".background").css("background-image", "url(../img/" + backgroundNumber + ".jpg)");
    };

    /** Permet de r&eacute;cup&eacute;rer les param&egrave;tres pass&eacute;s dans l'URL de la page */
    $.getUrlParam = function () {
        $.each(document.location.search.substr(1).split('&'), function (index, paramElement) {
            var param = paramElement.split('=');
            urlParam[param[0].toString()] = param[1].toString();
        });
    };

    /** Cr&eacute;ation d'un menu vers une cha&icirc;ne Twitch **/
    $.createTwitchMenuLink = function (twitchChannelName) {
        var menuLink = $("#menu-link-hidden-template").clone();
        menuLink.attr("id", "menuLink" + twitchChannelName);
        menuLink.find(".menu-link").attr("href", config.twitch.url.nsvChannel.replace("<channelName>", twitchChannelName));
        menuLink.find(".menu-link").html(twitchChannelName);
        $(".dropdown-menu").append(menuLink);
    };

    /** Cr&eacute;ation des menus twitch en parcourant les streamers depuis le fichier de configuration **/
    $.createStreamersMenuLink = function () {
        $.each(config.streamers, function (index, streamer) {
            if (undefined !== streamer.twitch) {
                $.createTwitchMenuLink(streamer.twitch.channelName);
            }
        });
    };

    /** Configure les boutons de réseaux sociaux avec les URLs issues du fichier de configuration **/
    $.createSocialsMediaLink = function () {
        $("#facebookLink").attr("href", config.social.facebook.url);
        $("#twitterLink").attr("href", config.social.twitter.url);
    };

    /** Permet de d&eacute;sactiver les menus pr&eacute;c&eacute;demment actifs **/
    $.unactiveAllNsvNavbar = function () {
        $(".nsv-navbar").removeClass("active");
    };

    /** Active le bon menu dont l'identifiant est pass&eacute; en param&egrave;tre **/
    $.activeRightNsvNavbar = function (nsvNavbarId) {
        $.unactiveAllNsvNavbar();
        $(nsvNavbarId).addClass("active");
    };

    /** Ajoute le bon ent&icirc;te de page **/
    $.addHeader = function (nsvNavbarId) {
        $("#header").load("./components/header.html", function () {
            $.createStreamersMenuLink();
            $.createSocialsMediaLink();
            $.activeRightNsvNavbar(nsvNavbarId);
        });
    };

    /** Ajoute le bon pied de page **/
    $.addFooter = function () {
        $("#footer").load("./components/footer.html");
    };
});
