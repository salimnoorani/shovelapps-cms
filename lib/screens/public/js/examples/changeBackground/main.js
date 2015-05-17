define(function(require){
	var changeBackground = function(){};

	changeBackground.prototype.changeHtml = function(){
		$(this.dom_plugin).trigger("plugin.change");
	};

	changeBackground.prototype.getTemplate = function()
	{
		this.input_image = $("<input>", {type: "text", name: "image"});
		this.select_alignment = $("<select>", {name: "alignment"});
		this.select_type = $("<select>", {name: "type"});

		this.select_alignment.append(
			$("<option>").text("Left"),
			$("<option>").text("Center"),
			$("<option>").text("Right")
			);

		this.select_type.append(
			$("<option>").text("Normal"),
			$("<option>").text("Cover"),
			$("<option>").text("Mosaic")
			);

		var div = $("<div>").append(
			$("<div>").addClass("col-md-12 title").append(
				"Change background color"
				).css("margin-bottom", 20),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Select the color")
				),
			$("<div>").addClass("col-md-6").append(
				$("<div>").addClass("hereSelector")
				),
			$("<div>").addClass("col-md-12 title").append(
				"Change background image"
				).css("margin", "20px 0"),
			$("<div>").addClass("col-md-12").append(
				$("<label>").append("URL image", this.input_image)
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Alignment", this.select_alignment)
				),
			$("<div>").addClass("col-md-6").append(
				$("<label>").append("Type", this.select_type)
				)
			).addClass("row changeBackground");

		div.on("blur, change", "input, select", this.changeHtml.bind(this));

		return div;
	};
	changeBackground.prototype.onShow = function(plugin_template)
	{
	};


	changeBackground.prototype.loadState = function(old_state)
	{
		if(this.picker === undefined)
		{
			var self = this;
			setTimeout(function(){self.loadState(old_state);}, 30);
			return;
		}
		this.input_image.val(old_state.img);
		this.select_alignment.val(old_state.alg);
		this.select_type.val(old_state.type);

		if(old_state.color)
		{
			this.color_select = old_state.color;
			this.picker.colpickSetColor(old_state.color);
		}

		this.changeHtml();

	};
	changeBackground.prototype.saveState = function(){
		return {
			img: this.input_image.val(),
			alg: this.select_alignment.val(),
			type: this.select_type.val(),
			color: this.color_select !== undefined? this.color_select : false
		};
	};

	changeBackground.prototype.getHtml = function()
	{
		var html = [];

		html.push('<style type="text/css"> body { ');

		if(this.color_select !== undefined)
		{
			html.push('background-color: #' + this.color_select + ';');
		}
		
		if(this.input_image.val().trim() !== "")
		{
			html.push('background-image: url(\'' + this.input_image.val().trim() + '\');');
			html.push("background-position: " + this.select_alignment.val() + ";");

			switch(this.select_type.val())
			{
				case "Cover":
				html.push("background-size: cover;");
				break;
				case "Mosaic":
				html.push("background-repeat: repeat;");
				break;
				case "Normal":
				html.push("background-repeat: no-repeat;;");
				break;
			}
		}


		html.push('} </style>');

		return html.join('');
	};

	changeBackground.prototype.destroy = function()
	{

	};
	changeBackground.prototype.changeColor = function(hsb,hex,rgb,el){
		this.color_select = hex;

		this.changeHtml();
	};
	changeBackground.prototype.ready = function(){
		if($.fn.colpick === undefined){
			setTimeout(this.ready.bind(this), 300);
			return;
		}

		this.picker = this.dom_plugin.find(".hereSelector:first").colpick({
			layout: 'hex',
			submit: true,
			flat:true,
			submitText: "OK",
			onSubmit: this.changeColor.bind(this)
		});

		this.picker.colpickSetColor("FFFFFF");
	};
	changeBackground.prototype.onInit = function(plugin_template, path)
	{
		this.dom_plugin = plugin_template;
		this.path = path;

		$.getScript(path + "/colpick.js", this.ready.bind(this));
	};


	return changeBackground;
});