## BaristaJS [![Build Status](https://travis-ci.org/danascheider/barista.svg?branch=dev)](https://travis-ci.org/danascheider/barista)  [![Code Climate](https://codeclimate.com/github/danascheider/barista/badges/gpa.svg)](https://codeclimate.com/github/danascheider/barista)
Fixtures for testing Backbone.js apps. Currently in beginning stages of development.
The `example` directory contains a small Backbone.js app that is being used to test the
framework.

### Usage
#### Installing Barista
Install Barista using NPM:
    npm install baristajs

#### Configuring Barista
Configuring Barista is easy but relies on a couple of conventions:
  1. Your app must be represented as an object. In Node or iojs:
         `var App = require('./app.min.js')`
  2. All models and collections must be namespaced to the app:
         `App.TodoItemModel = Backbone.Model.extend({ ... });`
  3. All models must include the word "Model" or "model" in their name
  4. All collections must include the words "Collection" or "collection"
     in their name

If your app follows these conventions, then just put this in your spec helper file or wherever
you keep your test configuration:
    var Barista = require('baristajs'),
        App     = require('../app.js');

    Barista.config(app);

That's it! Now, all your models and collections have a corresponding model or collection
namespaced to Barista. So, if your model was called `App.TodoItemModel`, then there is a
Barista model called `Barista.TodoItemModel`.

In order to ensure a clean environment with every test, it is recommended that you add
this to your `afterEach` block (if using Jasmine), or the analogous block in the framework
you are using (e.g., `after('each')`, etc.):
    Barista.destroy();

The global `Barista` object tracks its models and collections, so you can destroy all of them
easily by calling this method.

#### How Barista Models and Collections Work
The `Barista.Model` and `Barista.Collection` objects extend `Backbone.Model` and 
`Backbone.Collection`, respectively. They replace Backbone methods that interact with the
database with corresponding methods that change the state of the object the way the Backbone
method does (i.e., adding or removing items from a collection, etc.), but without making
Ajax requests, interacting with a database, or altering the environment.

The global `Barista` object keeps track of all the models and collections that currently exist.
This makes it easy to destroy the models and collections in one fell swoop using 
`Barista.destroy()`. Alternatively, you can use the `destroy` method on individual models and
collections to remove all references from them, so they will be garbage collected.

#### Contributing
This is a very new framework and was created for me to use on one of my [other projects](https://github.com/danascheider/canto-front-end). PRs are gratefully accepted, but I do ask that they be accompanied by passing tests. I'm also very appreciative of any issue reports. If you are experiencing errors, please include the full text of the error message you are receiving along with any parts of your code that may possibly be relevant. 

I know that this version of Barista is very limited. I am running my tests using Jasmine under iojs
with jsdom (and PhantomJS to test jQuery and CSS), so this is the environment where it will work best right now. If you can submit a PR that makes Barista handle more cases, that is awesome.