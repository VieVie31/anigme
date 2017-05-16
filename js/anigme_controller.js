function reset_progression() {
	localStorage.setItem("latest_enign_name", "init");
}

function get_latest_rechead_enigm() {
	var latest_enign_name = localStorage.getItem("latest_enign_name");
	if (latest_enign_name == null || latest_enign_name == '') { //never played before...
		latest_enign_name = "init"; //the initial enigm must allways be named : 'init'
		localStorage.setItem("latest_enign_name", latest_enign_name);
	}

	return latest_enign_name;
}

function set_current_enigm_name(enigm_name) {
	localStorage.setItem("current_enign_name", enigm_name);
}

function get_current_enign_name() {
	var current_enign_name = localStorage.getItem("current_enign_name");
	if (current_enign_name == null || current_enign_name == '') { //never played before...
		current_enign_name = "init"; //the initial enigm must allways be named : 'init'
		localStorage.setItem("current_enign_name", latest_enign_name);
	}

	return current_enign_name;
}

function load_enigm_data() {
	//it's the felicitation message... do not display the submit form...
	$("footer").css("display", (get_current_enign_name() === "final" ? "none" : "block"));

	var db = firebase.database();
	var ref = db.ref("enigmes_list/" + get_current_enign_name() + '/');
	ref.once("value", function(v) {
		$("#enigme_title").text(v.val().title);
		$("#enigme_content").text(v.val().text);
	});
}

function check_enigme_solution (e) {
	var db = firebase.database();
	var ref = db.ref("enigmes_list/" + get_current_enign_name() + '/');
	ref.once("value", function(v) {
		if ($("#enigme_solution").val().toLowerCase() == v.val().solution.toLowerCase()) { //not case sensitive...
			//TODO: go to the next enigm
			toastr.success("Good answer !! :D");

			//set the lastet enigme rechead
			localStorage.setItem("latest_enign_name", v.val().next);
			//set the current enigme to the next
			localStorage.setItem("current_enign_name", v.val().next);
			//reload the enigms data...
			load_enigm_data();
		} else {
			//TODO: display this was false...
			$("footer").effect("pulsate", { times: 0 }, 1000);
			toastr.error("Wrong answer !! :'(");
		}
	});
}

