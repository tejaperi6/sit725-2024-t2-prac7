$(document).ready(function() {
    $('#contactForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting via the browser
        
        const formData = {
            name: $('#name').val(),
            movieSuggestion: $('#movie_suggestion').val(),
            email: $('#email').val(),
            numberOfSeats: $('#number_of_seats').val()
        };

        
        
        $.ajax({
            type: 'POST',
            url: '/movies', // Ensure this matches your server endpoint
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                console.log(response); // Check what is logged in the console
                alert("Form is saved successfully");

                // Update the page with the returned data
                $('#display-name').text(response.contact.name);
                $('#display-movieSuggestion').text(response.contact.movieSuggestion);
                $('#display-email').text(response.contact.email);
                $('#display-numberOfSeats').text(response.contact.numberOfSeats);
            },
            error: function(error) {
                alert('Error saving contact: ' + error.responseText);
            }
        });
    });

});
let socket = io();
socket.on('number',(msg)=>{
console.log('Random Number: ' + msg);
})