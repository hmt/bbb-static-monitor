## Static monitoring solution for BigBlueButton
Simple monitoring site that runs as a static page. Can be hosted anywhere and does not need a server to run.

You will have to allow CORS headers on your BBB instance or use a browser extension to receive the data (try Cors Everywhere for FireFox).

Just fill in your `server` address and the `shared secret`. You can get the `shared secret` by running `bbb-conf --secret` on your BBB server.

MIT Licensed