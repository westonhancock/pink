var form = document.querySelector('form');

form.addEventListener('submit', function(e) {
	e.preventDefault();

	form.classList.add('loading');

	WeDeploy
		.data('db-pink.wedeploy.io')
		.create('notes', {
			'name': form.name.value,
			'message': form.message.value
		})
		.then(function(response) {
			form.innerHTML = '<h2>Thank you for your message</h2>';
			form.classList.remove('loading');
			console.info('Saved:', response);
		})
		.catch(function(error) {
			var span = document.createElement("span");
			span.classList.add('error-message');
			span.append('Sorry, there has been an error. Please refresh the page and try again.')
			form.append(span);
			form.classList.remove('loading');
			form.classList.add('error');
			console.error(error);
		});
});