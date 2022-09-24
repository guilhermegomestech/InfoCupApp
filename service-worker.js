const CACHE_NAME = "InfoAppCup_cache";

const FILES_CACHE = [
    "css/bootstrap.min.css",
    "icons/favicon.ico",
    "css/styles.css",
    "img/load.gif",
    "img/logo.png",
    "img/no_img.jpg",
    "img/offline.png",
    "js/app.js",
    "js/bootstrap.bundle.min.js",
    "dados.json",
    "offline.html",
];

//Instalação do Service Worker
self.addEventListener("install", (evt) => {

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {
          
            console.log("Server Worker gravando cache estático");
            return cache.addAll(FILES_CACHE);
            
        })

    )

});

//Ativando o Service Worker
self.addEventListener("activate", (evt) => {

    evt.waitUntil(

        caches.keys().then((keylist) =>{

            return Promise.all(keylist.map((key) => {

                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }

            }))

        })

    )

});

//Experiencia Offline

self.addEventListener("fetch", (evt) => {

    if(evt.request.mode !== "navigate"){
        return;
    }

    evt.respondWith(

        fetch(evt.request).catch(() =>{
            return caches.open(CACHE_NAME).then((cache) => {

                return cache.match ("offline.html");

            });
        })

    );

});