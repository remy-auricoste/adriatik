#!/bin/sh

browserify -o src/lib/Socket.js -s Socket node_modules/rauricoste-websocket-room-client/src/main/js/SocketBus.js
browserify -o src/lib/Meta.js -s Meta node_modules/rauricoste-meta/app/js/Meta.js
