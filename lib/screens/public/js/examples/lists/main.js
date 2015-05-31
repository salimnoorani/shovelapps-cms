define(function(require){
	var lists = function(){};

	var icons = ["ion-monitor", "ion-play", "ion-images", "ion-map", "ion-gear-b","ion-music-note", "ion-radio-waves", "ion-earth", "ion-eye", "ion-person", "ion-location", "ion-link", "ion-chevron-left", "ion-information-circled", "ion-share"];
	var templates = [
		// {
		// 	title: "Element with title, content and bottom",
		// 	elms: {title: ".card-header", content: ".card-content-inner", bottom: ".card-footer"},
		// 	template: '<li class="card"><div class="card-header">Card Header</div><div class="card-content"><div class="card-content-inner">Card content</div></div><div class="card-footer">Card footer</div></li>'
		// },
		{
			title: "Element with title",
			elms: {title: ".item-title"},
			template: '<li class="item-content"><div class="item-inner"><div class="item-title">Item title</div></div></li>'
		},
		{
			title: "Element with title and label",
			elms: {title: ".item-title", label: ".item-after"},
			template: '<li class="item-content"><div class="item-inner"><div class="item-title">Item title</div><div class="item-after">Another label</div></div></li>'
		},
		{
			title: "Element with title, icon and label",
			elms: {title: ".item-title", label: ".item-after", icon: ".icon"},
			template: '<li class="item-content"><div class="item-media"><i class="icon"></i></div><div class="item-inner"><div class="item-title">Item title</div><div class="item-after">Another label</div></div></li>'
		},
		{
			title: "Group title",
			elms: {title: ".list-group-title"},
			template: '<li class="list-group-title">Title</li>'
		},
		{
			title: "Link with title",
			elms: {title: ".item-title", link: "a"},
			template: '<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title">Item title</div></div></a></li>'
		},
		{
			title: "Link with title and label",
			elms: {title: ".item-title", label: ".item-after", link: "a"},
			template: '<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title">Item title</div><div class="item-after">Label</div></div></a></li>'
		},
		{
			title: "Link with title, icon and label",
			elms: {title: ".item-title", label: ".item-after", link: "a", icon: ".icon"},
			template: '<li><a href="#" class="item-link item-content"><div class="item-media"><i class="icon"></i></div><div class="item-inner"><div class="item-title">Item title</div><div class="item-after">Label</div></div></a></li>'
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
		this.buttom_add = $("<button>", {type: "button", name: "add"}).text("Add").addClass("btn btn-primary");
		this.select_type = $("<select>", {name: "type"});
		this.input_name = $("<input>", {type: "text", placeholder: "Optional."});
		this.lists_elements = $("<div>").addClass("row col-md-12");


		for(var i in templates)
		{
			this.select_type.append($("<option>", {value: i}).text(templates[i].title));

		}
		var div = $("<div>").append(
			$("<div>").addClass("col-md-8").append(
				$("<label>").append("Type element", this.select_type)
				),
			$("<div>").addClass("col-md-4").append(
				this.buttom_add
				),
			$("<div>").addClass("col-md-12").append(
				$("<label>").append("List name", this.input_name)
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

		if(elm.info.elms.label)
		{
			var label = $("<input>", {type: "text", name: "label", placeholder: "Label"});

			if(elm.data.label)
				label.val(elm.data.label);

			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(label));
		}
		if(elm.info.elms.content)
		{
			var content = $("<textarea>", {name: "content", placeholder: "Content"});

			if(elm.data.content)
				content.val(elm.data.content);


			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(content));
		}
		if(elm.info.elms.bottom)
		{
			var bottom = $("<input>", {type: "text", name: "bottom", placeholder: "Bottom text"});

			if(elm.data.bottom)
				bottom.val(elm.data.bottom);


			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(bottom));
		}
		if(elm.info.elms.media)
		{
			var media = $("<input>", {type: "text", name: "media", placeholder: "Url media file"});

			if(elm.data.media)
				media.val(elm.data.media);


			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(media));
		}

		if(elm.info.elms.icon)
		{
			var select = $("<select>", {name: "icon"});

			for(var i in icons)
			{
				select.append($("<option>", {value: i}).text(icons[i]));
			}

			$("<div>").addClass("col-md-3").appendTo(div).append($("<label>").append("Icon"));
			$("<div>").addClass("col-md-9").appendTo(div).append($("<label>").append(select));


			if(elm.data.icon)
				select.val(elm.data.icon);
			else
				elm.data.icon = select.val();

			select = undefined;
		}

		if(elm.info.elms.link)
		{
			var select = $("<select>", {name: "link"});

			for(var i in this.Pages)
			{
				select.append($("<option>", {value: i}).text(this.Pages[i].title));
			}

			$("<div>").addClass("col-md-3").appendTo(div).append($("<label>").append("Link to"));
			$("<div>").addClass("col-md-9").appendTo(div).append($("<label>").append(select));


			if(elm.data.link)
				select.val(elm.data.link);
			else
				elm.data.link = select.val();
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
			if(name == "label")
			{
				elm.data.label = $(this).val();
			}
			if(name == "content")
			{
				elm.data.content = $(this).val();
			}
			if(name == "bottom")
			{
				elm.data.bottom = $(this).val();
			}
			if(name == "link")
			{
				elm.data.link = $(this).val();
			}
			if(name == "icon")
			{
				elm.data.icon = $(this).val();
			}
			if(name == "media")
			{
				elm.data.media = $(this).val();
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

		$("<div>").addClass("col-md-3").appendTo(div).append($("<button>", {type: "button", name: "remove"}).text("Remove").addClass("btn btn-xs btn-primary").on("click", remove));

		div.on("keyup, change, blur", "input, textarea, select", changeHtml);

		this.lists_elements.append(div);
	};


	lists.prototype.onShow = function(plugin_template)
	{
		var self = this;
		var changeHtml = function()
		{
			if(self.timerChange)
				clearTimeout(self.timerChange);

			self.timerChange = setTimeout(function(){self.changeHtml.call(self);}, 300);
		};

		this.input_name.on("keyup, blur", changeHtml);

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
		this.Pages = old_state.pages;
		this.elements = old_state.elements;
		this.input_name.val(old_state.name);
	};
	lists.prototype.saveState = function(){
		return {
			name: this.input_name.val(),
			elements: this.elements,
			pages: this.Pages
		};
	};

	lists.prototype.getCss = function()
	{
		return [this.path + "/framework7.min.css"];
	};

	lists.prototype.getHtml = function()
	{
		var html_final = $("<div>");
		var list = $("<div>").addClass("list-block");
		var ul = $("<ul>").appendTo(list).addClass("listWhite");
		var self = this;

		if(this.input_name.val() != "")
		{
			var name = this.input_name.val().trim();

			html_final.append('<div class="content-block-title">' + name + '</div>');
		}


		for(var i in self.elements)
		{
			var element = self.elements[i];
			var template = 	$(element.info.template);

			for(var key in element.info.elms)
			{
				if(key != "link" && key != "icon" && key != "media")
					template.find(element.info.elms[key]).html(element.data[key] || "");

				if(key == "link")
				{
					var index = element.data[key];
					var page = self.Pages[index];

					template.find(element.info.elms[key]).attr("href", "#" + page.id).addClass("tab-link");
				}

				if(key == "icon")
				{
					var index = element.data[key];
					var icon = icons[index];

					template.find(element.info.elms[key]).addClass(icon);
				}

				if(key == "media")
				{
					var src = element.data[key];

					template.find(element.info.elms[key]).attr("src", src);
				}

			}

			ul.append(template)
		}

		html_final.append(list);

		return html_final.html();
	};

	lists.prototype.loadPages = function()
	{
		var self = this;
		var client = new $.RestClient("/admin/");

		client.add("screens");
		client.screens.addVerb('main', 'PATCH');

		this.PagesLoaded = false;

		var filterData = function(data)
		{
			var a = [];
			for(var i in data)
			{
				a.push({title: data[i].title, id: data[i].id});
			}
			return a;
		};

		client.screens.read().done(function(data) { 
			self.PagesLoaded = true; 
			self.Pages = filterData(data);
		});
	};
	lists.prototype.onInit = function(plugin_template, path)
	{
		this.dom_plugin = plugin_template;
		this.elements = [];
		this.path = path;

		this.loadPages();
	};


	return lists;
});