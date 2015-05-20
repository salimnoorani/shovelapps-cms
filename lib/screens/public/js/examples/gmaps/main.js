define(function(require){
	var gmaps = function(){};

	gmaps.prototype.changeHtml = function(){
		$(this.dom_plugin).trigger("plugin.change");
	};

	gmaps.prototype.getTemplate = function()
	{
		this.input_lat = $("<input>", {type: "text", name: "lat"});
		this.input_lng = $("<input>", {type: "text", name: "lng"});
		this.input_width = $("<input>", {type: "text", name: "width", value: "100%"});
		this.input_height = $("<input>", {type: "text", name: "height", value: "300"});
		this.checkbox_geolocation = $("<input>", {type: "checkbox", name: "geolocation"});
		this.range_zoom = $("<input>", {type: "range", name: "zoom", max: 22, min: 0, value: 16});


		var div = $("<div>").append(
			$("<div>").addClass("col-md-12 title").append(
				"Center map"
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Lat", this.input_lat)
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Lng", this.input_lng)
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
			$("<div>").addClass("col-md-12").append(
				$("<label>").append("Zoom level", this.range_zoom)
				)/*,
			$("<div>").addClass("col-md-12 title").append(
				"Settings"
				)*/

			).addClass("row gmaps");

		div.on("blur, change", "input", this.changeHtml.bind(this));

		return div;
	};
	gmaps.prototype.onShow = function(plugin_template){};



	gmaps.prototype.loadState = function(old_state)
	{
		this.input_lat.val(old_state.lat);
		this.input_lng.val(old_state.lng);
		this.input_width.val(old_state.width);
		this.input_height.val(old_state.height);
		this.checkbox_geolocation.prop("checked", old_state.geolocation);
		this.range_zoom.val(old_state.zoom);
	};
	gmaps.prototype.saveState = function(){
		return {
			lat: this.input_lat.val(),
			lng: this.input_lng.val(),
			width: this.input_width.val(),
			height: this.input_height.val(),
			geolocation: this.checkbox_geolocation.prop("checked"),
			zoom: this.range_zoom.val()
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

		if(this.input_lat.val() == "" || this.input_lng.val() == "")
			return "";

		var map_var = "gmaps_" + Math.random().toString().substr(2);
		var map_callback = "callback_" + map_var;
		var map_settings = {};



		div.attr("id", map_var).css({width: this.input_width.val(), height: this.input_height.val(), "background": "#EEEEEE"});

		html.push(div.prop('outerHTML'));


		map_settings.lat = this.input_lat.val();
		map_settings.lng = this.input_lng.val();
		map_settings.zoom = parseInt(this.range_zoom.val());
		map_settings.div = "#" + map_var;
		map_settings.el = "#" + map_var;


		script.push('function ' + map_callback + '(){');

		var settings = JSON.stringify(map_settings);
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
	};


	return gmaps;
});