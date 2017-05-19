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

function fix_loading() {
	//fix the loading text a the bootom of the page...
	$("h1").each(function() {
		if ($(this).html() == "loading")
			$(this).html('');
	});
}

function need_to_be_connected() {
	if (!firebase.auth().currentUser) {
		toastr.error("You need to be connected to edit enigms...");
		window.location.href = "./login.html"
	}
}

function get_uid() {
	//no user connected...
	if (!firebase.auth().currentUser)
		return '';
	//return the connected user uid..
	return firebase.auth().currentUser.uid;
}

function sign_out() {
	firebase.auth().signOut();
	toastr.success("You just signed out !!</br>See you soon...");
	window.location.href = "./login.html";
}

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

//fix for xss problems...
function sanitize(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/(\r\n|\n|\r)/g,"<br />");
}

String.prototype.hashCode = function() {
	var hash = 0, i, chr;

	if (this.length === 0) return hash;
		for (i = 0; i < this.length; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
	return hash;
};

Array.prototype.unique = function(a) {
	return function() {
		return this.filter(a)
	}
} (function(a, b, c){ return c.indexOf(a, b + 1) < 0 });
