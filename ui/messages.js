var grid = $('.grid');
var wrapper = $('#wrapper');
var popUp = $('.pop-up');

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

