var errorContainer = $('.error-container');
var grid = $('.grid');
var passwordCotainer = $('.password-container');
var popUp = $('.pop-up .pop-up-content');
var wrapper = $('#wrapper');

var notesLength = 0;

function appendNotes(notes) {
	notes.forEach(
		function(note, index) {
			grid.append(`<div class="note-card note-${index}" data-index="${index}" tabindex="0">` +
				`<div class="card-content">` +
					`<i class="fa fa-heart-o" aria-hidden="true"></i>` +
					`<div class="message">${unescape(note.message)}</div>` +
					`<div class="author">${unescape(note.name)}</div>` +
				`</div>` +
			`</div>`);
		}
	);
}

function checkCookie() {
	var approved = getCookie('approved');

	if (approved != '') {
		hidePswrdContainer();

		getData();
	}
	else {
		passwordCotainer.css('visibility', 'visible');
	}
}

function checkPassword(event) {
	errorContainer.css('visibility', 'hidden');

	if (event.target.value == 'p1nk') {
		hidePswrdContainer();

		setCookie('approved', 'true', 30);

		getData();
	}
	else if (event.keyCode == 13) {
		event.preventDefault();

		errorContainer.css('visibility', 'visible');
	}
}

function closePopUp() {
	var focused = $('.focused');

	if (focused) {
		focused.removeClass('focused');
		wrapper.removeClass('modal-active');
	}
}

function createNoteSelector(increment) {
	return (increment) ? '.note-' + getNextNote() : '.note-' + getPrevNote();
}

function cyclePopUp(incDec) {
	var newNote = $(createNoteSelector(incDec));

	$('.focused').removeClass('focused');

	popUp.html(newNote.html());

	newNote.addClass('focused');
}

function getCurrentNote() {
	var curNote = $('.focused');
	var note = 0;

	if (curNote) {
		note = curNote.data('index');
	}

	return parseInt(note, 10);
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
			notesLength = response.length;
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

function getNextNote() {
	var nextNote = getCurrentNote() + 1;

	if (nextNote == notesLength) {
		nextNote = 0
	}

	return nextNote;
}

function getPrevNote() {
	var currentNote = getCurrentNote();

	if (currentNote == 0) {
		currentNote = notesLength;
	}

	return currentNote - 1;
}

function hidePswrdContainer() {
	passwordCotainer.remove();
	wrapper.removeClass('password-active');
}

function openPopUp(target) {
	wrapper.addClass('modal-active');
	target.addClass('focused');

	var popupContent = target.html();

	popUp.html(popupContent);
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

grid.on(
	'click',
	'.note-card',
	function() {
		openPopUp($(this));
	}
);

$('.controls').on(
	'click',
	'.cycle',
	function(event) {
		event.stopImmediatePropagation();

		var curTarget = $(this);

		if (curTarget.hasClass('next')) {
			cyclePopUp(true);
		}
		else if (curTarget.hasClass('prev')) {
			cyclePopUp(false);
		}
	}
);

$('.close').on('click', closePopUp);

$('.overlay').on('click', closePopUp)

$('.pop-up').on(
	'click',
	function(event) {
		event.stopImmediatePropagation();
	}
);


$(document).on(
	'keydown',
	function (event) {
		var keyCode = event.keyCode;

		if (keyCode == 39) {
			cyclePopUp(true);
		}
		else if (keyCode == 37) {
			cyclePopUp(false);
		}
		else if (keyCode == 27) {
			closePopUp();
		}
		else if (keyCode == 13) {
			openPopUp($(event.currentTarget.activeElement));
		}
	}
);