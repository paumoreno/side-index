(function($, window) {
    'use strict';

    $.fn.sideIndex = function(opts) {
        var $context = this,

            // Array containing a reference to all the elements in the side index.
            sideIndexElements = [],

            currentRef = null,

            // Structure of the side index
            $sideIndexTemplate = $('<nav />', {'id': 'side-index'}).append($('<ul />')),

            // Structure of each side index element
            $indexElementTemplate = $('<li />', {'class': 'side-index-item'}).append($('<a />')),

            // Structure of the selected index item indicator
            $positionIndicatorTemplate = $('<div />', {'id': 'side-index-indicator'}),

            // Plugin default values for optional parameters
            defaults = {
                debug: false,
                // Top margin in pixels for the side index. Use it to prevent overlapping with a fixed topbar
                indexTop: 100,

                // Height pixel offset to apply when positioning the viewport to any of the selected positions
                // Useful when there is a fixed topbar that can overlap the upper part of the selected section
                targetTopOffset: 0
            },
            options;

        /**
         * Gets the information of all the indexable elements of the page @asyncnd returns it in an array.
         */
        var getNavElements = function() {
            var navElements = [],
                $inexableElements;

            // Get the data of all the indexable elements in the document.
            $('[data-side-index]', $context).each(function() {
                var indicatorText = $(this).data('sideIndexIndicator'),
                    indexText = $(this).data('sideIndex'),
                    id = $(this).attr('id');

                navElements.push({
                    pos: $(this).offset().top,
                    text: indexText || id,
                    indicator: indicatorText || indexText || id,
                    ref: id
                });
            });

            // Sort all the indexed elements by their position in the document
            // Note that the order in the HTML document may noy correspond to the order in the screen!
            navElements.sort(function(a, b) {
                return a.pos - b.pos;
            });

            return navElements;
        };

        /**
         * Build an array that contains a references to the elements in the side index.
         * It will be used to detect the location of the finger when swiping over the side index.
         */
        var buildIndexArray = function() {
            var docOffset = $(window).scrollTop();

            $('.side-index-item', $context).each(function() {
                sideIndexElements.push({
                    pos: $(this).offset().top - docOffset,
                    obj: $(this)
                });
            });

            if (options.debug) {
                console.log("Side index elements:");
                $.each(sideIndexElements, function() {
                   console.log(this.pos, this.obj.data('target'));
                });
            }
        };

        /**
         * Build the side index DOM, appending an item for each nav element
         */
        var buildSideIndex = function() {
            var $sideIndex = $sideIndexTemplate.clone(),
                $indexElement,
                windowHeight = $(window).height(),
                navElements = getNavElements(),
                i;

            for (i = 0; i < navElements.length; i++) {
                $indexElement = $indexElementTemplate
                    .clone()
                    .data('target',     navElements[i].ref)
                    .data('indicator', navElements[i].indicator)
                    .text(navElements[i].text);

                $('ul', $sideIndex).append($indexElement);
            }

            // Set the size of the side index according to the given options
            $sideIndex.css('height', (windowHeight + 30) + 'px');
            $('ul', $sideIndex).css('height', (windowHeight - options.indexTop) + 'px');

            $context.append($sideIndex);

            buildIndexArray();
        };

        /**
         * Show a marker that indicates which section is the user scrolling to
         */
        var placeMarker = function(text) {
            var $indicator = $positionIndicatorTemplate.clone();

            $context.find('#side-index-indicator').remove();

            $indicator.text(text);
            $context.append($indicator);
        };

        /**
         * Bring the viewport to the position specified by $sideIndexElement
         *
         * @param $sideIndexElement Element of the side index that stores the reference to the element to scroll to
         * @param showMarker boolean Should I show a marker indicating the current position?
         */
        var goToRef = function($sideIndexElement, showMarker) {
            var target;

            // Prevent scrolling to the same section
            if (currentRef != $sideIndexElement.data('target')) {
                currentRef = $sideIndexElement.data('target');

                if (options.debug) {
                    console.log("Moving the viewport to ", $sideIndexElement.data('target'));
                }

                // Set the URL search part to the corresponding indexed section id.
                if (window.history.replaceState) {
                    // If possible, replace the history state to prevent multiple "backs" to go to the previous page
                    window.history.replaceState(window.history.state, document.title, '#' + $sideIndexElement.data('target'));
                } else {
                    window.location.hash = $sideIndexElement.data('target');
                }

                // Scroll to the appropriate section
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
                    // Prevent scrolling the document if the swipe starts in the side index
                    e.preventDefault();
                })
                .on('touchmove', '#side-index', function(e) {
                    var y = e.originalEvent.touches[0].clientY,
                        i;

                    for (i = 0; i < sideIndexElements.length; i++) {
                        if (y < sideIndexElements[i].pos) {
                            break;
                        }
                    }

                    // If the finger is avobe the first index element, go to the first element
                    if (i === 0) {
                        i = 1;
                    }

                    if (options.debug) {
                        console.log("Finger at Y ", y);
                        console.log("Over position " + i, sideIndexElements[i - 1].obj.data('target'));
                    }

                    goToRef(sideIndexElements[i - 1].obj, true);

                    e.preventDefault();
                })
                .on('touchend', '#side-index', function() {
                    $context.find('#side-index-indicator').fadeOut('fast');
                })
                .on('click', '.side-index-item', function() {
                    // If a side index element is tapped, just go to the corresponding section
                    goToRef($(this), false);
                });
        };

        options = $.extend({}, defaults, opts);

        buildSideIndex();
        bindEvents();
    };

}(jQuery, window));
