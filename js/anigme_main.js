//style fixes...
var header_shift = parseInt($("nav").css("height"));
$("#page_content").css("margin-top", header_shift + 10 + 'px');
$("#end_of_content").css("height", header_shift + 20 + 'px');
$("#card_content").css("min-height", parseInt($(window).height()) - header_shift - parseInt($("#end_of_content").css("height")) - 30);

//setting toastr
toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": false,
	"positionClass": "toast-top-right",
	"preventDuplicates": false,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "3000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

function initialize_anigme() {
	if (!localStorage.getItem("latest_enign_name")) //first visit of the user...
		bootbox.alert("Good Luck !! ;)");

	//load the latest enigm...
	$("footer").css("display", "block");
	set_current_enigm_name(get_latest_rechead_enigm());
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