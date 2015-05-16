define(function(require){
	var htmlPlugin = function(){};

	htmlPlugin.prototype.canGetCKeditor = function(){
		try
		{
			return this.textarea !== undefined && this.textarea.ckeditorGet() !== undefined;
		}
		catch(err)
		{
			return false;
		}
	};
	htmlPlugin.prototype.changeHtml = function(){
		$(this).trigger("plugin.change");
	};

	htmlPlugin.prototype.getTemplate = function()
	{
		return $("<textarea>", {cols: 100});
	};
	htmlPlugin.prototype.onShow = function(plugin_template)
	{
		var self = this, blur = function(){this.focus();this.on("blur", self.changeHtml.bind(plugin_template));};
		plugin_template.find("textarea").ckeditor(blur,{allowedContent: true});
	};


	htmlPlugin.prototype.loadState = function(old_state){
		return this.canGetCKeditor()? (this.textarea.val(old_state.html), true) : false;
	};
	htmlPlugin.prototype.saveState = function(){
		return {html: this.getHtml()};
	};

	htmlPlugin.prototype.getCss = function()
	{
		return !this.canGetCKeditor()? "" : this.textarea.ckeditorGet().config.contentsCss;
	};
	htmlPlugin.prototype.getHtml = function(){
		return !this.canGetCKeditor()? "" : this.textarea.val();
	};

	htmlPlugin.prototype.destroy = function(){ this.canGetCKeditor() && this.textarea.ckeditorGet().destroy()};
	htmlPlugin.prototype.onInit = function(plugin_template){this.dom = plugin_template;this.textarea = this.dom.find("textarea");};


	return htmlPlugin;
});