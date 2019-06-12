// need to bind on inserted to work with insertUI
$(document).ready(function(){
  $(".dropelement").on("dragover",function(e){
    e.preventDefault();
  });
  $(".dragelement").on("dragstart",function(e){
    var nodeCheck = e.target;
    var dragName = nodeCheck.id;
    
    // make sure you grab the entire draggable element
    while(dragName === "" || $(nodeCheck).hasClass("dragelement")) {
      nodeCheck = nodeCheck.parentNode;
      dragName = nodeCheck.id;
    }
    e.originalEvent.dataTransfer.setData("Text",dragName);
  });
  $(".dropelement").on("dragstart",function(e){
	var nodeCheck = e.target;
    var dragName = nodeCheck.id;
    if(!$(nodeCheck).hasClass("disable-drag")) {	    
	    // make sure you grab the entire draggable element
	    while(dragName === "" || $(nodeCheck).hasClass("dropelement")) {
	      nodeCheck = nodeCheck.parentNode;
	      dragName = nodeCheck.id;
	    }
	    e.originalEvent.dataTransfer.setData("Text",e.target.id);
	    $("#" + e.target.id).siblings(".tooltip").toggle(); //hide the tooltip when the drag starts
    }
  });
  $(".dropelement").on("drop",function(e){
    e.preventDefault();
    var data=e.originalEvent.dataTransfer.getData("Text");
    if ($(e.target).hasClass("dragelement")){
      var el = $(e.target).closest(".dropelement"); //pick the parent dropelement if the target was dragelement
    } else {
      var el = $(e.target);
    };
    // prevent images from stacking on tope of each other
    if (e.target.nodeName !== "IMG") {
      el.append(document.getElementById(data));
      $(data).siblings(".tooltip").toggle(); //show the tooltip when the drag ends
      el.trigger("change");
    };
  });
});

var dragDropBinding = new Shiny.InputBinding();
$.extend(dragDropBinding, {
  find: function(scope) {
    return $(scope).find(".dropelement");
  },
  getValue: function(el) {
    return $(el).text();
  },
  setValue: function(el) {
    $(el).text();
  },
  subscribe: function(el, callback) {
    $(el).on("change", function(e) {
      callback();
    });
  },
  unsubscribe: function(el) {
    $(el).off(".dragDropBinding");
  },
  getType: function() {
    return "dragdropshiny.dropper";
}

});

Shiny.inputBindings.register(dragDropBinding);
