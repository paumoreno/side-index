(function($) {
    'use strict';

    $.fn.sideIndex = function(opts) {
        var $context = this,
            sideIndexElements = [],// Array containing a reference to all the elements in the side index.
            currentRef = null,
            lastMatchedIndex = 0,// A reference to the last matched element index in the side index. This prevents scrolling to the last element accidentally.
            $sideIndexTemplate = $('<nav />', {'id': 'side-index'}).append($('<ul />')),
            $indexElementTemplate = $('<li />', {'class': 'side-index-item'}).append($('<a />')),
            $positionIndicatorTemplate = $('<div />', {'id': 'side-index-indicator'}),
            defaults = {
                indexTop: '0',
                targetTopOffset: 0
            },
            options;

        /**
         * Gets the data of all the indexable elements of the page and returns it in an array.
         */
        var buildNavArray = function() {
            var navElements = [];

            // Get the data of all the indexable elements in the document.
            $('[data-side-index]', $context).each(function() {
                navElements.push({
                    pos: $(this).offset().top,
                    text: $(this).data('sideIndex'),
                    indicator: $(this).data('sideIndexIndicator') || $(this).data('sideIndex'),
                    ref: $(this).attr('id')
                });
            });

            // Sort all the indexed elements by their position in the document
            // Note that the order in the HTML document may noy correspond to the order in the screen!
            navElements.sort(function(a, b) {
                return a.pos - b.pos;
            });


            //console.log("side elements:");
            //
            //$.each(navElements, function() {
            //    console.log(this.pos, this.ref);
            //});

            return navElements;
        };

        var buildIndexArray = function() {
            var docOffset = $(window).scrollTop();

            $('.side-index-item', $context).each(function() {
                sideIndexElements.push({
                    pos: $(this).offset().top - docOffset,
                    obj: $(this)
                });
            });

            //console.log("index elements:");
            //
            //$.each(sideIndexElements, function() {
            //    console.log(this.pos, this.obj.data('target'));
            //});
        };

        var buildSideIndex = function() {
            var $sideIndex = $sideIndexTemplate.clone(),
                $indexElement,
                i,
                windowHeight = $(window).height(),
                navElements = buildNavArray();

            for (i = 0; i < navElements.length; i++) {
                $indexElement = $indexElementTemplate
                    .clone()
                    .data('target', navElements[i].ref)
                    .data('indicator', navElements[i].indicator)
                    .text(navElements[i].text);

                $('ul', $sideIndex).append($indexElement);
            }

            $sideIndex.css('height', (windowHeight + 30) + 'px');
            $('ul', $sideIndex).css('height', (windowHeight - options.indexTop) + 'px');

            $context.append($sideIndex);

            buildIndexArray();
        };

        var placeMarker = function(text) {
            var $indicator = $positionIndicatorTemplate.clone();

            $context.find('#side-index-indicator').remove();

            $indicator.text(text);
            $context.append($indicator);
        };

        /**
         * Bring the viewport to the position specified by $sideIndexElement
         * @param $sideIndexElement Element of the side Index that stores the reference to the element to reveal
         * @param showMarker boolean Should I show a marker indicating the current position??
         */
        var goToRef = function($sideIndexElement, showMarker) {
            var target;

            if (currentRef != $sideIndexElement.data('target')) {
                currentRef = $sideIndexElement.data('target');

                //console.log($sideIndexElement.data('target'));
                //window.location.hash = $sideIndexElement.data('target');

                if (window.history.replaceState) {
                    window.history.replaceState(window.history.state, document.title, '#' + $sideIndexElement.data('target'));
                } else {
                    window.location.hash = $sideIndexElement.data('target');
                }

                target = $('#' + $sideIndexElement.data('target'));
                window.scrollTo(0, target.offset().top + options.targetTopOffset);

                if (showMarker) {
                    placeMarker($sideIndexElement.data('indicator'));
                }
            }
        };

        var bindEvents = function() {
            $context
                .on('touchstart', '#side-index', function(e) {

                    e.preventDefault();
                })
                .on('touchmove', '#side-index', function(e) {
                    var y = e.originalEvent.touches[0].clientY,
                        i,
                        foundPos = false;

                    //console.log(y, y  - docOffset);

                    for (i = 0; i < sideIndexElements.length; i++) {
                        if (y < sideIndexElements[i].pos) {
                            lastMatchedIndex = i;
                            foundPos = true;
                            break;
                        }
                    }

                    if (!foundPos) {
                        i = lastMatchedIndex;
                    }

                    goToRef(sideIndexElements[i - 1].obj, true);

                    e.preventDefault();
                })
                .on('touchend', '#side-index', function(e) {
                    $context.find('#side-index-indicator').fadeOut('fast');
                })
                .on('click', '.side-index-item', function() {
                    goToRef($(this), false);
                });
        };

        options = $.extend({}, defaults, opts);

        buildSideIndex();
        bindEvents();
    };

}(jQuery));
