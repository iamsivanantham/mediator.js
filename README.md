# mediator.js

This promise-based library safely enables cross-origin communication between Window objects. e.g,. between a page to iframe or between two iframes.

## Install

Using NPM:

```bash
$ npm install @siga/mediator
```

Using CDN:

```html
<script src="https://unpkg.com/@siga/mediator/dist/mediator.min.js"></script>
```

## Example Code

```javascript
const Mediator = require("@siga/mediator");

var mediator = new Mediator(targetWindow, targetOrigin);

mediator.postMessage("Hello, Alice")
.then(response) => {
  console.log(response); // Hello, Bob
}).catch(error) => {
  console.log(error);
});

mediator.onMessage(function(message){
  if(message.data == "Are you sure?"){
    message.reply("Sure"); // to send reply message to sender
  }
});
```

## Mediator API
##### Mediator(targetWindow, targetOrigin[, option]);

+ **targetWindow** - A reference to the window that will receive the message.
+ **targetOrigin** - Specify the message receiver's origin `http://your-receiver.com` or `*`.
+ **option** - Optional, Instance's level configuration.
  + timeout - Default is 500 milliseconds.

```javascript
const mediator = new Mediator(window.opener, "*", {timeout: 100}); 
```
##### postMessage(data[, option]);
> To send message to target window. It returns promise.

  + **data** - Data to be sent to the another window.
  + **option** - Optional, Message level configuration.
    + timeout - Default is 500 milliseconds.
  
```javascript
mediator.postMessage("Hello, Alice", {timeout: 1000})
.then(response) => {
  console.log(response); // Hello, Bob
}).catch(error) => {
  console.log(error); // When timed out.
});
```
##### onMessage(callback);
> To set listener for incoming message.  

  + ***callback(message)*** - Function, which accept *`Message`* object.

*Message object has*
  + **data** - Received data.
  + ***reply(data)*** - Function, used to send reply message to sender.

```javascript
mediator.onMessage(function(message){
  if(message.data == "Are you sure?"){
    message.reply("Sure"); // to send reply message to sender
  }
});
```

## Licence
GNU General Public License v3.0

## Code
Typescript

## Author
*Sivanantham Gnanavel,*            
*iamsivanantham@gmail.com,*   
*Chennai, India.*
