var helper = require("./test-helper.js"),
	EventedHandler = require("../lib/EventedHandler.js");

exports.dir = "./Events/";

exports.test = function(test, cb){
	var tokens = [];
	var cbs = {
		onopentag: function(name, attributes){
			tokens.push({event:"open", name: name, attributes: attributes});
		},
		onclosetag: function(name){
			tokens.push({event:"close", name: name});
		},
		ontext: function(text){
			tokens.push({event:"text", text: text});
		},
		oncomment: function(data){
			tokens.push({event:"comment", data:data});
		},
		onprocessinginstruction: function(name, data){
			tokens.push({event:"processing", name:name, data:data});
		},
		onend: function(){
			//deletes all tokens
			cb(null, tokens.splice(0));
		}
	};
	var handler = new EventedHandler(cbs, test.options.handler);
	helper.writeToParser(handler, test.options.parser, test.html);
}