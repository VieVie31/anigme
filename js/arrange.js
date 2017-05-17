$(document).ready(function() {
	//wait firebase is initialized...
	var interval_check_firebase_initialized = setInterval(function() {
		if (firebase.apps.length) {
			//stop to check if initialized
			clearInterval(interval_check_firebase_initialized);
			//initialize the app
			initialize_arrange();
		}
	}, 100);
});

function initialize_arrange(enigm_name_list) {
	//make the list draggable
	$('#draggablePanelList').sortable({
		handle: '.panel-heading',
		update: function() {
			$('.panel', $('#draggablePanelList')).each(function(index, elem) {
				var $listItem = $(elem);
				var newIndex = $listItem.index();
			});
		}
	});
	//make the enigms editable
	$(".panel-heading").append("<span class='edit_me'> - Click to Edit</span>");
	$(".edit_me").click(function(e) {
		alert($(this).parent().html());
	});
	
	//make the list visible and the save button too
	$(".enigm_name_lst").css("display", "block");
	$("#arrange_save").css("display", "block");

	//make the save button working...
	$("#arrange_save").click(function(e) {
		//TODO: make the save order working...
		alert("TODO");
	});

	//remove the waiting spinner
	$("#waiting_spinner").children().removeClass("fa fa-spinner fa-spin");
}