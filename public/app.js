// import Vue from 'vue';
// import VeeValidate from 'vee-validate';
//  let VeeValidate = require('vee-validate');
Vue.use(VeeValidate);

let contact = new Vue({
	el: '#contact',
	data: {
		name: '',
		email: '',
		phone: '',
		messages: '',
		message: '',
	},

	//Define a method to makes an AJAX call to send the message to backend.
	methods: {
		//Defie a method to clear form inputs after submit
		resetForm() {
			// console.log('Reseting the form');
			let self = this; //you need this because *this* will refer to Object.keys below`
			self.name = '';
			self.email = '';
			self.phone = '';
			self.messages = '';
		},
		postContactForm: function(e) {
			// this.onSubmit()
			let postUser = {
				username: this.name,
				email: this.email,
				phone: this.phone,
				messages: this.messages,
			};
			console.log(postUser);
			axios
				.post('http://localhost:3007/send', postUser)
				.then(res => {
					if (res.data.msg === 'success') {
						this.message = 'Message is sent';
					} else if (res.data.msg === 'fail') {
						this.message = 'Message not sent';
					}
				})
				.catch(error => {
					console.log(error);
				});
			this.resetForm();
			e.preventDefault();
		},
		onSubmit(e) {
			this.$validator.validateAll().then(result => {
				if (result) {
					this.postContactForm();
				}
			});
			e.preventDefault();
		},
	},
});
