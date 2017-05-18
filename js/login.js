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
  })

var current_user = null;

function user_sign_in() {
	var email = $("#mail_input_sing_in").val();
	var password = $("#pass_input_sing_in").val();

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
	    toastr.info("You are now logged !!");
	    //action_when_sign_in();
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
	    current_user = firebase.auth().currentUser;

	    //create a version number...
		var database = firebase.database();
		var t = database.ref('users/' + current_user.uid);
		t.set({version: 0});
	    
	    toastr.info("Your account is now live... Have fun !!");

	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Account Creation Error");
	});
}