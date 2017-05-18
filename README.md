# Podcasts manager

I have written this utility to manage the podcasts I listen to, because the less
time I spend in iTunes the happier and healthier I get.


## Pre-requisites

- Redis
- Node.js + NPM


## Get started

Make sure Redis is running, on a mac:

    $ redis-server /usr/local/etc/redis.conf

And all dependencies are met:

    $ npm install

Run it:

    $ node index.js

If it works correctly you should be able to navigate to:

    http://localhost:3000

Where you will see a queue of all mp3's being converted, you may manage your
queue via the interface or programatically (refer back to
[https://github.com/Automattic/kue](Kue)).


## Workflow

I envision using this utility like so:

- open `index.js` and set all podcasts you wish to sync to `true`
- run `$ node index.js` to download all the podcasts that you don't already have
- once complete, copy the files you want to your portable device (iPod, USB
thing, etc...)**
- run `$ node archive.js <path/to/file.mp3>` for all files you coppied across


## Notes

- You may add other feeds too. You may even open a pull request with newer
interesting dev podcasts to listen too. If you want of course, not forcing you.

- Archiving not only saves your disk space, it makes it easier to keep track of
what you alredy listened, obviously :D.

- Yes, you will still need iTunes if you are on a mac and want to copy files to
an iDevice like an iPod or iPhone (crucify me).

- When downloading new files, we look into the `episodes` and `archive` folders
so that we do not attempt to download files that have been downloaded already.

- When archiving a file via `archive.js` not only we move the file to the
archive folder, but also, we truncate the file, so that only it's reference
stays behind, thus, saving your disk space.

- Take good care of your queue, we do not cater for failures, the web interface
only 'names the shame'.


## Adding new podcasts

Instead of posting a recipe, I will just go about adding a new podcast called
`Foo`, from `http://foo.com/feed.rss`.

- So, we first want to create a new folder to keep the foo podcasts, so, create
a new folder under `episodes` called `foo`.

- Now, let's make sure that this folder is not ignored by git, go ahead and
create a new empty file inside the `foo` folder called `.gitkeep`

- Lastly, we need to add the reference to our config array inside `index.js`,
like so:

```js
/*
 * Config
 */
const urls = [{
  active: true,
  folder: './episodes/foo',
  url: 'http://foo.com/feed.rss',
}, {
...
```

- Done, now the next time you run `node index.js` your podcasts from the `foo`
feed will download automagically.
