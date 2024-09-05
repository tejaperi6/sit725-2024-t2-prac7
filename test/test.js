import { expect } from 'chai';
import request from 'request';
import express from 'express';
import bodyParser from 'body-parser';

// Create a mock of the Express app with the saveContact route
const app = express();
app.use(bodyParser.json());

// Function to validate email format
const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Mock the saveContact function
const saveContact = (req, res) => {
    console.log('Received request body:', req.body); // Log the request body
    
    try {
        const { name, movieSuggestion, email, numberOfSeats } = req.body;
        
        // Basic validation
        if (!name || !email || !movieSuggestion || numberOfSeats === undefined) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Validate numberOfSeats
        if (typeof numberOfSeats !== 'number' || isNaN(numberOfSeats) || numberOfSeats < 1) {
            return res.status(400).json({ error: 'Invalid number of seats.' });
        }

        // Simulate saving the contact (mocked)
        const newContact = { name, movieSuggestion, email, numberOfSeats };
        
        // Simulate a successful save response
        res.status(201).json({
            message: 'Contact saved successfully',
            contact: newContact
        });
    } catch (error) {
        console.error('Error saving contact:', error); // Log the error
        res.status(500).json({
            message: 'An unexpected error occurred. Please try again later'
        });
    }
};

// Setup the route
app.post('/saveContact', saveContact);

// Start the server
const server = app.listen(3040);

// Base URL for API endpoint
const baseUrl = 'http://localhost:3040/saveContact';

// Stop the server after tests
after(() => {
    server.close();
});

describe('Save Contact API', function() {
    this.timeout(5000);

    it('should save a contact successfully', function(done) {
        const validContactData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            email: "saiteja.phani@gmail.com",
            numberOfSeats: 3
        };

        request.post({ url: baseUrl, json: validContactData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(201);
                expect(body).to.have.property('message', 'Contact saved successfully');
                expect(body.contact).to.deep.include(validContactData);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for missing required fields', function(done) {
        const incompleteData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            email: "saiteja.phani@gmail.com"
            // numberOfSeats is missing
        };

        request.post({ url: baseUrl, json: incompleteData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('error', 'All fields are required.');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for missing email field', function(done) {
        const missingEmailData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            numberOfSeats: 3
        };

        request.post({ url: baseUrl, json: missingEmailData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('error', 'All fields are required.');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for missing movie suggestion field', function(done) {
        const missingMovieSuggestionData = {
            name: "Teja Peri",
            email: "saiteja.phani@gmail.com",
            numberOfSeats: 3
        };

        request.post({ url: baseUrl, json: missingMovieSuggestionData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('error', 'All fields are required.');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for invalid number of seats', function(done) {
        const invalidSeatsData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            email: "saiteja.phani@gmail.com",
            numberOfSeats: 'three' // Invalid type
        };

        request.post({ url: baseUrl, json: invalidSeatsData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('error', 'Invalid number of seats.');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for number of seats at minimum value (1)', function(done) {
        const minSeatsData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            email: "saiteja.phani@gmail.com",
            numberOfSeats: 1 
        };

        request.post({ url: baseUrl, json: minSeatsData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(201);
                expect(body).to.have.property('message', 'Contact saved successfully');
                expect(body.contact).to.deep.include(minSeatsData);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for number of seats at maximum value (e.g., 1000)', function(done) {
        const maxSeatsData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            email: "saiteja.phani@gmail.com",
            numberOfSeats: 1000           
        };

        request.post({ url: baseUrl, json: maxSeatsData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(201);
                expect(body).to.have.property('message', 'Contact saved successfully');
                expect(body.contact).to.deep.include(maxSeatsData);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for invalid email format', function(done) {
        const invalidEmailData = {
            name: "Teja Peri",
            movieSuggestion: "Avengers",
            email: "invalid-email",
            numberOfSeats: 3
        };

        request.post({ url: baseUrl, json: invalidEmailData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('error', 'Invalid email format.');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('should return status 400 for empty string values', function(done) {
        const emptyStringData = {
            name: "",
            movieSuggestion: "",
            email: "",
            numberOfSeats: 3
        };

        request.post({ url: baseUrl, json: emptyStringData }, function(error, response, body) {
            if (error) return done(error);
            try {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('error', 'All fields are required.');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

});
