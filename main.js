(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

$(window).scroll(function () {
    $("#dropdown-options").addClass("inactive");
    if ($(document).scrollTop() < 30) {
        $('#nav-bar').addClass("top");
        $('#nav-bar').addClass("open");
        $("#dropdown-options").addClass("inactive");
    } else if($('#nav-bar')[0].classList.contains("top")){
        $('#nav-bar').removeClass("top");
        $('#nav-bar').removeClass("open");
    }
});

$("#nav-bar").mouseenter(function(){
    $(this).addClass("open");
});
$("#nav-bar").click(function(){
    $(this).addClass("open");
});
$("#nav-bar").mouseleave(function(){
    if(!$(this).hasClass("top")){
        $(this).removeClass("open");
    }
});

$(".nav-bar-item").mouseenter(function(){
    var rect = this.getBoundingClientRect();
    var options = $(this).children(".nav-bar-item-options")[0];

    $("#dropdown-options-container")[0].innerHTML = options.innerHTML;
    $("#dropdown-options").stop();
    if($("#dropdown-options").hasClass("inactive")){
        $("#dropdown-options").animate({
            "top": rect.bottom, 
            "left": rect.left + (rect.right - rect.left)/2 - 50,
            "height": $("#dropdown-options-container").innerHeight(),
        }, 0);
        $("#dropdown-options").removeClass("inactive");
    }else{
        $("#dropdown-options").animate({
            "top": rect.bottom, 
            "left": rect.left + (rect.right - rect.left)/2 - 50,
            "height": $("#dropdown-options-container").innerHeight()
        }, 300);
    }
});

$("#dropdown-options").mouseleave(function(){
    $(this).addClass("inactive");
});
$("#nav-bar").mouseleave(function(){
    if(!$("#dropdown-options")[0].matches(':hover')){
        $("#dropdown-options").addClass("inactive");
    }
});

$(".flipboard-text > span").mouseenter(function(){
    if(!this.classList.contains("flipping")){
        this.classList.add("flipping");
        flip(this, 500, this.innerText);
    }
});

$(".flipboard-text").each(function(){
    for(var i = 0; i < this.children.length; i++){
        this.children[i].classList.add("flipping");
        flip(this.children[i], 500+i*80, this.children[i].innerText);
    }
});

$(".rotating-text > div").each(function(){
    this.style.top = "0px";
    setTimeout(rotate_text, 4000, this);
});

var mouse_x = -100;
var mouse_y = -100;

$(window).on("mousemove", function(e){
    if(!jQuery.browser.mobile){
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    }
});
$(window).on("mouseenter", function(e){
    $(".mouse-follow").addClass("mouse-onscreen");
});
$(window).on("mouseleave", function(e){
    $(".mouse-follow").removeClass("mouse-onscreen");
});

$("#skill-container").each(function(){
    var skill_box_template = $("#template-skill-box")[0]
    this.appendChild(skill_box_template.content.cloneNode(true));
});

function flip(e, length, letter){
    for(var i = 0; i < length/20; i++){
        setTimeout(randomize_letter, i*20, e);
    }
    setTimeout(function(e, letter){
        e.innerText = letter;
        e.classList.remove("flipping");
    }, length+20, e, letter);
}

function randomize_letter(e){
    const symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    e.innerText = symbols[Math.floor(Math.random()*symbols.length)];
}

function rotate_text(e){
    var current = -Math.round(Number(e.style.top.slice(0,-2))/30);
    if(current == e.children.length-1){
        e.style.top = "0px";
        current = 0;
    }
    $(e).animate({"top": -(current+1)*30}, 500, function(){
        setTimeout(rotate_text, 4000, e);
    });
}

function frame(){
    $(".mouse-follow").each(function(){
        // console.log(Number(this.dataset.followStrength));
        var cur_x = Number(this.style.left.slice(0, -2));
        var cur_y = Number(this.style.top.slice(0, -2));

        this.style.top = cur_y+(mouse_y-cur_y)*Number(this.dataset.followStrength)+"px";
        this.style.left = cur_x+(mouse_x-cur_x)*Number(this.dataset.followStrength)+"px";
    })
    requestAnimationFrame(frame);
}

frame();