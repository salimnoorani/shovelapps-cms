define(function(require) {
  var htmlPlugin = function() {};

  htmlPlugin.prototype.canGetCKeditor = function() {
    try {
      return this.textarea !== undefined && this.textarea.ckeditorGet() !== undefined;
    } catch (err) {
      return false;
    }
  };
  htmlPlugin.prototype.changeHtml = function() {
    $("body").trigger("plugin.change");
  };

  htmlPlugin.prototype.getTemplate = function() {
    return $("<textarea>", {
      cols: 100
    });
  };
  htmlPlugin.prototype.onShow = function(plugin_template) {
    var self = this,
      blur = function() {
        this.focus();
        this.on("blur", self.changeHtml.bind(plugin_template));
      },
      change = function(){
        if(self.timer) clearTimeout(self.timer);

        self.timer = setTimeout(self.changeHtml, 300);
      };
    plugin_template.find("textarea").ckeditor(blur, {
      allowedContent: true,
      on: {change: change}
    });
  };


  htmlPlugin.prototype.loadState = function(old_state) {
    return this.textarea.val(old_state.html);
  };
  htmlPlugin.prototype.saveState = function() {
    return {
      html: this.getHtml()
    };
  };

  htmlPlugin.prototype.getCss = function() {
    return !this.canGetCKeditor() ? "" : this.textarea.ckeditorGet().config.contentsCss;
  };
  htmlPlugin.prototype.getHtml = function() {
    return !this.canGetCKeditor() ? "" : this.textarea.val();
  };

  htmlPlugin.prototype.destroy = function() {
    this.canGetCKeditor() && this.textarea.ckeditorGet().destroy()
  };
  htmlPlugin.prototype.onInit = function(plugin_template) {
    this.dom = plugin_template;
    this.textarea = this.dom.find("textarea");
  };


  return htmlPlugin;
});