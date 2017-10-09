var notesList = document.querySelector('.notes-list');

WeDeploy
	.data('db-pink.wedeploy.io')
	// .data('db-pinkdev.wedeploy.io')
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
	var noteList = '';

	notes.forEach(function(note) {
		noteList += `<input type="text" value="${unescape(note.message)}" readonly>`;
	});

	notesList.innerHTML = noteList;
}