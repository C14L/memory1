
const SW_VERSION = 'v0.0.7';
const SW_ACTIVE = true;

const SW_LOG_PREFIX = '# ' + SW_VERSION + ' -- ';
const SW_CACHE = 'filecache';

function toFileNames(arr) {
    let arr2 = [];
    for (let i=0; i<arr.length; i++) {
        arr2.push(arr[i] + '-1');
        arr2.push(arr[i] + '-2');
    }
    return arr2;
}

if (SW_ACTIVE) {
    console.log(SW_LOG_PREFIX + 'Active service worker.');

    self.addEventListener('install', event => {
        
        const toCache = ['index.html', 'main.css', 'main.js'];
        toCache.concat(toFileNames(['cat', 'dog', 'elephant', 'giraffe', 'hippo', 'kudu', 'monkey', 'panda', 'pig', 'seal', 'squirrel', 'zebra']));

        event.waitUntil(
            caches.open(SW_CACHE).then(cache => {
                return cache.addAll(toCache)
            })
        );
    });

    self.addEventListener('activate', event => {
        console.log(SW_LOG_PREFIX + 'Activated version', event);
    });

    self.addEventListener('fetch', event => {
        event.respondWith(
            caches.match(event.request).then(response => {

                fetch(event.request).then(freshResponse => {
                    caches.open(SW_CACHE).then(cache => {
                        cache.put(event.request, freshResponse.clone());
                        return freshResponse;
                    }).catch(err => {
                        console.error('Network error.');
                    });
                });

                return response;
            })
        );
    });

} else {
    console.log('Service Worker NOT active.');
}