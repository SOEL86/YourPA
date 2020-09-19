function show(){
    for (var i=0; i < arguments.length; i++) {
        arguments[i].style.display = "initial";
    }
}
function hide(){
    for (var i=0; i < arguments.length; i++) {
        arguments[i].style.display = "none";
    }
}
function pop(e){
    e.style = 'transition:0s; opacity:1';
    setTimeout(function(){e.style = 'transition:2s; opacity:0'}, 10);
}