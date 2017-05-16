//when loading the page go to the lastest enigm...
$(document).ready(function() {
	//wait firebase is initialized...
	var interval_check_firebase_initialized = setInterval(function() {
		if (firebase.apps.length) {
			//stop to check if initialized
			clearInterval(interval_check_firebase_initialized);
			//get the enigms names and initialize the app
			firebase.database().ref("enigmes_names/").once("value", function(v) {
				var val = v.val();
				if (!val || val == [])
					val = ["init", "final"];

				initialize_edition(val);
			});
		}
	}, 100);
});

function save_edition() {
	var title = $("#edit_enigme_title").val();
	var content = $("#edit_enigme_content").val();
	var solution = $("#edit_enigme_solution").val();

	if (!title || !content) {
		toastr.error("Title and Content shouldn't be empty !! :'(");
		return;
	}

	var current_enigme = $('#select_enigm_to_edit').val();
	var db = firebase.database();
	var path = "enigmes_list/" + current_enigme + "/";
	//update fields
	db.ref(path + "title").set(title);
	db.ref(path + "text").set(content);
	//update the solution of not...
	if (solution)
		db.ref(path + "solution").set(solution.trim().toLowerCase().hashCode());


}

function load_data() {
	var enigme_to_edit = $('#select_enigm_to_edit').val();
	firebase.database().ref("enigmes_list/" + enigme_to_edit).once("value", function(v) {
		v = v.val();
		$("#edit_enigme_title").val(v.title);
		$("#edit_enigme_content").val(v.text);

		$("#edit_enigme_title").attr("readonly", false);
		$("#edit_enigme_content").attr("readonly", false);
		$("#edit_enigme_solution").attr("readonly", false);
	});
}

function initialize_edition(enigme_names) {
	//add the options to the select listbox
	$.each(enigme_names, function(i, item) {
		$('#select_enigm_to_edit').append(new Option(item, item));
	});
	$('#select_enigm_to_edit').selectpicker('refresh');
	$('#select_enigm_to_edit').selectpicker('deselectAll');
	load_data();

	//load the data when change...
	$('#select_enigm_to_edit').change(function() {
		$("#edit_enigme_title").attr("readonly", true);
		$("#edit_enigme_content").attr("readonly", true);
		$("#edit_enigme_solution").attr("readonly", true);

		load_data();
	});

	//save the data when clicking save...
	$("#edit_enigme_save").click(function(e) {
		save_edition();
	});

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
		$('.selectpicker').selectpicker('mobile');
	//hide the waiting imahe and load the edition interface...
	$("#waiting_connection").css("display", "none");
	$("#edition_container").css("display", "block");
}
