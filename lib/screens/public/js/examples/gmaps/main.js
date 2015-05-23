define(function(require){
	var gmaps = function(){};

	var deleteArray = function(fn)
	{
		var array = [];

		if(typeof fn !== "function")
		{
			var old_data = fn;

			fn = function(v){ return v == old_data;};
		}

		for(var i in this)
			!fn(this[i], i) && array.push(this[i]);

		return array;
	};

	gmaps.prototype.changeHtml = function(){
		$("body").trigger("plugin.change");
	};

	gmaps.prototype.getTemplate = function()
	{
		this.div_map_center = $("<div>").addClass("map");
		this.input_width = $("<input>", {type: "text", name: "width", value: "100%"});
		this.input_height = $("<input>", {type: "text", name: "height", value: "300"});
		this.checkbox_geolocation = $("<input>", {type: "checkbox", name: "geolocation"});
		this.div_list_markers = $("<div>").addClass("markers row");


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
			$("<div>").addClass("col-md-12").append(
				this.div_list_markers
				)
			).addClass("row gmaps");

		div.find("input").on("blur, change", this.changeHtml.bind(this));

		return div;
	};
	gmaps.prototype.addMarkerUI = function(markerSettings)
	{
		var self = this;
		var textarea_info = $("<textarea>", {name: "information", placeholder: "Optional. Information of the marker."});
		var button_delete = $("<button>", {name: "delete", type: "button"}).text("Delete marker").addClass("btn btn-xs btn-primary");

		var static_map = GMaps.staticMapURL({
		  size: [100, 100],
		  lat: markerSettings.lat,
		  lng: markerSettings.lng, 
		  markers: [{lat: markerSettings.lat, lng: markerSettings.lng}]
		});

		var template = $("<div>").data("id", markerSettings.IdMarker).append(
		$("<div>").addClass("col-md-12 title").append(
			"Marker"
			),
		$("<div>").addClass("col-md-3").append(
			$("<img>", {src: static_map}).css({width: "100%", height: "100%", margin: "15px 0"})
		),

		$("<div>").addClass("col-md-9").append(
			$("<label>").append("Information", textarea_info)
			),
		$("<div>").addClass("col-md-6").append(button_delete)
		);

		if(markerSettings.infoWindow && markerSettings.infoWindow.content)
		{
			textarea_info.val(markerSettings.infoWindow.content);
		}

		var change_settings = function()
		{
			var elm = $(this);

			if(elm.attr("name") == "information")
			{
				markerSettings.infoWindow = elm.val() != ""? {content: elm.val()} : undefined;
			}

			self.reMarkers.call(self);
		};
		var delete_marker = function()
		{
			template.fadeOut(function(){
				$(this).remove();

				var new_markers = deleteArray.call(self.markers, function(m, i){ return m.IdMarker == markerSettings.IdMarker;});

				self.markers = new_markers;
				self.reMarkers.call(self);
			});
		};

		textarea_info.on("blur", change_settings);
		button_delete.on("click", delete_marker);

		this.div_list_markers.append(template);
	};
	gmaps.prototype.addMarker = function(e)
	{
		var latLng = e.latLng;
		var markerSettings = {lat: latLng.lat(), lng: latLng.lng()};
		var marker_id = Math.random();

		markerSettings.IdMarker = marker_id;


		this.markers.push(markerSettings);
		this.addMarkerUI(markerSettings);
		this.reMarkers.call(this);
	};
	gmaps.prototype.reMarkers = function()
	{
		this.changeHtml.call(this);

		this.gmaps_center.removeMarkers();
		this.gmaps_center.addMarkers(this.markers);
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


		if(this.markers && this.markers.length > 0)
		{
			for(var i in this.markers)
			{
				this.addMarkerUI(this.markers[i]);
			}

			this.reMarkers.call(this);
		}

		setTimeout(self.changeHtml.bind(self), 100);
	};



	gmaps.prototype.loadState = function(old_state)
	{
		console.log("old_state", old_state);
		this.markers = old_state.markers;
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
			settings: this.settings,
			markers: this.markers
		};
	};

	gmaps.prototype.getCss = function()
	{
		return "";
	};

	gmaps.prototype.getJs = function()
	{
		return ["http://maps.google.com/maps/api/js?sensor=true", "/admin/" + this.path + "/gmaps.js"];
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

		if(this.markers.length > 0)
		{
			var markers = JSON.stringify(this.markers);

			script.push(map_var +'.addMarkers(' + markers + ');');
		}

		script.push('var resize = function(){if(typeof $ == "undefined") { setTimeout(resize, 6000); console.log("no jquery yet"); return;};console.log("RESIZE MAP"); $("#' + map_var +'").width("'+this.input_width.val()+'").height("'+this.input_height.val()+'");setTimeout(function(){google.maps.event.trigger(' + map_var +', "resize");}, 2000); console.log($("#' + map_var +'").height());}; ');
		script.push("google.maps.event.addDomListener(window, 'load', function(){ setTimeout(resize, 6000);});");
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