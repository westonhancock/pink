var btn = document.querySelector('button');
var form = document.querySelector('form');

function submitForm(e) {
	e.preventDefault();

	form.classList.add('loading');

	WeDeploy
		.data('db-pink.wedeploy.io')
		// .data('db-pinkdev.wedeploy.io')
		.create(
			'notes',
			{
				'message': escape(form.message.value),
				'name': escape(form.name.value)
			}
		)
		.then(
			function(response) {
				form.innerHTML = '<h2>Thank you for your message</h2>';
				form.classList.remove('loading');

				console.info('Saved:', response);
			}
		)
		.catch(
			function(error) {
				var span = document.createElement('span');

				span.classList.add('error-message');
				span.append('Sorry, there has been an error. Please refresh the page and try again.');

				form.append(span);
				form.classList.remove('loading');
				form.classList.add('error');

				btn.setAttribute('disabled', '');

				console.error(error);
			}
		);
}

function validate() {
	if (form.name.value && form.message.value && form.classList) {
		btn.removeAttribute('disabled');
	}
	else {
		btn.setAttribute('disabled', '');
	}
}

if (form && btn) {
	form.addEventListener('submit', submitForm);
	form.message.addEventListener('input', validate);
	form.name.addEventListener('input', validate);
}
