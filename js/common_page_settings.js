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
