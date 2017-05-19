//when loading the page go to the lastest enigm...
$(document).ready(function() {
	//wait firebase is initialized...
	var interval_check_firebase_initialized = setInterval(function() {
		if (firebase.apps.length) {
			//stop to check if initialized
			clearInterval(interval_check_firebase_initialized);
			//initialize the app
			initialize_anigme();
		}
	}, 100);
});

var enigme_set_id = null;
function initialize_anigme() {
	//check the id of the enigm is well given in param...
	enigme_set_id = get_query_params().enigme_set_id;
	if (!enigme_set_id) {
		$("#enigme_title").html("ERROR :'(");
		$("#enigme_content").html("The 'enigme_set_id' param is missing in the url...</br>Ask again the good url to the person who gave you this link...</br>Or better make your enigme set by creating an account just <a href='login.html'>HERE</a> !!! :D");

		toastr.error("Url should contain the enigm set param...");
		return;
	}

	if (!localStorage.getItem(enigme_set_id + '_' + "latest_enign_name")) //first visit of the user...
		bootbox.alert("Good Luck !! ;)");

	//load the latest enigm, or the enigm choosen by the url...
	var enigme_to_display = get_query_params().enigm;
	if (!enigme_to_display)
		enigme_to_display = get_latest_rechead_enigm();

	$("footer").css("display", "block");
	set_current_enigm_name(enigme_to_display);
	load_enigm_data();

	//let the user checking his solution...
	$("#check_enigme_solution").click(check_enigme_solution);

	//set the nav button working...
	$("#set_first_enigm").click(function(e) {
		set_current_enigm_name("init");
		load_enigm_data();
	});

	$("#set_latest_enigm").click(function(e) {
		set_current_enigm_name(get_latest_rechead_enigm());
		load_enigm_data();
	});

	$("#reset_progression").click(function(e) {
		bootbox.confirm(
			"Do you REALLY want to reset your progression and start over ??!!", 
			function (v) {
				if (v) {
					toastr.info("Reseting your progression...");
					//reset the progression...
					set_current_enigm_name("init");
					localStorage.setItem(enigme_set_id + '_' + "latest_enign_name", "init");
					load_enigm_data();
				}
			}
		);
	});

	//check if the solution is given in param...
	var solution = get_query_params().solution;
	if (solution) {
		$("#enigme_solution").val(solution);
		//check the solution
		check_enigme_solution();	
	}
}

function reset_progression() {
	localStorage.setItem(enigme_set_id + '_' + "latest_enign_name", "init");
}

function get_latest_rechead_enigm() {
	var latest_enign_name = localStorage.getItem(enigme_set_id + '_' + "latest_enign_name");
	if (latest_enign_name == null || latest_enign_name == '') { //never played before...
		latest_enign_name = "init"; //the initial enigm must allways be named : 'init'
		localStorage.setItem(enigme_set_id + '_' + "latest_enign_name", latest_enign_name);
	}

	return latest_enign_name;
}

function set_current_enigm_name(enigm_name) {
	localStorage.setItem(enigme_set_id + '_' + "current_enign_name", enigm_name);
}

function get_current_enign_name() {
	var current_enign_name = localStorage.getItem(enigme_set_id + '_' + "current_enign_name");
	if (current_enign_name == null || current_enign_name == '') { //never played before...
		current_enign_name = "init"; //the initial enigm must allways be named : 'init'
		localStorage.setItem(enigme_set_id + '_' + "current_enign_name", latest_enign_name);
	}

	return current_enign_name;
}

function display_images(txt) {
	var matches = txt.split(/[\s]+/).map(function(str) {
		return str.match(/(https?:\/\/.*\.(?:png|jpg))/)
	});

	var images_lst = [];
	for (var i = 0; i < matches.length; i++)
		if (matches[i])
			images_lst.push(matches[i][0]);
	images_lst = images_lst.unique();
	
	function rec_replace(splitted_tab, to_replace_tab) {
		if (to_replace_tab.length == 0)
			return splitted_tab;

		var tr = to_replace_tab[0];
		to_replace_tab = to_replace_tab.slice(1);

		splitted_tab = splitted_tab.split(tr).join("<img src='" + tr + "' class='img-thumbnail img-responsive'></img>");

		return rec_replace(splitted_tab, to_replace_tab);
	}

	return rec_replace(txt, images_lst);
}

function load_enigm_data() {
	//it's the felicitation message... do not display the submit form...
	$("footer").css("display", (get_current_enign_name() === "final" ? "none" : "block"));

	var db = firebase.database();
	var ref = db.ref(enigme_set_id + '/' + "enigmes_list/" + get_current_enign_name() + '/');
	ref.once("value", function(v) {
		try {
			$("#enigme_title").html(sanitize(v.val().title));
			$("#enigme_content").html(display_images(sanitize(v.val().text)));
		} catch (e) {
			toastr.error("Enigm not available... :'(");
		}
	});
}

function check_enigme_solution (e) {
	var db = firebase.database();
	var ref = db.ref(enigme_set_id + '/' + "enigmes_list/" + get_current_enign_name() + '/');
	ref.once("value", function(v) {
		if ($("#enigme_solution").val().trim().toLowerCase().hashCode() == v.val().solution) { //not case sensitive...
			//TODO: go to the next enigm
			toastr.success("Good answer !! :D");

			//set the lastet enigme rechead
			localStorage.setItem(enigme_set_id + '_' + "latest_enign_name", v.val().next);
			//set the current enigme to the next
			localStorage.setItem(enigme_set_id + '_' + "current_enign_name", v.val().next);
			//reload the enigms data...
			load_enigm_data();
		} else {
			//TODO: display this was false...
			$("footer").effect("pulsate", { times: 0 }, 1000);
			toastr.error("Wrong answer !! :'(");
		}
	});
}

