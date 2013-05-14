window.adversify.views.PublisherSignupView = (function() {
	return Backbone.View.extend({
		initialize: function(options) {
			this.setModel(options.publisherModel);
			this.template = _.template(this.getTemplate("publisherSignup"));
		},

		events: {
			"click .submit-publisher-signup" : "submitPublisherSignup"
		},

		render : function () {
			console.log('publisherSignup render');
			this.$el.html(this.template({publisher : this.model}));
		},

		setModel : function(model) {
			this.model = model;
		},

		submitPublisherSignup: function(evt) {
			evt.preventDefault();
			var publisherSignupForm = this.$('#publisher-signup')[0];
			var publisherHash = {
				username : publisherSignupForm['username'].value,
				email : publisherSignupForm['email'].value,
				password : publisherSignupForm['password'].value,
				passwordConfirm : publisherSignupForm['password-confirm'].value
			};
			if(publisherHash.password === publisherHash.passwordConfirm) {
				this.model.save(publisherHash, {
					success: function(model, response, options) {
						alert("Success");
					},
					error: function(model, xhr, options) {
						console.log("Error!");
					}
				});
			} else {
				console.log("Passwords are not equal!");
			}
		}

	});
})();