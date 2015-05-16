define(function(require){
	var youtubePlugin = function(){};


	youtubePlugin.prototype.canGetCKeditor = function(){
		try
		{
			return this.textarea !== undefined && this.textarea.ckeditorGet() !== undefined;
		}
		catch(err)
		{
			return false;
		}
	};
	youtubePlugin.prototype.changeHtml = function(){
		$(this).trigger("plugin.change");
	};
	youtubePlugin.prototype.getTemplate = function()
	{
		return $("<textarea>", {cols: 200});
	};
	youtubePlugin.prototype.onShow = function(plugin_template)
	{
		var self = this, blur = function(){this.on("blur", self.changeHtml.bind(plugin_template));};
		
		this.textarea.ckeditor(blur, {extraPlugins: "youtube", allowedContent: true, toolbar: [{ name: 'insert', items: ['Youtube']}]});
	};


	youtubePlugin.prototype.loadState = function(old_state){
		return this.canGetCKeditor()? (this.textarea.ckeditorGet().setData(old_state.html), true) : false;
	};
	youtubePlugin.prototype.saveState = function(){
		return this.canGetCKeditor()? {html: this.getHtml()} : {};
	};

	youtubePlugin.prototype.getCss = function()
	{
		return !this.canGetCKeditor()? "" : this.textarea.ckeditorGet().config.contentsCss;
	};
	youtubePlugin.prototype.getHtml = function(){
		return !this.canGetCKeditor()? "" : this.textarea.val();
	};

	youtubePlugin.prototype.destroy = function(){ this.canGetCKeditor() && this.textarea.ckeditorGet().destroy();};
	youtubePlugin.prototype.onInit = function(plugin_template){this.dom = plugin_template;this.textarea = this.dom.find("textarea");};


	return youtubePlugin;
});