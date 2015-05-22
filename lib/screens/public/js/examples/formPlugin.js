define(function(require){
	var formPlugin = function(){};


	formPlugin.prototype.canGetCKeditor = function(){
		try
		{
			return this.textarea !== undefined && this.textarea.ckeditorGet() !== undefined;
		}
		catch(err)
		{
			return false;
		}
	};
	formPlugin.prototype.changeHtml = function(){
		$(this).trigger("plugin.change");
	};
	formPlugin.prototype.getTemplate = function()
	{
		return $("<textarea>", {cols: 100});
	};
	formPlugin.prototype.onShow = function(plugin_template)
	{
		var self = this, blur = function(){this.on("blur", self.changeHtml.bind(plugin_template));};
		this.textarea.ckeditor(blur, {extraPlugins: "forms", allowedContent: true});
	};


	formPlugin.prototype.loadState = function(old_state){
    	return this.textarea.val(old_state.html);
	};
	formPlugin.prototype.saveState = function(){
		return this.canGetCKeditor()? {html: this.getHtml()} : {};
	};

	formPlugin.prototype.getCss = function()
	{
		return !this.canGetCKeditor()? "" : this.textarea.ckeditorGet().config.contentsCss;
	};
	formPlugin.prototype.getHtml = function(){
		return !this.canGetCKeditor()? "" : this.textarea.val();
	};

	formPlugin.prototype.destroy = function(){ this.canGetCKeditor() && this.textarea.ckeditorGet().destroy()};
	formPlugin.prototype.onInit = function(plugin_template){this.dom = plugin_template; this.textarea = this.dom.find("textarea");};


	return formPlugin;
});