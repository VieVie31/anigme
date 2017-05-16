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
