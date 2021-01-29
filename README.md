## Static monitoring solution for BigBlueButton
Simple monitoring site that runs as a static page. Can be hosted anywhere and does not need a server to run.

You will have to allow CORS headers on your BBB instance or use a browser extension to receive the data (try Cors Everywhere for FireFox).

To enable CORS headers on your server add this location to the other loacations in `/etc/bigbluebutton/nginx/web.nginx`

location /bigbluebutton/api/getMeetings {
  proxy_pass         http://127.0.0.1:8090;
  proxy_redirect     default;
  proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;

  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Methods "GET,OPTIONS";
  add_header Access-Control-Allow-Headers  Content-Type;
  add_header Access-Control-Max-Age        86400;
}

Then restart your nginx service: `sudo /etc/init.d/nginx restart`

Once on the page fill in your `server` address and the `shared secret`. You can get the `shared secret` by running `bbb-conf --secret` on your BBB server. The number to the right allows you to set the interval for data polling.

You can try out the monitoring page on https://bbb-monitor.netlify.app/

To run it locally you will need to have node.js and git installed.

```
git clone https://github.com/hmt/bbb-static-monitor.git
cd bbb-static-monitor
npm install
npm run dev
```

You can then open your browser to https://localhost:5000 for a local instance of the page.

If you want to contribute feel free to open a pull request or open an issue.

This little project was created with [Svelte](https://svelte.dev)

MIT Licensed