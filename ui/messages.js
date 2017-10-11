var errorContainer = $('.error-container');
var grid = $('.grid');
var passwordCotainer = $('.password-container');
var popUp = $('.pop-up .pop-up-content');
var wrapper = $('#wrapper');

function appendNotes(notes) {
	notes.forEach(
		function(note, index) {
			grid.append(`<div class="note-card">` +
				`<div class="card-content note-${index}" data-target=".note-${index}">` +
					`<i class="fa fa-heart-o" aria-hidden="true"></i>` +
					`<div class="message">${unescape(note.message)}</div>` +
					`<div class="author">${unescape(note.name)}</div>` +
				`</div>` +
			`</div>`);
		}
	);
}

function checkCookie() {
	var approved = getCookie("approved");

	if (approved != "") {
		hidePswrdContainer();

		getData();
	}
	else {
		passwordCotainer.css('visibility', 'visible');
	}
}

function checkPassword(event) {
	errorContainer.css('visibility', 'hidden');

	if (event.target.value == 'password') {
		hidePswrdContainer();

		setCookie("approved", "true", 30);

		getData();
	}
	else if (event.keyCode == 13) {
		event.preventDefault();

		errorContainer.css('visibility', 'visible');
	}
}

function getData() {
	WeDeploy
		// .data('db-pink.wedeploy.io')
		.data('db-pinkdev.wedeploy.io')
		.orderBy('id', 'desc')
		.limit(50)
		.get('notes')
		.then(function(response) {
			appendNotes(response);
		})
		.catch(function(error) {
			console.error(error);
		});
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');

	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function hidePswrdContainer() {
	passwordCotainer.remove();
	wrapper.removeClass('password-active');
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function scrollContent() {
	$('html, body').animate(
		{
			scrollTop: grid.offset().top + 76
		}
	)
}

$('.scroll-down').on('click', scrollContent);

grid.delegate(
	'.note-card',
	'click',
	function() {
		wrapper.addClass('modal-active');
		$(this).addClass('focused');

		var popupContent = $(this).html();
		popUp.html(popupContent);
	}
);

$('.close').on(
	'click',
	function() {
		var focused = $('.focused');

		if (focused) {
			focused.removeClass('focused');
			wrapper.removeClass('modal-active');
		}
	}
);