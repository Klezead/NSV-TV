/*jslint browser: true*/
/*global $, jQuery, alert, config, patchNotes*/

$(document).ready(function () {
    "use strict";

    $.createPatchNotesPresentation = function () {
        $.each(patchNotes.patchs, function (index, patch) {
            var patchnote = $("#patchnote-hidden-template").clone();
            patchnote.attr("id", "patchnote" + patch.version);
            patchnote.find(".panel-heading").html(patch.version + " - " + patch.date);
            patchnote.find(".panel-body").load(patch.description);
            $("#patch_notes_content").append(patchnote);
        });
    };
});
