define(function(require){
	var formPlugin = function(){
		this.formArray = [];
	};

	formPlugin.prototype.deleteInput = function(e){
		var elm = $(this).parents(".input"), id = elm.data("id"), forms = [], self = e.data;

		for(var i in self.formArray)
			self.formArray[i].id != id && forms.push(self.formArray[i]); 

		elm.remove();
		self.formArray = forms;
	};
	formPlugin.prototype.onInit = function(template){
		var self = this;

		template.find(".newInput").on("click", function(){
			var label = prompt("Input name","");
			var type = prompt("Input type","text");
			var id = Math.random();


			var button = $("<button>").addClass("deleteInput").click(self, self.deleteInput).text("Delete");
			var input = $("<input>", {type: type});
			var label = $("<label>").text(label).append(input);
			var div   = $("<div>").data("id", id).addClass("input").append(label, button);


			template.find(".list-input").append(div);

			self.formArray.push({id: id, div: div});

			return false;
		});
	};
	formPlugin.prototype.getTemplate = function()
	{
		var div = $("<div>").addClass("list-input");
		var button = $("<button>").addClass("newInput").text("Add new input");

		return div.append(button);
	};
	formPlugin.prototype.onShow = function(plugin_template){};
	formPlugin.prototype.loadState = function(old_state){};
	formPlugin.prototype.saveState = function(){};


	formPlugin.prototype.getHtml = function(){
		var form = $("<form>");

		for(var i in this.formArray)
		{
			this.formArray.div.find(".deleteInput").remove();

			form.append(this.formArray.div);
		}

		return form.html();
	};

	formPlugin.prototype.destroy = function(){};


	return new formPlugin();
});