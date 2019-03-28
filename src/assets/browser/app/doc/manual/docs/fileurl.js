$(function() {
    /* fix if served from file:// URLs as browsers don't automatically
     * redirect to index.html. file:// is expected to be a reasonably
     * common use-case.
     */
    if(window.location.protocol === "file:") {
        $("a").each(function() {
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
});
