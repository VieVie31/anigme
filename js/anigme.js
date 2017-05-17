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

function get_query_params() {
    var params = {};
    var tokens;
    var re = /[?&]?([^=]+)=([^&]*)/g;

    var qs = document.location.search;
    qs = qs.split('+').join(' ');

    while (tokens = re.exec(qs))
    	params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);

    return params;
}

function initialize_anigme() {
	if (!localStorage.getItem("latest_enign_name")) //first visit of the user...
		bootbox.alert("Good Luck !! ;)");

	//load the latest enigm, or the enigm choosen by the url...
	var enigme_to_display = get_query_params().enigm
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
					localStorage.setItem("latest_enign_name", "init");
					load_enigm_data();
				}
			}
		);
	});
}

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
		try {
			$("#enigme_title").text(v.val().title);
			$("#enigme_content").text(v.val().text);
		} catch (e) {
			toastr.error("Enigm not available... :'(");
		}
	});
}

function check_enigme_solution (e) {
	var db = firebase.database();
	var ref = db.ref("enigmes_list/" + get_current_enign_name() + '/');
	ref.once("value", function(v) {
		if ($("#enigme_solution").val().trim().toLowerCase().hashCode() == v.val().solution) { //not case sensitive...
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

