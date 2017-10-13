var errorContainer = $('.error-container');
var grid = $('.grid');
var passwordCotainer = $('.password-container');
var popUp = $('.pop-up .pop-up-content');
var body = $('body');

var notesLength = 0;

var readTime = {};

function appendNotes(notes) {
	var openedMessages = getOpenedMessages();

	notes.forEach(
		function(note, index) {
			var heartClass = 'fa-heart-o';

			messageLength = unescape(note.message).split(' ').length;

			if (openedMessages.includes(note.id)) {
				heartClass = 'fa-heart';
			}

			grid.append(
				'<div class="note-card note-' + index + '" data-entry-id="' + note.id + '" data-index="' + index + '" data-message-length="' + messageLength + '" tabindex="0">' +
					'<div class="card-content">' +
						'<i class="fa ' + heartClass + '" aria-hidden="true"></i>' +
						'<div class="message">' + unescape(note.message) + '</div>' +
						'<div class="author">' + unescape(note.name) + '</div>' +
					'</div>' +
				'</div>'
			);
		}
	);
}

function checkCookie() {
	var _pswd = getCookie('_pswd');

	if (_pswd == atob('cDFuaw==')) {
		hidePswdContainer();

		getData();
	}
	else {
		passwordCotainer.css('visibility', 'visible');
	}
}

function checkPswd(event) {
	errorContainer.css('visibility', 'hidden');

	if (btoa(event.target.value) == atob('Y0RGdWF3PT0=')) {
		hidePswdContainer();

		setCookie('_pswd', atob('cDFuaw=='), 30);

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
		body.removeClass('modal-active');
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

	timeoutLength = (newNote.data('messageLength') / 10) * 1000;

	clearTimeout(readTime);

	readTime = setTimeout(
		function() {
			if (newNote.hasClass('focused')) {
				setOpenedMessages(newNote.data('entryId'));

				fillHeart(newNote);
				fillHeart(popUp);
			}
		},
		timeoutLength
	);

}

function fillHeart(note) {
	var noteHeart = note.find('.fa-heart-o');

	if (noteHeart) {
		noteHeart.removeClass('fa-heart-o');
		noteHeart.addClass('fa-heart');
	}
}

function getBrowser() {
	var userAgent = navigator.userAgent;
	var temp = [];
	var info = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

	if (/trident/i.test(info[1])) {
		temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

		return {name: 'IE', version: (temp[1]||'')};
	}

	if (info[1] === 'Chrome') {
		temp = userAgent.match(/\bOPR|Edge\/(\d+)/);

		if (temp != null) {
			return {name: 'Opera', version: temp[1]};
		}
	}

	info = info[2] ? [info[1], info[2]] : [navigator.appName, navigator.appVersion, '-?'];

	if ((temp = userAgent.match(/version\/(\d+)/i)) != null) {
		info.splice(1, 1, temp[1]);
	}

	return {name: info[0], version: info[1]};
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
		.data('db-pink.wedeploy.io')
		.orderBy('id', 'desc')
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

function getOpenedMessages() {
	var opened = getCookie('OPENED');

	return opened.split(',');
}

function getPrevNote() {
	var currentNote = getCurrentNote();

	if (currentNote == 0) {
		currentNote = notesLength;
	}

	return currentNote - 1;
}

function handleControls(event) {
	event.stopImmediatePropagation();

	var curTarget = $(this);

	if (curTarget.hasClass('next')) {
		cyclePopUp(true);
	}
	else if (curTarget.hasClass('prev')) {
		cyclePopUp(false);
	}
}

function handleKeypress(event) {
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
		var activeCard = $(event.currentTarget.activeElement);

		if (activeCard.hasClass('note-card')) {
			openPopUp(activeCard);
		}
	}
}

function hidePswdContainer() {
	passwordCotainer.remove();
	body.removeClass('password-active');
}

function openPopUp(target) {
	body.addClass('modal-active');
	target.addClass('focused');

	var popupContent = target.html();

	popUp.html(popupContent);

	timeoutLength = (target.data('messageLength') / 7) * 1000

	readTime = setTimeout(
		function() {
			if (target.hasClass('focused')) {
				setOpenedMessages(target.data('entryId'));

				fillHeart(target);
				fillHeart(popUp);
			}
		},
		300 + timeoutLength
	);
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();

	d.setTime(d.getTime() + (exdays*24*60*60*1000));

	var expires = "expires=" + d.toGMTString();

	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setOpenedMessages(newOpened) {
	var opened = getCookie('OPENED');

	if (!opened) {
		opened = newOpened;
	}
	else {
		opened += ',' + newOpened;
	}

	setCookie('OPENED', opened, 1000);
}

function scrollContent() {
	$('html, body').animate(
		{
			scrollTop: grid.offset().top + 76
		}
	)
}

$(document).on('keydown', handleKeypress);

$('.controls').on( 'click', '.cycle', handleControls);

$('.close').on('click', closePopUp);

grid.on(
	'click',
	'.note-card',
	function() {
		openPopUp($(this));
	}
);

$('.pop-up, .overlay').on('click', closePopUp);

$('.controls, .pop-up-content').on(
	'click',
	function(event) {
		event.stopImmediatePropagation();
	}
);

$('.scroll-down').on('click', scrollContent);

var browser = getBrowser()

body.addClass(browser.name.toLowerCase());
body.addClass('version-' + browser.version.replace('.', '-'));