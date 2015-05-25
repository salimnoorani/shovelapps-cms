$(function() {
  setMain();
});

function setMain() {
  if (!(this instanceof setMain)) {
    return new setMain();
  }
  this.client = new $.RestClient("/admin/");
  this.client.add("screens");
  this.client.screens.addVerb('main', 'PATCH');
  this.initsetMain();
}

setMain.prototype = {
  initsetMain: function() {
    var _this = this;
    $(".row").on("change", "#selectMain", function(e) {
<<<<<<< HEAD
      if ($(this).val() !== 'not selected') {
        $('#selectMain option').each(function(index) {
          if ($(this).val() == $('#selectMain').val()) {
            _this.client.screens.main($(this).val(), {
              isMain: true
            });
          } else {
            if ($(this).val() !== 'not selected') {
              _this.client.screens.main($(this).val(), {
                isMain: false
              });
            }
          }
        });
      }
=======
      var selected = $(this).val();
      var options =  $('#selectMain option');

      if(selected == -1) return;


      for(var i = 0; i < options.length; i++)
      {
        if(options.eq(i).val() == -1) continue;

         _this.client.screens.main(options.eq(i).val(), {
            isMain: options.eq(i).val() == selected
          });
      }

>>>>>>> frontend-develop
      e.preventDefault();
    });
  }
};