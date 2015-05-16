define(function(require){
	var addImagePlugin = function(){};

	addImagePlugin.prototype.changeHtml = function(){
		$(this.dom_plugin).trigger("plugin.change");
	};

	addImagePlugin.prototype.getTemplate = function()
	{
		this.input_url = $("<input>", {type: "text", name: "url"});
		this.input_alt = $("<input>", {type: "text", name: "alt"});
		this.input_width = $("<input>", {type: "text", name: "width"});
		this.input_height = $("<input>", {type: "text", name: "height"});
		this.select_alignment = $("<select>", {name: "alignment"});

		this.select_alignment.append(
			$("<option>").text("None"),
			$("<option>").text("Left"),
			$("<option>").text("Right")
			);

		var div = $("<div>").append(
			$("<div>").addClass("col-md-12").append(
				$("<label>").append("URL", this.input_url)
				),
			$("<div>").addClass("col-md-12").append(
				$("<label>").append("Alternative Text", this.input_alt)
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Width", this.input_width)
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Height", this.input_height)
				),
			$("<div>").addClass("col-md-12").append(
				$("<label>").append("Alignment", this.select_alignment)
				)
			).addClass("row addImagePlugin");

		div.on("blur, change", "input, select", this.changeHtml.bind(this));

		return div;
	};
	addImagePlugin.prototype.onShow = function(plugin_template)
	{
	};


	addImagePlugin.prototype.loadState = function(old_state)
	{
		this.input_url.val(old_state.url);
		this.input_alt.val(old_state.alt);
		this.input_width.val(old_state.width);
		this.input_height.val(old_state.height);
		this.select_alignment.val(old_state.alignment);
	};
	addImagePlugin.prototype.saveState = function(){
		return {
			url: this.input_url.val(),
			alt: this.input_alt.val(),
			width: this.input_width.val(),
			height: this.input_height.val(),
			alignment: this.select_alignment.val()
		};
	};

	addImagePlugin.prototype.getCss = function()
	{
		return "";
	};
	addImagePlugin.prototype.getHtml = function()
	{
		var html = $("<div>");
		var img = $("<img>").appendTo(html);

		if(this.input_url.val() == "") return "";

		img.attr("src", this.input_url.val());
		img.attr("alt", this.input_alt.val());

		this.input_width.val() != "" && img.attr("width", this.input_width.val());
		this.input_height.val() != "" && img.attr("height", this.input_height.val());

		if(this.select_alignment.val() !== "None")
		{
			img.css("float", this.select_alignment.val())
		}


		return html.html();
	};

	addImagePlugin.prototype.destroy = function()
	{

	};
	addImagePlugin.prototype.onInit = function(plugin_template)
	{
		this.dom_plugin = plugin_template;
	};


	return addImagePlugin;
});