self.importScripts('data/cards.js');

//Files to cache
var cacheName = 'cards-V1';
var appShellFiles = [
    './',
    'data/cards.js',
    'index.html',
    'app.js',
    'style.css',
    'favicon.ico',
    'img/bg.png',
    'resources/material-design-lite/material.min.js',
    'resources/material-design-lite/material.min.js.map',
    'resources/material-design-lite/material.red-indigo.min.css'
];

var cardImages = [];
for(var i = 0; i <cards.length; i++){
    cardImages.push('data/img/'+ cards[i].id + '.jpg');
}
var contentToCache = appShellFiles.concat(cardImages);

//Installing service worker
self.addEventListener('install', function(e){
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[Service Worker] Caching all: app shell content');
            return cache.addAll(contentToCache);
        })
    );
});

//Fetching content using Service Worker
self.addEventListener('fetch', function(e){
    e.respondWith(
        caches.match(e.request).then(function(r){
            console.log('[Service Worker] Fetching Resource: ' + e.request.url);
            return r || fetch(e.request).then(function(response){
                return caches.open(cacheName).then(function(cache){
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

//Activating Service Worker
self.addEventListener('active', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheName.indexOf(key) == 1){
                    return caches.delete(key);
                }
            }));
        })
    );
});