//when loading the page go to the lastest enigm...
$(document).ready(function() {
	//wait firebase is initialized...
	var interval_check_firebase_initialized = setInterval(function() {
		if (firebase.apps.length) {
			//stop to check if initialized
			clearInterval(interval_check_firebase_initialized);
			//get the enigms names and initialize the app
			firebase.database().ref(get_uid() + '/' + "enigmes_names/").once("value", function(v) {
				var val = v.val();
				if (!val || val == [])
					val = ["init", "final"];

				//remove undefined values
				val = remove_undefined_values(val);

				initialize_edition(val);
			});
		}
	}, 100);
});

function remove_undefined_values(tab) {
	//remove the undefined values
	var out = [];
	var  k = Object.keys(tab);

	for (var  i = 0; i < k.length; i++)
		if (tab[k[i]])
			out.push(tab[k[i]]);

	return out;
}

function save_edition() {
	var title = $("#edit_enigme_title").val();
	var content = $("#edit_enigme_content").val();
	var solution = $("#edit_enigme_solution").val();
	var current_enigme = $('#select_enigm_to_edit').val();
	var path = "enigmes_list/"+current_enigme+"/";

	if (!title || !content) {
		toastr.error("Title and Content shouldn't be empty !! :'(");
		return;
	}
	var db = firebase.database();
	var pathName = "enigmes_names/";
	if(current_enigme == "new_enigme"){
		if(!solution){
			toastr.error("We need answers !! ");
			return;
		}
		current_enigme = title;
		
		db.ref(get_uid() + '/' + "enigmes_list/" + current_enigme + "/").set({
			solution: solution.trim().toLowerCase().hashCode(),
			text: content,
			title : title
		});
		db.ref(get_uid() + '/' + pathName).once("value", function(v) {
			var val = v.val();
			db.ref(get_uid() + '/' + pathName+(v.numChildren())+"/").set(current_enigme);
			reload_select(val);
		});
	}else{
		var path = "enigmes_list/" + current_enigme + "/";
		//update fields
		db.ref(get_uid() + '/' + path + "title").set(title);
		db.ref(get_uid() + '/' + path + "text").set(content);
		//update the solution of not...
		if (solution)
			db.ref(get_uid() + '/' + path + "solution").set(solution.trim().toLowerCase().hashCode());
	}


}

function load_data() {
	var enigme_to_edit = $('#select_enigm_to_edit').val();
	if(enigme_to_edit != "new_enigme"){
		firebase.database().ref(get_uid() + '/' + "enigmes_list/" + enigme_to_edit).once("value", function(v) {
			v = v.val();
			$("#edit_enigme_title").val(v.title);
			$("#edit_enigme_content").val(v.text);
			$("#edit_enigme_solution").val(''); //delete the previously written solution

		});
	}
	else{
		$("#edit_enigme_title").val('');
		$("#edit_enigme_content").val('');
		$("#edit_enigme_solution").val(''); 
	}
	$("#edit_enigme_title").attr("readonly", false);
	$("#edit_enigme_content").attr("readonly", false);
	//the final card should be a conggrat card so no enigm !!
	$("#edit_enigme_solution").attr("readonly", $('#select_enigm_to_edit').val() == "final");

}

function initialize_edition(enigme_names) {
	//check if an user is connected...
	need_to_be_connected();

	//check if the url contains the 'egnime_id' param to set the select value on it...
	var egnime_id = get_query_params().egnime_id;

	//add the options to the select listbox
	reload_select(enigme_names, egnime_id);

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
	$("#remove_enigme").click(function(e) {
		remove_riddle();
	});

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
		$('.selectpicker').selectpicker('mobile');
	//hide the waiting imahe and load the edition interface...
	$("#waiting_connection").css("display", "none");
	$("#edition_container").css("display", "block");

	//make the go to play link working...
	$("#go_to_play").attr("href", './' + 'anigme.html?enigme_set_id=' + firebase.auth().currentUser.uid);
}

function remove_riddle(){
	var current_enigme = $('#select_enigm_to_edit').val();
	if(current_enigme == "init" || current_enigme == "final" || current_enigme == "new_enigme"){
				toastr.error("You can't delete this bro'");
				return;
	}
	var db = firebase.database();
	db.ref(get_uid() + '/' + "enigmes_list/"+current_enigme).remove();
	db.ref(get_uid() + '/' + "enigmes_names/").once("value", function(v) {
			var val = v.val();
			db.ref(get_uid() + '/' + "enigmes_names/"+val.indexOf(current_enigme)).remove();
	})
	;}


function reload_select(list_name, val){
	$('#select_enigm_to_edit').empty();
	$.each(list_name, function(i, item) {
		$('#select_enigm_to_edit').append(new Option(item, item));
	});
	$('#select_enigm_to_edit').append(new Option("new_enigme", "new_enigme"));
	$('#select_enigm_to_edit').val(val);
	$('#select_enigm_to_edit').selectpicker('refresh');
	$('#select_enigm_to_edit').selectpicker('deselectAll');
	load_data()

}

