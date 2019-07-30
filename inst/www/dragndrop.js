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
	    $("#" + e.target.id).children(".dropdown").removeClass("open"); //hide the dropdown when the drag starts
    }
  });
  $(".dropelement").on("drop",function(e){
    e.preventDefault();
    var data=e.originalEvent.dataTransfer.getData("Text");
    if(data != "") {
    	if ($(e.target).hasClass("dragelement")){
      		var el = $(e.target).closest(".dropelement"); //pick the parent dropelement if the target was dragelement
    	} else {
      		var el = $(e.target);
	};
	// prevent images from stacking on tope of each other
	if (e.target.nodeName !== "IMG") {
	  el.append(document.getElementById(data));
	  $(data).siblings(".tooltip").toggle(); //show the tooltip when the drag ends
	  var message = {data: e.target.innerText, nonce: Math.random()};//add random value to ensure the observeEvent for drop triggers everytime
	  Shiny.onInputChange(el.context.id,message); //alternate way to send data from JS to Shiny - need to parse for the message to extract data only
	  //el.trigger("change");
	};	
    };
  });
});

var dragDropBinding = new Shiny.InputBinding();
$.extend(dragDropBinding, {
  find: function(scope) {
    return $(scope).find(".dropelement");
  },
  getValue: function(el) {
    return {data: el.innerText};
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
