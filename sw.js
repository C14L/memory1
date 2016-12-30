
const SW_VERSION = '1.10';
const SW_ACTIVE = true;
const SW_LOG_PREFIX = 'SW' + SW_VERSION + ' --> ';
const SW_CACHE = 'memory' + SW_VERSION;

const BASEPATH = '/memory/1/';
const ITEMSTRING = 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra';
const FILES = [
        BASEPATH + 'favicon.ico',
        BASEPATH,
        BASEPATH + 'index.html',
        BASEPATH + 'launcher-icon.png',
        BASEPATH + 'launcher-icon-2x.png',
        BASEPATH + 'launcher-icon-3x.png',
        BASEPATH + 'launcher-icon-4x.png',
        BASEPATH + 'main.css',
        BASEPATH + 'main.js',
        BASEPATH + 'manifest.json',
    ].concat(toFileNames(ITEMSTRING));

if (SW_ACTIVE) {
    console.log(SW_LOG_PREFIX + 'Active service worker.');

    self.addEventListener('install', event => {
        event.waitUntil(caches.open(SW_CACHE).then(cache => cache.addAll(FILES)));
    });

    self.addEventListener('activate', event => {
        console.log(SW_LOG_PREFIX + 'Activated version', event);
    });

    self.addEventListener('fetch', event => {
        event.respondWith(caches.match(event.request));
    });

} else {
    console.log('Service Worker NOT active.');
}

function toFileNames(itemstring) {
    let arr = itemstring.split(' ');
    let arr2 = [];
    for (let i=0; i<arr.length; i++) {
        arr2.push(BASEPATH + 'pics/' + arr[i] + '-1.jpg');
        arr2.push(BASEPATH + 'pics/' + arr[i] + '-2.jpg');
    }
    return arr2;
}
