$(document).ready(function() {
	//wait firebase is initialized...
	var interval_check_firebase_initialized = setInterval(function() {
		if (firebase.apps.length) {
			//stop to check if initialized
			clearInterval(interval_check_firebase_initialized);
			//initialize the app
			get_enigme_list_names();
		}
	}, 100);
});

function get_enigme_list_names() {
	var database = firebase.database();
	var ref = database.ref(get_uid() + '/' + "enigmes_names/");
	ref.once("value", function(v) {
		console.log(v.val()); //FIXME: not retriving the data all the time ?? why ??!!

		var enigmes_names = [];
		var lst = v.val();
		if (lst) {
			//iterate througth keys to get the enigms names...
			var keys = Object.keys(lst);
			for (var i = 0; i < keys.length; i++) {
				var k = keys[i];
				if (lst[k] != "init" && lst[k] != "final")
					enigmes_names.push(lst[k]);
			}
		}

		//FUCKING HACK FOR THE PREVIOUS FIXME : TODO -> FIXME !!!!!!!
		$("#refresh_init").click(get_enigme_list_names);
		$("#draggablePanelList").html('')
		$(".edit_me").css("display", "none");

		initialize_arrange(enigmes_names);
	});
}

function add_li(txt) {
	$("#draggablePanelList").append('<li class="panel panel-info"><div class="panel-heading"><span class="enigm_id">' + txt + '</span></div></li>');
}

function initialize_arrange(enigm_name_list) {
	//check if an user is connected...
	need_to_be_connected();

	//remove the loading text...
	fix_loading();

	//add the enigms id to the list...
	for (var i = 0; i < enigm_name_list.length; i++)
		add_li(enigm_name_list[i]);

	//make the list draggable
	$('#draggablePanelList').sortable({
		handle: '.panel-heading',
		update: function() {
			$('.panel', $('#draggablePanelList')).each(function(index, elem) {
				var $listItem = $(elem);
				var newIndex = $listItem.index();
			});
		}
	});

	//jquery mobile make sortable
	$(document).bind('pageinit', function() {
		$( "#draggablePanelList" ).sortable();
		$( "#draggablePanelList" ).disableSelection();
		$( "#draggablePanelList" ).bind( "sortstop", function(event, ui) {
			$('#draggablePanelList').listview('refresh');
		});
	});

	//make the enigms editable
	$(".panel-heading").append("<span class='edit_me'>- Click to Edit</span>");
	$(".edit_me").click(function(e) {
		window.location.href = "edit.html?egnime_id=" + encodeURIComponent($(this).parent().children()[0].innerText);
	});
	
	//make the list visible and the save button too
	$(".enigm_name_lst").css("display", "block");
	$("#arrange_save").css("display", "block");

	//make the save button working...
	$("#arrange_save").click(function(e) {
		//make the save order working...
		set_successors();
	});

	//remove the waiting spinner
	$("#waiting_spinner").children().removeClass("fa fa-spinner fa-spin");

	//display the sharing url...
	var share_enigm_url = window.location.href.split("arrange.html")[0] + 'anigme.html?enigme_set_id=' + firebase.auth().currentUser.uid;
	$("#share_url").html("<a href='" + share_enigm_url +"'>" + share_enigm_url + "</a>");

	//make the go to play link working...
	$("#go_to_play").attr("href", './' + 'anigme.html?enigme_set_id=' + firebase.auth().currentUser.uid);
}

function get_ordered_list_name() {
	var out = [];
	var lst = $("#draggablePanelList li .enigm_id");

	for (var i = 0; i < lst.length; i++)
		out.push(lst[i].innerText);

	return out;
}

function set_successors() {
	var lst = get_ordered_list_name();
	var database = firebase.database();

	lst = ["init"].concat(lst).concat("final");

	//reactualise the linked list
	if (lst.length > 2) {
		//set the links...
		for (var i = 0; i < lst.length - 1; i++) {
			var ref = database.ref(get_uid() + '/' + "enigmes_list/" + lst[i] + "/next");
			ref.set(lst[i + 1]);
		}
	} else {
		//the list is empty just 'init' -> 'final'
		var ref = database.ref(get_uid() + '/' + "enigmes_list/init/next");
		ref.set("final");
	}

	//reactualize the order in enigme_names
	var ref = database.ref(get_uid() + '/' + "enigmes_names/");
	ref.set(lst);
}





