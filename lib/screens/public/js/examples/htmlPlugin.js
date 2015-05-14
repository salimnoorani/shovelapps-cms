define(function(require){
	var htmlPlugin = function(){};

	htmlPlugin.prototype.getTemplate = function()
	{
		return $("<textarea>", {cols: 100});
	};
	htmlPlugin.prototype.onShow = function(plugin_template)
	{
		plugin_template.find("textarea").ckeditor();
	};


	htmlPlugin.prototype.loadState = function(old_state){
		return plugin_template.find("textarea").val(old_state.html), true;
	};
	htmlPlugin.prototype.saveState = function(){
		return {html: this.getHtml()};
	};


	htmlPlugin.prototype.getHtml = function(){
		return plugin_template.find("textarea").val();
	};

	htmlPlugin.prototype.destroy = function(){};
	htmlPlugin.prototype.onInit = function(){};


	return new htmlPlugin();
});