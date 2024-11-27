const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
if(localStorage["theme"] == undefined){
    if(prefersDarkScheme){
        localStorage["theme"] = "dark";
    }else{
        localStorage["theme"] = "light";
    }
}

if(localStorage["theme"] == "dark"){
    $(document.body).removeClass("light-theme");
    $(document.body).addClass("dark-theme");
}else{
    localStorage["theme"] = "light";
    $(document.body).removeClass("dark-theme");
    $(document.body).addClass("light-theme");
}

$("#theme-toggle").click(function(){
    if($(document.body).hasClass("light-theme")){
        localStorage["theme"] = "dark";
        $(document.body).removeClass("light-theme");
        $(document.body).addClass("dark-theme");
    }else{
        localStorage["theme"] = "light";
        $(document.body).removeClass("dark-theme");
        $(document.body).addClass("light-theme");
    }
})

$(window).on("load", function(){
    $(".notransition").removeClass("notransition");
});