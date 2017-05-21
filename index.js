/*
 * External dependencies
 */
const fs = require('fs');
const kue = require('kue');
const colours = require('colors');
const request = require('request');
const progress = require('request-progress');
const feedparser = require('feedparser-promised');


/*
 * Init external dependencies
 */
const jobs = kue.createQueue();


/*
 * Config
 */
const urls = [{
  active: true,
  folder: './episodes/ngair',
  url: 'http://angularair.podbean.com/feed/',
}, {
  active: true,
  folder: './episodes/jsair',
  url: 'http://audio.javascriptair.com/feed/',
}, {
  active: false,
  folder: './episodes/iphreaks',
  url: 'https://feeds.feedwrench.com/iPhreaks.rss',
}, {
  active: false,
  folder: './episodes/rubyrogues',
  url: 'https://feeds.feedwrench.com/RubyRogues.rss',
}, {
  active: false,
  folder: './episodes/websecwarriors',
  url: 'https://feeds.feedwrench.com/websecwarriors.rss',
}, {
  active: true,
  folder: './episodes/javascriptjabber',
  url: 'https://feeds.feedwrench.com/JavaScriptJabber.rss',
}, {
  active: true,
  folder: './episodes/remoteconfs',
  url: 'https://feeds.feedwrench.com/remoteconfs-audio.rss',
}, {
  active: false,
  folder: './episodes/freelancers',
  url: 'https://feeds.feedwrench.com/TheFreelancersShow.rss',
}, {
  active: false,
  folder: './episodes/reactnativeradio',
  url: 'https://feeds.feedwrench.com/react-native-radio.rss',
}, {
  active: true,
  folder: './episodes/angular',
  url: 'https://feeds.feedwrench.com/AdventuresInAngular.rss',
}];


/*
 * Helpers
 */
const canDownload = (folder, name) => {
  const isArchived = fs.existsSync(`./archive/${name}`);
  const isDownloaded = fs.existsSync(`./episodes/${folder}/${name}`);

  return !(isArchived || isDownloaded);
};


/*
 * The dirty work
 */
urls.filter((url) => url.active).forEach((url) => {
  feedparser.parse(url.url).then((xml) => {
    xml.forEach((item) => {
      const folder = url.folder;
      const uri = item.enclosures[0].url;
      const name = uri.split('/').pop().replace('?rss=true', '');

      const config = {
        url: uri,
        title: name,
        filename: name,
        directory: folder,
        followRedirect: true,
      };

      if (canDownload(folder, name)) {
        console.log('how?');
        // jobs.create('Downloading:', config).removeOnComplete(true).save();
      }
    });
  });
});


/*
 * Start processing the queue
 */
jobs.process('Downloading:', 3, (job, done) => {
  progress(request.get(job.data), { throttle: 2000 })
    .on('end', done)
    .on('progress', (p) => job.progress(p.size.transferred, p.size.total))
    .pipe(fs.createWriteStream(`${job.data.directory}/${job.data.filename}`));
});


/*
 * Kick off the UI
 */
kue.app.listen(3000);
kue.app.set('title', 'Podcasts');


/*
 * Inform the user
 */
console.log();
console.log('----------------------------------------');
console.log('----------------------------------------');
console.log('                PODCASTS');
console.log('----------------------------------------');
console.log('App started at:');
console.log(colours.blue('http://localhost:3000'));
console.log('----------------------------------------');
console.log('----------------------------------------');
console.log();
