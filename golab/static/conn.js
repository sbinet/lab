/*
Copyright 2013 Martin Schnabel. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.
*/
define(["json2", "backbone"], function() {

if (!window["WebSocket"]) {
	return null;
}

var Conn = Backbone.Model.extend({
	constructor: function(data, opts) {
		this.wsconn = null;
		Backbone.Model.prototype.constructor.call(this, data, opts);
	},
	connect: function() {
		var c = this;
		if (c.urlRoot) {
			c.wsurl = c.url();
		}
		if (!c.wsurl) {
			c.wsurl = "ws://"+ location.host +"/ws";
		}
		console.log("connect", c.wsurl);
		c.trigger("connect", c.wsurl);
		var ws = c.wsconn = new WebSocket(c.wsurl);
		ws.onopen = function(e) {
			c.trigger("open", e);
		};
		ws.onclose = function(e) {
			c.trigger("close", e);
			c.wsconn = null;
		};
		ws.onmessage = function(e) {
			var msg = JSON.parse(e.data)
			console.log("msg", msg);
			c.trigger("msg", msg);
			c.trigger("msg:"+ msg.Head, msg.Data);
		};
		ws.onerror = function(e) {
			c.trigger("error", e.message);
		};
	},

});

return new Conn();

});