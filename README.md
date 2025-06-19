NodeTetrinet
============

NodeTetrinet is an open source implementation of a Tetrinet clone with node.js, React and socket.io.

The original frontend was built with AngularJS and is being migrated to React. The lobby, game page and chat are now implemented with React components.

# Launch your own server

Checkout the project and type in a command line
>npm install

>npm start

Run the automated tests with:
>npm test

During development you can run:
>npm run dev

For an easier setup you can use docker

> docker run -d -p 3000:3000 xblaster/tetrinet

And it will rocks ;)

# TODO LIST

* add "special power" like in the original tetrinet to make the game more "fun"
* clean the code. Some part are quite weird
* do not set vars directly on socket

# License
Copyright (c) 2013 Jérôme WAX
Licensed under the MIT license.
