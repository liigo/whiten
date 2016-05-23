var latestMouse = {
    x: 0,
    y: 0,
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("[whiten] content script: on message", request);
        var result = "ok";
        if (request.cmd_id == "whiten-bg") {
            var elements = allElementsFromPoint(latestMouse.x, latestMouse.y);
            if (elements.length == 0) {
                console.log("[whiten] no elements found");
            }
            elements.forEach(function(element) {
                element.style.backgroundColor = "white";
                element.style.backgroundImage = "url('')";
            });
        } else if (request.cmd_id == "whiten-rm") {
            element = document.elementFromPoint(latestMouse.x, latestMouse.y);
            if (element) {
                element.style.backgroundColor = "red";
                $(element).animate({
                    opacity: 0,
                }, {
                    complete: function() {
                        element.remove();
                    }
                });
            } else {
                console.log("[whiten] no element found");
            }
        } else if (request.cmd_id == "whiten-rm-by-class") {
            element = document.elementFromPoint(latestMouse.x, latestMouse.y);
            if (element) {
                classes = $(element).attr("class").split(" ");
                for (i=0; i<classes.length; i++) {
                    elements = $("." + classes[i]);
                    elements.css("background-color", "red");
                    elements.animate({
                        opacity: 0,
                    }, {
                        complete: function() {
                            elements.remove();
                        }
                    });
                }
            }
        } else if (request.cmd_id == "whiten-hl") {
            element = document.elementFromPoint(latestMouse.x, latestMouse.y);
            if (element) {
                var original_color = element.style.backgroundColor;
                var original_border = element.style.border;
                element.style.border = "3px solid red";
                $(element).animate({
                    backgroundColor: "red",
                }, {
                    complete: function() {
                        $(element).animate({
                            backgroundColor: original_color,
                            border: original_border,
                        });
                    }
                });
            }
        } else if (request.cmd_id == "whiten-hl-by-class") {
            element = document.elementFromPoint(latestMouse.x, latestMouse.y);
            if (element) {
                classes = $(element).attr("class").split(" ");
                for (i=0; i<classes.length; i++) {
                    elements = $("." + classes[i]);
                    var original_color = elements.css("background-color");
                    var original_border = elements.css("border");
                    elements.css("border", "3px solid red");
                    elements.animate({
                        backgroundColor: "red",
                    }, {
                        complete: function() {
                            $(elements).animate({
                                backgroundColor: original_color,
                                border: original_border,
                            });
                        }
                    });
                } // end for loop
            }
        } else {
            result = "unknown cmd_id: " + request.cmd_id;
        }

        sendResponse({
            result: result,
        });
    });

// http://stackoverflow.com/a/27884653
function allElementsFromPoint(x, y) {
    var element, elements = [];
    var old_visibility = [];
    while (true) {
        element = document.elementFromPoint(x, y);
        if (!element || element === document.documentElement) {
            break;
        }
        elements.push(element);
        old_visibility.push(element.style.visibility);
        element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
    }
    for (var k = 0; k < elements.length; k++) {
        elements[k].style.visibility = old_visibility[k];
    }
    elements.reverse();
    return elements;
}

$(document).on("mousedown", function(event) {
    // Liigo: remember the latest mouse click position
    latestMouse.x = event.clientX;
    latestMouse.y = event.clientY;
});
