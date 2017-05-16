//style fixes...
var header_shift = parseInt($("nav").css("height"));
$("#page_content").css("margin-top", header_shift + 10 + 'px');
$("#end_of_content").css("height", header_shift + 20 + 'px');
$("#card_content").css("min-height", parseInt($(window).height()) - header_shift - parseInt($("#end_of_content").css("height")) - 30);
