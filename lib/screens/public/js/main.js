/*
	
	Cada plugin define un archivo central javascript y css que necesitaran para mostrarse en el create screen.

	Cada plugin debe tener para poder mostrarse en el create screen:
		- getTemplate: da el template para mostrar en la configuracion del mismo, interacciones, etc.
		- saveState: retorna un objeto para guardar su estado actual
		- loadState: carga un estado previo guardado
		- onInit: se ejecuta al ser inicializada una instancia del plugin en el panel de create screen (no necesariamente ya esta a la vista)
		- onShow: se ejecuta cuando es mostrado al usuario en el panel de create screen
		- destroy: se ejecuta cuando se borra una instancia del plugin
		- getHtml: es el html final que generara el plugin
		- getCss: archivo/archivos css para mostrar el html final 
		- getJs: archivo/archivos js para mostrar el html final

	Cada plugin es independiente entre si, cada instancia de un plugin es independiente de las demas,
	cada instancia es responsable de su estado, de generar su objeto de estado y de poder cargarse un estado previo. 

	Al apretar Save en el screen, el CMS debe:
		- Pedir el estado de cada instancia de plugins del screen y guardarlos (saveState)
		- Pedir el html y guardarlo (getHtml)

	Al cargar el Create Screen, el CMS debe:
		- Listar las instancias de plugins almacenadas y retornar al estado de los mismos (loadState)


	# Pedir los estados de cada plugin:
		var states = [];
		var plugins = $(".plugin");

		for(var i = 0; i < plugins.length; i++)
		{
			var id_plugin = plugins.eq(i).data("plugin-id");
			var plugin = plugins.eq(i).data("plugin");

			states.push({id: id_plugin, state: plugin.saveState()});
		}

	# Restaurar estados previos

		for(var i in states)
		{
			var plugin = states[i];

			window.ShovelApps.Plugins.addPlugin(plugin.id, false, plugin.state);
		}

	# HTML final del screen
		var html = "";
		var plugins = $(".plugin");

		for(var i = 0; i < plugins.length; i++)
		{
			var plugin = plugins.eq(i).data("plugin");

			html += plugin.getHtml();
		}

	Ejemplos:
		- shovelapps-cms\lib\screens\public\js\examples\htmlPlugin.js
		- shovelapps-cms\lib\screens\public\js\examples\formPlugin.js
		- shovelapps-cms\lib\screens\public\js\examples\addImagePlugin\main.js

		*/


// Hasta que todo sea plugin, el textarea del comienzo es lanzado asi
$(function(){
	$( 'textarea' ).ckeditor();
});



