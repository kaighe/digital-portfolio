function template_text(replacements){
    for(var i = 0; i < Object.keys(replacements).length; i++){
        console.log(Object.keys(replacements)[i])
        $("body > *").each(function() {
            // console.log(this)
            this.innerHTML = this.innerHTML.replaceAll(Object.keys(replacements)[i], replacements[Object.keys(replacements)[i]]);
        });
    }
}

template_text({
    "{{PROGRAMMING_YEARS}}": Math.floor((Date.now() - Date.parse("2013")) / 31536000000),
});