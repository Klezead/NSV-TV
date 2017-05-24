$(document).ready(function() {
	/** Charge les 6 derni&egrave;res vid&eacute;os d'une chaine dans la bonne section **/
	$.loadVideosFromChannel = function(channelId, channelName) {
		$.when($.getJSON(
			config.youtube.apiUrl.search.replace("<channelId>", channelId)
			+ "&maxResults=" + config.youtube.maxResults
			+ "&key=" + config.youtube.applicationId)).then(function(json) {
			if (0 != json.items) {
				var channelDiv = $("#channel-hidden-template").clone();
				channelDiv.attr("id", channelName + "Channel");
				channelDiv.find(".videoDivTitle").html(
					config.youtube.videoDivTitle.replace("<channelName>", channelName));
				channelDiv.find(".channelVideo");
				var youtubeVideo = null;
				var snippet = null;
				$.each(json.items, function(index, video) {
					snippet = video.snippet;
					if("youtube#video" == video.id.kind) {
						youtubeVideo = $("#video-hidden-template").clone();
						youtubeVideo.attr("id", "video_" + video.id.videoId);
						youtubeVideo.attr("href",
							config.youtube.watchUrl.replace("<videoId>", video.id.videoId));
						youtubeVideo.find(".video_title").html($.reduceTitleTextSize(snippet.title));
						youtubeVideo.find(".stream_date").html($.convertDateToFrench(snippet.publishedAt));
						youtubeVideo.find(".video_thumbnail").attr("src", snippet.thumbnails.medium.url);
						channelDiv.find(".channelVideos").append(youtubeVideo);
					}
				});
				$("#youtubeVideosDiv").append(channelDiv);
			}
		});
	}

	/** Charge les 6 derni&egrave;res vid&eacute;os d'une playlist dans la bonne section **/
	$.loadVideosFromPlaylist = function(playlistId, div) {
		$.when($.getJSON(
			config.youtube.apiUrl.playlisteItems.replace("<playlistId>", playlistId)
			+ "&maxResults=" + config.youtube.maxResults
			+ "&key=" + config.youtube.applicationId)).then(function(json) {
			var youtubeVideo = null;
			var snippet = null;
			$.each(json.items, function(index, video) {
				snippet = video.snippet;
				youtubeVideo = $("#video-hidden-template").clone();
				youtubeVideo.attr("id", "video_" + video.id);
				youtubeVideo.attr("href",
					config.youtube.watchUrl.replace("<videoId>", snippet.resourceId.videoId));
				youtubeVideo.find(".video_title").html($.reduceTitleTextSize(snippet.title));
				youtubeVideo.find(".stream_date").html($.convertDateToFrench(snippet.publishedAt));
				youtubeVideo.find(".video_thumbnail").attr("src", snippet.thumbnails.medium.url);
				div.append(youtubeVideo);
			});
		});
	}

	/** Charge l'ensemble des sections et les ajoute dans la page **/
	$.addYoutubeVideos = function() {
		$("#content").load("./components/youtube.html", function() {
			// Chargement de la playlist 'NSV-TV Best Vid&eacute;os' Playlist
			$.loadVideosFromPlaylist(config.youtube.nsvTvBestPlaylistId, $("#bestPlaylistVideos"));
			// Chagement des vid&eacute;os des streamers pr&eacute;sent sur Youtube **/
			$.each(config.streamers, function(index, streamer) {
				if (null != streamer.youtube) {
					$.loadVideosFromChannel(
						streamer.youtube.channelId,
						streamer.youtube.channelName);
				}
			});
		});
	}
});