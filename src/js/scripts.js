(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    $('#app').fullpage();

    $('.never-gonna-give-you-up').on('click', function(e) {
      e.preventDefault();

      var roll;
      if ($(document).width() > 799) {
        roll = '<div id="rolled"><div class="video"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe></div></div>'
      } else {
        roll = '<div id="rolled"><div class="video"><iframe src="https://giphy.com/embed/Vuw9m5wXviFIQ" width="100%" height="100%" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div></div>'
      }
      $('#rick').html(roll);
      $.confetti.start();

      setTimeout(function() {
        $.confetti.stop();
        $('#rick').html('');
      }, 212000)
    });

    $('#rsvp a').on('click', function(e) {
      e.preventDefault();
      $('#rsvp-form').show();
    })
    $('#rsvp-form .close').on('click', function(e) {
      e.preventDefault();
      $('#rsvp-form').find(".success").hide();
      $('#rsvp-form').find(".fail").hide();
      $('#rsvp-form').find("form").show();
      $('#rsvp-form').hide();
    })
    $('#rsvp-form button').on('click', function(e) {
      e.preventDefault();
      console.log($(this).data('response'))
    })

    var $form = $('#rsvp-form form');

    $form.find('button').on('click', function(e) {
    	// check if button is enabled
    	if (isButtonEnabled($(this))) {
    		// prevent default clicking event
    		e.preventDefault();

    		// gather form data we know about
    		var formData = {
    			'name': $form.find('#input-name').text(),
    			'email': $form.find('#input-email').text(),
    			'dietary_reqs': $form.find('#input-dietary-reqs').text(),
          'response': $(this).data('response')
    		};

    		// validate the form data and get form object back
    		var formValidation = validateForm(formData);
    		if (formValidation.valid) {

    			// disable button while submitting
    			var buttonEl = $(this);
    			buttonDisable(buttonEl)

    			// Submit the form to google sheets
    			$.ajax({
    		    url: "https://script.google.com/a/lamasix.com/macros/s/AKfycbw25Kuti_w5RMFjNLugJcjRCUU1elkBlZ6La5XABJCxFVw7Kck/exec",
    		      type: "post",
    		      data: formData
    		  }).done(function(response){
            if (response.result == 'error' ) {
              showFailure($form);
      				buttonEnable(buttonEl);
              console.log(response.error.message);
            } else {
              // show success and enable button
      		  	showSuccess($form);
      		  	buttonEnable(buttonEl);
            }
    			}).fail(function(){
    				// show failure message and enable button
    				showFailure($form);
    				buttonEnable(buttonEl);
    		  });
    		} else {
    			// alert with form errors
    			alert(formValidation.errorMessage);
    		}
    	}
    });

    function validateForm(formData) {
    	// Create a response obj
    	var response = {
    		valid: true,
    		errorMessage: ""
    	}

    	// Look for empty fields, all are required
    	for (var key in formData) {
    		if (formData[key] == "") {
    			response.errorMessage += "Enter a value for " + key + ".\n";
    		}
    	}

    	// Check for valid email formation
    	if (!validateEmail(formData['email'])) {
    		response.errorMessage += "Enter a valid email address.";
    	}

    	// If we have errors, prepend the message
    	if (response.errorMessage.length > 0) {
    		response.errorMessage = "Please correct the following errors: \n" + response.errorMessage;
    		response.valid = false;
    	}
    	return response;
    }

    function showSuccess(formEl) {
      $(formEl).find("div.input").empty();
      $('#rsvp-form').find("form").hide();
      $('#rsvp-form').find(".success").show();
    }

    function showFailure(formEl) {
    	// Show failure div
    	$('#rsvp-form').find(".fail").show();
    }

    function buttonEnable(buttonEl) {
    	// Enable button and reset text
    	$(buttonEl).removeAttr('disabled');
    }

    function buttonDisable(buttonEl) {
    	// Set text and disable button
    	$(buttonEl).attr('disabled','disabled');
    }

    function isButtonEnabled(buttonEl) {
    	// Check if button is enabled
    	return ($(buttonEl).attr('disabled') != "disabled")
    }
    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

  });

})(jQuery, window, document);
