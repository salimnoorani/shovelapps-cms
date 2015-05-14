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

	Cada plugin es independiente entre si, cada instancia de un plugin es independiente de las demas,
	cada instancia es responsable de su estado, de generar su objeto de estado y de poder cargarse un estado previo. 

	Al apretar Save en el screen, el CMS debe:
		- Pedir el estado de cada instancia de plugins del screen y guardarlos (saveState)
		- Pedir el html y guardarlo (getHtml)

	Al cargar el Create Screen, el CMS debe:
		- Listar las instancias de plugins almacenadas y retornar al estado de los mismos (loadState)


	Ejemplos:
		- shovelapps-cms\lib\screens\public\js\examples\htmlPlugin.js
		- shovelapps-cms\lib\screens\public\js\examples\formPlugin.js

*/


// Hasta que todo sea plugin, el textarea del comienzo es lanzado asi
$(function(){
	$( 'textarea' ).ckeditor();
});



(function(listPlugins){
	if(listPlugins === undefined || require === undefined) return;


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

	var addPlugin = function(id){
		var data = getPluginData(id);
		var template = templatePlugin.clone();
		var randomId = Math.random();

		try
		{

			if(!data) throw "Undefined plugin data.";


			if(data.main.css !== "")
				resolveCSSAsync(data.main.css);

			template.hide().data("id", randomId).find("h6:first").text(data.name);


			require([data.main.js], function(plugin){
				var plugin_template = plugin.getTemplate();

				template.find(".content:first").append(plugin_template);


				if("onInit" in plugin && typeof plugin.onInit == "function")
					plugin.onInit(template);


				$(".screen-plugins").append(template);


				template.fadeIn(function(){
					if("onShow" in plugin && typeof plugin.onShow == "function")
						plugin.onShow(template);

				});


				window.PluginsScreen.push({id: randomId, plugin: plugin});
			});
		}
		catch(error)
		{
			alert("Error to load " + data.option + " plugin!");

			console.log("ERROR PLUGIN", error);
		}

	};

	var removePlugin = function(id, elm){
		var plugins = [];

		for(var i in window.PluginsScreen)
		{
			if(window.PluginsScreen[i].id != id)
				plugins.push(window.PluginsScreen[i]);
			else if("destroy" in window.PluginsScreen[i].plugin)
				window.PluginsScreen[i].plugin.destroy();
		}

		elm.fadeOut(function(){ elm.remove(); });

		window.PluginsScreen = plugins;
	};


	$(document).on("click", ".panel .addPlugin", function(){
		var elm = $(this), id = elm.data("plugin-id");

		addPlugin(id);

		return false;
	});

	$(document).on("click", ".plugin .header .delete", function(){
		var elm = $(this).parents(".plugin"), id = elm.data("id");

		if(id === undefined) return false;

		removePlugin(id, elm);

		return false;
	});

	window.PluginsScreen = [];

})(Plugins);