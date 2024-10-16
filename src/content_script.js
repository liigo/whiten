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
                element.style.borderWidth = "thin";
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
                // 20240528: if the element has no classes, we try its parent.
                // to support github users avatar image:
                //   <a class="TimelineItem-avatar avatar circle lh-0 Link"><img /></a>
                classes = $(element).attr("class");
                if (classes === null || classes === "") {
                    element = element.parentElement;
                }
            }
            if (element) {
                classes = $(element).attr("class");
                classes = (classes == null) ? [] : classes.split(" ");
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
        } else if (request.cmd_id == "whiten-rm-by-box") {
            element = document.elementFromPoint(latestMouse.x, latestMouse.y);
            if (element) {
                const box = element.getBoundingClientRect();
                // console.log({id:"element", box:box, el: element});
                var parent = element.parentElement;
                var elements = $(element);
                while (parent) {
                    const pbox = parent.getBoundingClientRect();
                    // cann't write as `pbox == box` or `pbox === box`
                    if (compareBox(pbox, box)) {
                        elements = elements.add(parent);
                        parent = parent.parentElement;
                    } else {
                        // console.log({id:"parent", box:pbox, el:parent});
                        break;
                    }
                }
                console.log("[whiten] count of elements in box: " + elements.size());
                elements.css("background-color", "red");
                elements.animate({
                    opacity: 0,
                }, {
                    complete: function() {
                        elements.last().remove();
                    }
                });
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
                // 20240528: if the element has no classes, we try its parent.
                // to support github users avatar image:
                //   <a class="TimelineItem-avatar avatar circle lh-0 Link"><img /></a>
                classes = $(element).attr("class");
                if (classes === null || classes === "") {
                    element = element.parentElement;
                }
            }
            if (element) {
                classes = $(element).attr("class");
                classes = (classes == null) ? [] : classes.split(" ");
                for (i=0; i<classes.length; i++) {
                    elements = $("." + classes[i]);
                    let original_color = elements.css("background-color");
                    let original_border = elements.css("border");
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
        } else if (request.cmd_id == "whiten-urlprefix") {
            // liigo: 20241016: reload with urlprefix
            let urlprefix;
            chrome.storage.sync.get(["urlprefix"], (result) => {
                urlprefix = result.urlprefix;
                console.log("[whiten] load urlprefix:", urlprefix);
                if (urlprefix && urlprefix.trim() !== "")
                    window.location = `${urlprefix}/${window.location}`;
                else
                    window.location = "https://unknown-urlprefix-option/" + window.location;
            });
        } else {
            if (!handle_others(request, sender, sendResponse))
                result = "unknown cmd_id: " + request.cmd_id;
        }

        sendResponse({
            result: result,
        });
    }
);

function handle_others(request, sender, sendResponse) {
    if (request.cmd_id == "whiten-rm-rust-internals-hdr") {
        removeElementsByClass("d-header");
    } else if (request.cmd_id == "whiten-rm-zhihu-hdr") {
        removeElementsByClass("Sticky"); // AppHeader
    } else {
        return false;
    }
    return true;
}

function removeElementsByClass(class_name) {
    let elements = $("." + class_name);
    console.info("class:" + class_name);
    console.info(elements);
    removeZeptoElements(elements);
}

function removeZeptoElements(zepto_elements) {
    if (!zepto_elements) {
        console.log("[whiten] no elements to remove");
        return;
    }
    zepto_elements.css("background-color", "red");
    zepto_elements.animate({
        opacity: 0,
    }, {
        complete: function() {
            zepto_elements.remove();
        }
    });
}

function removeJsElement(element) {
    removeElement($(element));
}

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

function compareBox(box1, box2) {
    return (box1.x == box2.x && box1.y == box2.y
         && box1.width == box2.width && box1.height == box2.height);
}

$(document).on("mousedown", function(event) {
    // Liigo: remember the latest mouse click position
    latestMouse.x = event.clientX;
    latestMouse.y = event.clientY;
});
