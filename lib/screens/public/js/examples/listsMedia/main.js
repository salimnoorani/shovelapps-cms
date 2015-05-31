define(function(require){
	var lists = function(){};

	var templates = [
		{
			title: "Media link with title and subtitle",
			elms: {title: ".item-title", subtitle: ".item-subtitle", media: ".media", link: "a"},
			template: '<li class="contact-item"><a href="#" class="item-link create-page-speaker"><div class="item-content"><div class="item-media"><img src="img/speakers/jaydson-gomes.jpg" width="44" class="media"></div><div class="item-inner"><div class="item-title-row"><div class="item-title"></div></div><div class="item-subtitle"></div></div>        </div> </a></li>'
		},
		{
			title: "Group title",
			elms: {title: ".list-group-title"},
			template: '<li class="list-group-title">Title</li>'
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

		if(elm.info.elms.media)
		{
			var media = $("<input>", {type: "text", name: "media", placeholder: "Url media file"});

			if(elm.data.media)
				media.val(elm.data.media);


			$("<div>").addClass("col-md-12").appendTo(div).append($("<label>").append(media));
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
			if(name == "link")
			{
				elm.data.link = $(this).val();
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
		var list = $("<div>").addClass("list-block media-list contacts-list searchbar-found");
		var ul = $("<ul>").appendTo(list).addClass("listaSpeakers listWhite");
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
				if(key != "link" && key != "media")
					template.find(element.info.elms[key]).html(element.data[key] || "");

				if(key == "link")
				{
					var index = element.data[key];
					var page = self.Pages[index];

					template.find(element.info.elms[key]).attr("href", "#" + page.id).addClass("tab-link");
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