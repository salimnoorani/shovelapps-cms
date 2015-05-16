define(function(require){
	var matchJaxPlugin = function(){};


	matchJaxPlugin.prototype.canGetCKeditor = function(){
		try
		{
			return this.textarea !== undefined && this.textarea.ckeditorGet() !== undefined;
		}
		catch(err)
		{
			return false;
		}
	};
	matchJaxPlugin.prototype.changeHtml = function(){
		$(this).trigger("plugin.change");
	};
	matchJaxPlugin.prototype.getTemplate = function()
	{
		return $("<textarea>", {cols: 100});
	};
	matchJaxPlugin.prototype.onShow = function(plugin_template)
	{
		var self = this, blur = function(){this.on("blur", self.changeHtml.bind(plugin_template));};
		
		this.textarea.ckeditor(blur, {extraPlugins: "mathjax", allowedContent: true, toolbar: [{ name: 'insert', items: ['Mathjax']}]});
	};


	matchJaxPlugin.prototype.loadState = function(old_state){
		return this.canGetCKeditor()? (this.textarea.ckeditorGet().setData(old_state.html), true) : false;
	};
	matchJaxPlugin.prototype.saveState = function(){
		return this.canGetCKeditor()? {html: this.getHtml()} : {};
	};

	matchJaxPlugin.prototype.getCss = function()
	{
		return !this.canGetCKeditor()? "" : this.textarea.ckeditorGet().config.contentsCss;
	};
	matchJaxPlugin.prototype.getHtml = function(){
		return !this.canGetCKeditor()? "" : this.textarea.val();
	};

	matchJaxPlugin.prototype.destroy = function(){ this.canGetCKeditor() && this.textarea.ckeditorGet().destroy()};
	matchJaxPlugin.prototype.onInit = function(plugin_template){this.dom = plugin_template;this.textarea = this.dom.find("textarea");};


	return matchJaxPlugin;
});