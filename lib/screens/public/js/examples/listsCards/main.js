define(function(require){
	var lists = function(){};

	var templates = [
		{
			title: "Card with title, subtitle and bottom text",
			elms: {title: ".title", subtitle: ".subtitle", bottom: ".bottom"},
			template: '<div class="content-block-agenda">  <div class="content-block-title"><p class="title"></p><b class="subtitle"></b></div><div class="content-block-inner no-padding-top"><div class="content-block-title-alt"><b class="bottom"></b></div>  </div> </div>'
		},
		{
			title: "Card with title, subtitle, media info and bottom text",
			elms: {title: ".title", subtitle: ".subtitle", bottom: ".bottom", media: ".media", mediaTitle: ".title-media"},
			template: '<div class="content-block-agenda">  <div class="content-block-title"><p class="title"></p><b class="subtitle"></b></div><div class="content-block-inner"><div class="content-block-agenda-alt"><div class="row no-gutter"><div class="col-33">        <img class="speakerPic media" src="img/icon.png">      </div>      <div class="col-66 agendaInfo">       <div><b class="title-media">Check In</b></div>      </div>     </div>    </div>   <div class="content-block-title-alt"><b class="bottom">8:00</b></div>  </div> </div>'
		}

	];

	var deleteArray = function(fn)
	{
		var array = [];

		if(typeof fn !== "function")
		{
			var old_data = fn;
			var new_func = function(v, i){ return v == old_data; };
			
			fn = new_func;
		}

		for(var i in this)
			!fn(this[i], i) && array.push(this[i]);

		return array;
	};


	lists.prototype.changeHtml = function(){
		$("body").trigger("plugin.change");
	};

	lists.prototype.getTemplate = function()
	{
		this.buttom_add = $("<button>", {type: "button", name: "add"}).text("Add Card").addClass("btn btn-primary");
		this.select_type = $("<select>", {name: "type"});
		this.lists_elements = $("<div>").addClass("row col-md-12");


		for(var i in templates)
		{
			this.select_type.append($("<option>", {value: i}).text(templates[i].title));

		}
		var div = $("<div>").append(
			$("<div>").addClass("col-md-8").append(
				$("<label>").append("Card type", this.select_type)
				),
			$("<div>").addClass("col-md-4").append(
				this.buttom_add
				),
			this.lists_elements
		).addClass("row listPlugin");


		this.buttom_add.on("click", this.addElementEvent.bind(this));

		return div;
	};

	lists.prototype.addElementEvent = function()
	{
		var select = this.select_type.val();
		var element = {};


		element.id = Math.random();
		element.type = select;
		element.info = templates[select];
		element.data = {};


		this.addElementUI(element);
		this.elements.push(element);
	};
	lists.prototype.addElementUI = function(elm)
	{
		var div = $("<div>"),
			title_element = $("<div>").addClass("col-md-12 title").appendTo(div),
			self = this;

		title_element.text(elm.info.title);


		if(elm.info.elms.title)
		{
			var title = $("<input>", {type: "text", name: "title", placeholder: "Title"});

			if(elm.data.title)
				title.val(elm.data.title);

			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(title));
		}
		if(elm.info.elms.subtitle)
		{
			var subtitle = $("<input>", {type: "text", name: "subtitle", placeholder: "Subtitle"});

			if(elm.data.subtitle)
				subtitle.val(elm.data.subtitle);

			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(subtitle));
		}
		if(elm.info.elms.media)
		{
			var media = $("<input>", {type: "text", name: "media", placeholder: "Url media file"});

			if(elm.data.media)
				media.val(elm.data.media);

			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(media));
		}
		if(elm.info.elms.mediaTitle)
		{
			var mediaTitle = $("<textarea>", {name: "mediaTitle", placeholder: "Media content"});

			if(elm.data.mediaTitle)
				mediaTitle.val(elm.data.mediaTitle);


			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(mediaTitle));
		}
		if(elm.info.elms.bottom)
		{
			var bottom = $("<input>", {type: "text", name: "bottom", placeholder: "Bottom text"});

			if(elm.data.bottom)
				bottom.val(elm.data.bottom);


			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(bottom));
		}



		var changeHtml = function()
		{
			if(self.timerChange)
				clearTimeout(self.timerChange);

			var name = $(this).attr("name");

			if(name == "title")
			{
				elm.data.title = $(this).val();
			}
			if(name == "subtitle")
			{
				elm.data.subtitle = $(this).val();
			}
			if(name == "mediaTitle")
			{
				elm.data.mediaTitle = $(this).val();
			}
			if(name == "media")
			{
				elm.data.media = $(this).val();
			}
			if(name == "bottom")
			{
				elm.data.bottom = $(this).val();
			}



			self.timerChange = setTimeout(function(){self.changeHtml.call(self);}, 300);
		};

		var remove = function()
		{
			var new_array = deleteArray.call(self.elements, function(e){ return e.id === elm.id; });

			self.elements = new_array;
			self.changeHtml.call(self);

			div.fadeOut(function(){ $(this).remove(); });
		};

		$("<div>").addClass("col-md-5").appendTo(div).append($("<button>", {type: "button", name: "remove"}).text("Remove card").addClass("btn btn-xs btn-primary").on("click", remove));

		div.on("keyup, change, blur", "input, textarea, select", changeHtml);

		this.lists_elements.append(div);
	};


	lists.prototype.onShow = function(plugin_template)
	{
		if(this.elements.length)
		{
			for(var i in this.elements)
			{
				this.addElementUI(this.elements[i]);
			}
		}
	};


	lists.prototype.loadState = function(old_state)
	{
		this.elements = old_state.elements;
	};
	lists.prototype.saveState = function(){
		return {
			elements: this.elements
		};
	};

	lists.prototype.getCss = function()
	{
		return [this.path + "/framework7.min.css", this.path + "/cards.css"];
	};

	lists.prototype.getHtml = function()
	{
		var html_final = $("<div>");
		var list = $("<div>").addClass("listaAgenda");
		var self = this;


		for(var i in self.elements)
		{
			var element = self.elements[i];
			var template = 	$(element.info.template);

			for(var key in element.info.elms)
			{
				if(key != "media")
					template.find(element.info.elms[key]).html(element.data[key] || "");

				if(key == "media")
				{
					var src = element.data[key];

					template.find(element.info.elms[key]).attr("src", src);
				}

			}

			list.append(template)
		}

		html_final.append(list);

		return html_final.html();
	};

	lists.prototype.onInit = function(plugin_template, path)
	{
		this.dom_plugin = plugin_template;
		this.elements = [];
		this.path = path;
	};


	return lists;
});