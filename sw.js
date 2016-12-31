
const SW_VERSION = '1.12';
const SW_MV = SW_VERSION.split('.')[0]; // major version number
const SW_ACTIVE = true;
const SW_LOG_PREFIX = 'SW' + SW_VERSION + ' --> ';
const SW_CACHE = 'memory' + SW_MV;

const BASEPATH = '/memory/' + SW_MV + '/';
const ITEMSTRING = 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra';
const FILES = toFileNames(ITEMSTRING).concat([
        BASEPATH + '../favicon.ico',
        BASEPATH,
        BASEPATH + 'index.html',
        BASEPATH + 'launcher-icon.png',
        BASEPATH + 'launcher-icon-2x.png',
        BASEPATH + 'launcher-icon-3x.png',
        BASEPATH + 'launcher-icon-4x.png',
        BASEPATH + 'main.css',
        BASEPATH + 'main.js',
    ]);

if (SW_ACTIVE) {
    console.log(SW_LOG_PREFIX + 'Active service worker.');

    self.addEventListener('install', event => {
        event.waitUntil(caches.open(SW_CACHE).then(cache => cache.addAll(FILES)));
        self.skipWaiting();
    });

    self.addEventListener('activate', event => {
        console.log(SW_LOG_PREFIX + 'Activated version', event);
    });

    self.addEventListener('fetch', event => {
        event.respondWith(caches.match(event.request) || fetch(event.request));
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
