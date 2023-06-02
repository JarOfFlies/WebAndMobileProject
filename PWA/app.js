// Generation Content Based On The Template
var template = "<div class='card'>\n\
<a onclick='document.querySelector(\".SLUG\").showModal();'>\n\
    <img src='data/img/placeholder.png' data-src='data/img/ID.jpg' alt='NAME' style='height: 220px; width: auto'>\n\
</a>\n\
<dialog class='mdl-dialog SLUG'>\n\
<h4 class='mdl-dialog__title'>NAME</h4>\n\
<div class='mdl-dialog__content'>\n\
<p>Mana Cost: COST</p>\
<p>Type: TYPE</p>\
<p style='white-space: pre-line'>Oracle: ORACLE</p>\
<p>cmc: CMC</p>\
<p>power: POWER</p>\
<p>Toughness: TOUGHNESS</p>\
<p>Collector Number: COLLECTOR</p>\
</div>\n\
<div class'mdl-dialog__actions>\n\
<button type='button' class='mdl-button close' id='ID' onclick='document.querySelector(\".SLUG\").close();'>Close</button>\n\
</div>\n\
</dialog>\n\
</div>"; 

var content = '';
for (var i = 0; i < cards.length; i++){
    var entry = template.replace(/SLUG/g, cards[i].slug)
    .replace(/ID/g, cards[i].id)
    .replace(/NAME/g, cards[i].name)
    .replace(/COST/g, cards[i].mana_cost)
    .replace(/TYPE/g, cards[i].type_line)
    .replace(/ORACLE/g, cards[i].oracle_text.replace(/\\n/g, "\n\n"))
    .replace(/CMC/g, cards[i].cmc)
    .replace(/POWER/g, cards[i].power)
    .replace(/TOUGHNESS/g, cards[i].toughness)
    .replace(/COLLECTOR/g, cards[i].collector_number)
    entry = entry.replace('<a href=\'http:///\'></a>', '-');
    content += entry;
};
document.getElementById('content').innerHTML = content;

var d = document.querySelector('dialog.mdl-dialog');

dialogContent = d.innerHTML;
for (var i = 0; i < cards.length; i++) {
    var entry = dialogContent.replace(/NAME/g, cards[i].name);
    content += entry;
}

d.innerHTML = dialogContent;

// PRogessive Loading Images
let imageToLoad = document.querySelectorAll('img[data-src]');

const loadImages = function(image){
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = function(){
        image.removeAttribute('data-src');
    };
};

if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(items, observer){
        items.forEach(function(item){
            if(item.isIntersecting){
                loadImages(item.target);
                observer.unobserve(item.target);
            }
        });
    });
    imageToLoad.forEach(function(img){
        observer.observe(img);
    });
}
else{
    imageToLoad.forEach(function(img){
        loadImages(img);
    });
}

//Registering Service Worker
if('serviceWorker' in navigator){
   navigator.serviceWorker.register('sw.js');
};