(function(listPlugins){
	if(listPlugins === undefined || require === undefined) return;

	if(!window.ShovelApps)
		window.ShovelApps = {};

	if(!("Plugins" in window.ShovelApps))
		window.ShovelApps.Plugins = {};

	var templatePlugin = $("<div>").addClass("plugin").append(
		$("<div>").addClass("header").append(
			$("<h6>"),
			$("<a>", {href: "#"}).addClass("delete").text("x")
			),
		$("<div>").addClass("sort").append(
			$("<a>", {href: "#"}).addClass("up-plugin").html('<i class="glyphicon glyphicon-chevron-up"></i>'),
			$("<a>", {href: "#"}).addClass("down-plugin").html('<i class="glyphicon glyphicon-chevron-down"></i>')
			),
		$("<div>").addClass("content")
		);

	var checkIframe = function(){
		var html = getScreenHtml();
		var resources = getScreenResources();

		var href_base = $("base").length ?  $("base").attr("href") : "";

		if(href_base != "" && href_base.substr(0,4).toLocaleLowerCase() !== "http" && !!window.location.origin)
		{
			href_base = window.location.origin + (href_base.substr(0,1) == "/" ? "" : "/") + href_base;
		}

		resources.css.reverse();
		resources.js.reverse();

		for(var i in resources.css)
			html = $('<link>').attr({type : 'text/css', rel : 'stylesheet', async: true}).attr('href', resources.css[i]).prop('outerHTML') + html;

		 for(var i in resources.js)
		 	html = $('<script>').attr('src', resources.js[i]).prop('outerHTML') + html;

		if(href_base != "")
			html = $("<base>", {href: href_base}).prop('outerHTML') + html;


		var final_html = html.replace(new RegExp(/\n/g), "");

		 $(".iframe-demo").attr("src", "data:text/html;charset=utf-8," + encodeURIComponent(final_html));
	};

	var checkSortButton = function(){
		var plugins = $(".screen-plugins .plugin:not(.no-plugin)"), l = plugins.length;


		plugins.each(function(i){
			var up = $(this).find(".up-plugin");
			var down = $(this).find(".down-plugin");

			$(this).data("position", i);

			if(i == 0)
				up.addClass("disabled");
			else
				up.removeClass("disabled");

			if(i == l-1)
				down.addClass("disabled");
			else
				down.removeClass("disabled");

		});
	};


	var getPluginData = function(id)
	{
		for(var i in listPlugins)
		{
			for(var j in listPlugins[i].plugins)
			{
				if(listPlugins[i].plugins[j].id == id)
					return listPlugins[i].plugins[j];
			}
		}
		return false;
	};

	var resolveCSSAsync = function(css)
	{
		if(window.resolveCSS === undefined)
			window.resolveCSS = {};

		if(css in window.resolveCSS || css == "")
			return;

		$('<link>').appendTo('head').attr({type : 'text/css', rel : 'stylesheet', async: true}).attr('href', css);

		window.resolveCSS[css] = true;
	};

	var addPlugin = window.ShovelApps.Plugins.addPlugin = function(id, target, state, callback){
		var data = getPluginData(id);
		var template = templatePlugin.clone();
		var randomId = Math.random();

		try
		{

			if(!data) throw "Undefined plugin data.";


			if(data.main.css !== "")
				resolveCSSAsync(data.main.css);

			template.hide().data("id", randomId).data("plugin-id", id).find("h6:first").text(data.name);


			require([data.main.js], function(p){
				var plugin = new p();
				var plugin_template = plugin.getTemplate();
				var fadeTime = 300;
				var path = data.main.js.split(/[\\|\/]/);

				path.pop();
				path = path.join("/");

				template.data("plugin", plugin).data("path", path).find(".content:first").append(plugin_template);


				if("onInit" in plugin && typeof plugin.onInit == "function")
					plugin.onInit(template, path);


				if(target)
				{
					target.type == "after" && template.insertAfter(target.elm);
					target.type == "before" && template.insertBefore(target.elm);
					target.type == "append" && template.appendTo(target.elm);

					fadeTime = target.showTime;
				}
				else
					$(".screen-plugins").append(template);


				template.fadeIn(fadeTime, function(){
					if(!!state && "loadState" in plugin && typeof plugin.loadState == "function")
						plugin.loadState(state);

					if("onShow" in plugin && typeof plugin.onShow == "function")
						plugin.onShow(template);

					if(!!state)
						template.trigger("plugin.change");

					if(callback && typeof callback == "function")
						callback(template);
				});



				checkSortButton();

			});
		}
		catch(error)
		{
			alert("Error to load plugin!");

			console.log("ERROR PLUGIN", error);
		}

	};

	var removePlugin = window.ShovelApps.Plugins.removePlugin = function(elm, time){
		var plugin = elm.data("plugin");

		if("destroy" in plugin)
			plugin.destroy();

		elm.fadeOut((time || 300), function(){ elm.remove(); $(".plugin:last, body").trigger("plugin.change"); checkSortButton(); });
	};

	var getScreenHtml = window.ShovelApps.Plugins.getScreenHtml = function()
	{
		var html = "";
		var plugins = $(".plugin:not(.no-plugin)");

		for(var i = 0; i < plugins.length; i++)
		{
			var plugin = plugins.eq(i).data("plugin");

			html += plugin.getHtml();
		}

		return html;
	};

	var getPluginsStates = window.ShovelApps.Plugins.getPluginsStates = function()
	{
		var states = [];
		var plugins = $(".plugin:not(.no-plugin)");

		for(var i = 0; i < plugins.length; i++)
		{
			var id_plugin = plugins.eq(i).data("plugin-id");
			var plugin = plugins.eq(i).data("plugin");

			states.push({id: id_plugin, state: plugin.saveState()});
		}
		return states;
	};

	var loadPluginsStates = window.ShovelApps.Plugins.loadPluginsStates = function(states)
	{
		try
		{
			var count = states.length, i = 0;

			if(count == i)
				return true;

			var loadState = function(i)
			{
				if(i == count)
					return;

				addPlugin(states[i].id, false, states[i].state, function(){
					loadState(++i);
				});
			};


			loadState(i);

			return true;
		}
		catch(err)
		{
			console.log("Load states error", err);
			return false;
		}
	};


	var getScreenResources = window.ShovelApps.Plugins.getScreenResources = function()
	{
		var css = [];
		var js = [];

		var plugins = $(".screen-plugins .plugin:not(.no-plugin)");

		var array2d2array = function(array){
			var n = [];
			for(var i in array)
			{
				if(typeof array[i] == "object")
				{
					for(var j in array[i])
						n.push(array[i][j]);
				}
				else
				{
					n.push(array[i]);
				}
				
			}

			return n;
		};

		var existsInArray = function(fn)
		{
			if(typeof fn !== "function")
			{
				var old_data = fn;
				var new_func = function(v, i){ return v == old_data; };

				fn = new_func;
			}

			for(var i in this)
			{
				if(fn(this[i], i)) return true;
			}

			return false;
		};

		var deleteDuplicate = function()
		{
			var new_array = [];
			for(var i in this)
			{
				if(!existsInArray.call(new_array, this[i]))
					new_array.push(this[i]);
			}
			return new_array;
		};

		for(var i = 0; i < plugins.length; i++)
		{
			var plugin = plugins.eq(i).data("plugin");

			if("getCss" in plugin && plugin.getCss() != "")
				css.push(plugin.getCss());

			if("getJs" in plugin && plugin.getJs() != "")
				js.push(plugin.getJs());
		}

		js = deleteDuplicate.call(array2d2array(js));
		css = deleteDuplicate.call(array2d2array(css));

		return {css: css, js: js};

	};


	$(document).on("click", ".panel .addPlugin", function(){
		var elm = $(this), id = elm.data("plugin-id");

		addPlugin(id);

		$(".pluginsScreen .search-plugin").val("").trigger("keyup");

		return false;
	});

	$(document).on("click", ".plugin .header .delete", function(){
		var elm = $(this).parents(".plugin"), id = elm.data("id");

		if(id === undefined) return false;

		removePlugin(elm);

		return false;
	});

	$(document).on("click", ".plugin .up-plugin, .plugin .down-plugin", function(){
		var elm = $(this).parents(".plugin"), plugin = elm.data("plugin"), id = elm.data("plugin-id"), target = {};

		if(id === undefined || $(this).hasClass("disabled")) return false;


		if($(this).hasClass("up-plugin"))
		{
			if(elm.prev(".plugin").length == 0) return false;

			target.elm = elm.prev(".plugin");
			target.type = "before";
		}
		else
		{
			if(elm.next(".plugin").length == 0) return false;
			target.elm = elm.next(".plugin");
			target.type = "after";
		}

		target.showTime = 1;

		var old_state = plugin.saveState();

		removePlugin(elm, 1);
		addPlugin(id, target, old_state);


		return false;
	});

	$(document).on("plugin.change", "body, .plugin", checkIframe);

	$(checkSortButton);
})(Plugins);


(function(){
	var timer = false;

	var searchPlugin = function(){
		var elm = $(this), val = elm.val().trim().toLowerCase(), menus = $(".pluginsScreen .panel.panel-default");


		if(val == "")
			return $(".pluginsScreen .panel.panel-default, .pluginsScreen .panel.panel-default .addPlugin").stop(true, true).fadeIn(), true;

		for(var i = 0; i < menus.length; i++)
		{
			var options = menus.eq(i).find(".addPlugin");

			for(var j = 0, visible = options.length; j < options.length; j++)
			{
				if(options.eq(j).text().toLowerCase().indexOf(val) !== -1)
					options.eq(j).stop(true, true).fadeIn();
				else
					options.eq(j).stop(true, true).fadeOut(), --visible;
			}

			if(visible == 0)
				menus.eq(i).stop(true, true).fadeOut();
			else
				menus.eq(i).stop(true, true).fadeIn();
		}
	};

	$(document).on("keyup", ".pluginsScreen .search-plugin", function(){
		if(timer)
			clearTimeout(timer), timer = false;

		timer = setTimeout(searchPlugin.bind(this), 300);
	});
})();