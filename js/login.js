$(function() {
    $('#toggle').change(function() {
   		var b = $(this).prop('checked');
   		if (b) {
   			$('#singUp').hide();
   			$('#singIn').show();		
   		} else {
   			$('#singIn').hide();
   			$('#singUp').show();
   		}
      
    })
});

//when loading the page go to the lastest enigm...
$(document).ready(function() {
	//wait firebase is initialized...
	var interval_check_firebase_initialized = setInterval(function() {
		if (firebase.apps.length) {
			//stop to check if initialized
			clearInterval(interval_check_firebase_initialized);
			//initialize the app
			initialize_co();
		}
	}, 100);
});

function initialize_co() {
	//initialize the button click action
	$("#sign_in").click(user_sign_in);
	$("#sign_up").click(user_create_account);
}

function user_sign_in() {
	var email = $("#mail_input_sing_in").val();
	var password = $("#pass_input_sing_in").val();

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
	    toastr.info("You are now logged !!");
	    
	    //redirect
	    setTimeout(function() {
	    	window.location.href = './arrange.html';
	    }, 3000);
	    
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Sign In Error");
	});
}

function user_create_account() {
	var email = $("#mail_input_sing_up").val();
	var password = $("#pass_input_sing_up1").val();
	//check mdp
	if (password != $("#pass_input_sing_up2").val()) {
		toastr.error("Password is not the same");
		return;
	}

	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
		//intialize the enigm names
		var database = firebase.database();
		var ref = database.ref(get_uid() + "/enigmes_names/");
		ref.set(["init", "final"]);

		//initalize the linkage and content...
		var ref_init = database.ref(get_uid() + "/enigmes_list/init");
		ref_init.set({
			title: "Title",
			text: "Your enigm here...",
			solution: 0, //solution is ''
			next: "final"
		});

		var ref_final = database.ref(get_uid() + "/enigmes_list/final");
		ref_final.set({
			title: "Bravo",
			text: "Your congradulation message here..."
		});

		//TODO: check all is well initialized...

	    toastr.success("Your account is now live... \nEdit your enigmes and share them accross the world !!");

	    //redirect
	    setTimeout(function() {
	    	window.location.href = './arrange.html';
	    }, 3000);

	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Account Creation Error");
	});
}

