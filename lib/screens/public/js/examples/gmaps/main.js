define(function(require){
	var gmaps = function(){};

	gmaps.prototype.changeHtml = function(){
		$(this.dom_plugin).trigger("plugin.change");
	};

	gmaps.prototype.getTemplate = function()
	{
		this.div_map_center = $("<div>").addClass("map");
		this.input_width = $("<input>", {type: "text", name: "width", value: "100%"});
		this.input_height = $("<input>", {type: "text", name: "height", value: "300"});
		this.checkbox_geolocation = $("<input>", {type: "checkbox", name: "geolocation"});
		this.div_list_markers = $("<div>").addClass("markers");


		var div = $("<div>").append(
			$("<div>").addClass("col-md-12 title").append(
				"Center & Zoom map"
				),
			$("<div>").addClass("col-md-12").append(
				this.div_map_center
				),
			$("<div>").addClass("col-md-12").append(
				$("<label>").append(this.checkbox_geolocation, "Use geolocation")
				),
			$("<div>").addClass("col-md-12 title").append(
				"Size & Zoom"
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Width", this.input_width)
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Height", this.input_height)
				),
			$("<div>").addClass("col-md-12 title").append(
				"Markers"
				),
			$("<div>").addClass("col-md-12").append(
				this.div_list_markers
				)
			).addClass("row gmaps");

		div.on("blur, change", "input", this.changeHtml.bind(this));

		return div;
	};
	gmaps.prototype.addMarker = function(e)
	{
		var latLng = e.latLng;
		var markerSettings = {lat: latLng.lat(), lng: latLng.lng()};

		var title = prompt("Title");

		if(!title) return;

		var info = prompt("Information");

		markerSettings.title = title;

		if(info)
			markerSettings.infoWindow = {content: info};
		else
			info = "-";


		this.gmaps_center.addMarker(markerSettings);

		this.markers.push(markerSettings);

		this.div_list_markers.append(
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Title"), title
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Information"), info
				)
			);

	};
	gmaps.prototype.onShow = function()
	{
		if(typeof GMaps == "undefined")
		{
			setTimeout(this.onShow.bind(this),100);

			return;
		}
		var self = this;


		var temp = JSON.parse(JSON.stringify(this.settings));
		var final_settings = $.extend(temp, {el: this.div_map_center.get(0)})

		var timer = false;

		final_settings.dragend = final_settings.zoom_changed = function(e) {

			if(timer)
				clearTimeout(timer);

			timer = setTimeout(function(){
				self.changeHtml();
			}, 200);

			self.settings.lat = e.center.lat();
			self.settings.lng = e.center.lng();
			self.settings.zoom = e.zoom;
		};

		final_settings.click = self.addMarker.bind(self);

		this.gmaps_center = new GMaps(final_settings);

		setTimeout(self.changeHtml.bind(self), 100);
	};



	gmaps.prototype.loadState = function(old_state)
	{
		this.settings = old_state.settings;
		this.input_width.val(old_state.width);
		this.input_height.val(old_state.height);
		this.checkbox_geolocation.prop("checked", old_state.geolocation);
	};
	gmaps.prototype.saveState = function(){
		return {
			width: this.input_width.val(),
			height: this.input_height.val(),
			geolocation: this.checkbox_geolocation.prop("checked"),
			settings: this.settings
		};
	};

	gmaps.prototype.getCss = function()
	{
		return "";
	};

	gmaps.prototype.getJs = function()
	{
		return ["http://maps.google.com/maps/api/js?sensor=true", this.path + "/gmaps.js"];
	};
	
	gmaps.prototype.getHtml = function()
	{
		var html = [];
		var script = [];
		var div = $("<div>");

		var map_var = "gmaps_" + Math.random().toString().substr(2);
		var map_callback = "callback_" + map_var;
		var map_settings = {};



		div.attr("id", map_var).css({width: this.input_width.val(), height: this.input_height.val(), "background": "#EEEEEE"});

		html.push(div.prop('outerHTML'));





		map_settings.lat = this.settings.lat;
		map_settings.lng = this.settings.lng;
		map_settings.zoom = parseInt(this.settings.zoom);
		map_settings.div = "#" + map_var;
		map_settings.el = "#" + map_var;


		script.push('function ' + map_callback + '(){');

		var settings = JSON.stringify(map_settings);


		if(map_settings.lat === undefined || map_settings.lng === undefined)
			return "Map error";

		script.push('var ' + map_var + ' = new GMaps(' + settings + ');');


		if(this.checkbox_geolocation.is(":checked"))
		{
			script.push('GMaps.geolocate({ success: function(position) {' + map_var +'.setCenter(position.coords.latitude, position.coords.longitude);}});');
		}

		script.push('};' + map_callback + '();');


		html.push('<script');
		html.push('>');
		html.push(script.join(''));
		html.push('<');
		html.push('/');
		html.push('script');
		html.push('>');

		return html.join('');
	};

	gmaps.prototype.destroy = function()
	{

	};
	gmaps.prototype.onInit = function(plugin_template, path)
	{
		this.dom_plugin = plugin_template;
		this.path = path;

		this.settings = {lat: -12.043333, lng: -77.028333, zoom: 15};
		this.markers = [];

		
		if(window.google !== undefined && typeof GMaps !== "undefined") return;


		window.pluginGmapsLoadGoogleApi = function(){
			if(typeof GMaps === "undefined")
				$('<script>').appendTo("head").attr('src', path + "/gmaps.js");

			window.pluginGmapsLoadGoogleApi = undefined;
		};

		if(window.google === undefined)
			$('<script>').appendTo("head").attr('src', "https://maps.googleapis.com/maps/api/js?v=3&libraries=places&callback=pluginGmapsLoadGoogleApi");
		else
			window.pluginGmapsLoadGoogleApi();
	};


	return gmaps;
});