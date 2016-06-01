# htmlparser2

[![NPM version](http://img.shields.io/npm/v/htmlparser2.svg?style=flat)](https://npmjs.org/package/htmlparser2)
[![Downloads](https://img.shields.io/npm/dm/htmlparser2.svg?style=flat)](https://npmjs.org/package/htmlparser2)
[![Build Status](http://img.shields.io/travis/fb55/htmlparser2/master.svg?style=flat)](http://travis-ci.org/fb55/htmlparser2)
[![Coverage](http://img.shields.io/coveralls/fb55/htmlparser2.svg?style=flat)](https://coveralls.io/r/fb55/htmlparser2)

A forgiving HTML/XML/RSS parser *plus a little extra*. The parser can handle streams and provides a callback interface.

## &#x1F195; romellem fork:

This fork includes forks from **htmlparser2**'s dependencies:

- **[domhandler](https://github.com/fb55/domhandler)**
- **[domelementtype](https://github.com/fb55/domelementtype)**
- **[dom-serializer](https://github.com/cheeriojs/dom-serializer)**

As well as
- **[cheerio](https://github.com/cheeriojs/cheerio)**

The changes in **htmlparser2** and **cheerio** as well as the dependencies mentioned above were all made to create a new special tag that the parser recognizes:

    <raw></raw>
    
It does what the name implies: it leaves any text within the `raw` tag untouched.

The original repo for **cheerio** would process the following string as such:

    // Original `cheerio` using original `htmlparser2`
    var $ = cheerio.load('<raw><?php echo "<strong>" . $hello . "</strong>"; ?></raw>');
    var processed_html = $.html();
    
    console.log(processed_html);
    // logs '<raw><?php echo "<strong>&quot; . $hello . &quot;&quot;; ?&gt;</raw>'
    
Notice how it converts some of the quotes to html entities, and also throws out the closing `strong` tag.

But with my custom additions, we now get

    // New `cheerio` which uses new `htmlparser2`
    var $ = cheerio.load('<raw><?php echo "<strong>" . $hello . "</strong>"; ?></raw>');
    var processed_html = $.html();
    
    console.log(processed_html);
    // logs '<?php echo "<strong>" . $hello . "</strong>"; ?>'
    
So, the `raw` tag preserved all characters inside, and removed itself after the fact.

> Note: I know that this is quote "bad" in the sense that by adding the special `raw` tag, this is no longer a strict "HTML parser." It is now an HTML parser *plus a little extra*. However, I had a need for this (specifically, using [Foundation for Emails](https://github.com/zurb/foundation-emails) in a more dynamic manner) so I made the necessary modifications to [inky's](https://github.com/zurb/inky) dependencies.
    
----

## Installation
	npm install htmlparser2

A live demo of htmlparser2 is available [here](http://demos.forbeslindesay.co.uk/htmlparser2/).

## Usage

```javascript
var htmlparser = require("htmlparser2");
var parser = new htmlparser.Parser({
	onopentag: function(name, attribs){
		if(name === "script" && attribs.type === "text/javascript"){
			console.log("JS! Hooray!");
		}
	},
	ontext: function(text){
		console.log("-->", text);
	},
	onclosetag: function(tagname){
		if(tagname === "script"){
			console.log("That's it?!");
		}
	}
}, {decodeEntities: true});
parser.write("Xyz <script type='text/javascript'>var foo = '<<bar>>';</ script>");
parser.end();
```

Output (simplified):

```
--> Xyz
JS! Hooray!
--> var foo = '<<bar>>';
That's it?!
```

## Documentation

Read more about the parser and its options in the [wiki](https://github.com/fb55/htmlparser2/wiki/Parser-options).

## Get a DOM
The `DomHandler` (known as `DefaultHandler` in the original `htmlparser` module) produces a DOM (document object model) that can be manipulated using the [`DomUtils`](https://github.com/fb55/DomUtils) helper.

The `DomHandler`, while still bundled with this module, was moved to its [own module](https://github.com/fb55/domhandler). Have a look at it for further information.

## Parsing RSS/RDF/Atom Feeds

```javascript
new htmlparser.FeedHandler(function(<error> error, <object> feed){
    ...
});
```

Note: While the provided feed handler works for most feeds, you might want to use  [danmactough/node-feedparser](https://github.com/danmactough/node-feedparser), which is much better tested and actively maintained.

## Performance

After having some artificial benchmarks for some time, __@AndreasMadsen__ published his [`htmlparser-benchmark`](https://github.com/AndreasMadsen/htmlparser-benchmark), which benchmarks HTML parses based on real-world websites.

At the time of writing, the latest versions of all supported parsers show the following performance characteristics on [Travis CI](https://travis-ci.org/AndreasMadsen/htmlparser-benchmark/builds/10805007) (please note that Travis doesn't guarantee equal conditions for all tests):

```
gumbo-parser   : 34.9208 ms/file ± 21.4238
html-parser    : 24.8224 ms/file ± 15.8703
html5          : 419.597 ms/file ± 264.265
htmlparser     : 60.0722 ms/file ± 384.844
htmlparser2-dom: 12.0749 ms/file ± 6.49474
htmlparser2    : 7.49130 ms/file ± 5.74368
hubbub         : 30.4980 ms/file ± 16.4682
libxmljs       : 14.1338 ms/file ± 18.6541
parse5         : 22.0439 ms/file ± 15.3743
sax            : 49.6513 ms/file ± 26.6032
```

## How does this module differ from [node-htmlparser](https://github.com/tautologistics/node-htmlparser)?

This is a fork of the `htmlparser` module. The main difference is that this is intended to be used only with node (it runs on other platforms using [browserify](https://github.com/substack/node-browserify)). `htmlparser2` was rewritten multiple times and, while it maintains an API that's compatible with `htmlparser` in most cases, the projects don't share any code anymore.

The parser now provides a callback interface close to [sax.js](https://github.com/isaacs/sax-js) (originally targeted at [readabilitySAX](https://github.com/fb55/readabilitysax)). As a result, old handlers won't work anymore.

The `DefaultHandler` and the `RssHandler` were renamed to clarify their purpose (to `DomHandler` and `FeedHandler`). The old names are still available when requiring `htmlparser2`, your code should work as expected.
