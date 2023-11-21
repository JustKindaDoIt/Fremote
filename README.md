# phone-remote
Open-source application of Node.js to send and interpret client mouse inputs over the cloud. Functional on both PC and mobile.

The application is comprised of two key components: index.html and index.js. 
Index.html is a barebones HTML5 document with a circle that follows the cursor/touch location (for IOS) that is hosted on a server created by Index.js. It includes scripts that send XTTP requests to the server, containing client cursor/touch x,y and click events.
Index.js uses the Node.js Express library to manage /get and /use requests. XTTPS is interpretted through Express /use and is parsed to the Nut.js automation library.

Nut.js is used to move the cursor on the server machine to match the client cursor. As well as clicking and scrolling.

When Index.js receives an endpoint it doesn't recognise, the endpoint is typed as a string on the server device.

The application is primarily a teaching-tool, and should be appreciated as such. It is inefficient, but serves as an intuitive example of WEB3 protocols.
