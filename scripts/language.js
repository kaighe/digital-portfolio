var language = navigator.language;
var dashIndex = language.indexOf('-');
if (dashIndex >= 0) {
    language = language.substring(0, dashIndex);
}

$("#language-toggle").click(function(){
    if(document.documentElement.lang == "en"){
        // localStorage["lang"] = "fr";
        document.documentElement.lang = "fr";
    }else{
        // localStorage["lang"] = "en";
        document.documentElement.lang = "en";
    }
})