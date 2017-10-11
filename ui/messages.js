var grid = $('.grid');
var wrapper = $('#wrapper');
var popUp = $('.pop-up');

var errorContainer = document.querySelector('.error-container');
var passwordCotainer = document.querySelector('.password-container');

function checkPassword(event) {
	errorContainer.style.visibility = 'hidden';

	if (event.target.value == 'password') {
		passwordCotainer.parentNode.removeChild(passwordCotainer);
		setCookie("approved", "true", 30);

		getData();
	}
	else if (event.keyCode == 13) {
		event.preventDefault();

		errorContainer.style.visibility = 'visible';
	}
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

function checkCookie() {
	var approved = getCookie("approved");

	if (approved != "") {
		getData();
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
		wrapper.addClass('carousel');
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
			wrapper.removeClass('carousel');
		}
	}
);

