/* fix if served from file:// URLs as browsers don't automatically
 * redirect to index.html. file:// is expected to be a reasonably
 * common use-case.
 */
function file_url($node) {
    if(window.location.protocol === "file:") {
        $("a",$node).each(function() {
            var href = $(this).attr('href');
            if(href.endsWith(".")) {
                href += "/";
            }
            if(href.endsWith("/")) {
                href += "index.html";
            }
            $(this).attr('href',href);
        });
    }
}

$(function() {
    file_url($(document));

    var observer = new MutationObserver(function( mutations ) {
      mutations.forEach(function( mutation ) {
        var newNodes = mutation.addedNodes; // DOM NodeList
        if( newNodes !== null ) { // If there are new nodes added
            file_url($(document));
        }
      });    
    });

    observer.observe($('body')[0],{ 
        subtree: true,
        childList: true
    });
});
