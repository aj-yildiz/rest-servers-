import { expect } from 'chai';
import request from 'supertest';
import app from './serverImplementation'; // Import the Express app
import { Server } from 'http';

let server: Server;

// Unit tests for the User API
describe('User API', () => {

    // Start the server before running tests
    beforeAll((done) => {
        server = app.listen(6000, done); // Start the server on port 6000
    });

    // Close the server after running tests
    afterAll((done) => {
        console.log('Closing server');
        server.close(done); // Close the server to ensure no open handles
    });

    // Reset the in-memory storage before each test
    beforeEach(() => {
        app.locals.users = []; // Clear the users array
        app.locals.nextId = 1; // Reset the nextId counter
    });

    // Test case: Fetch all users
    it('should fetch all users', async () => {
        const res = await request(app).get('/users'); // Send GET request to /users
        expect(res.status).to.equal(200); // Expect status 200 OK
        expect(res.body).to.be.an('array').that.is.empty; // Expect an empty array
    });

    // Test case: Add a new user
    it('should add a new user', async () => {
        const res = await request(app)
            .post('/users') // Send POST request to /users
            .send({ name: 'John Doe' }); // Send user data
        expect(res.status).to.equal(201); // Expect status 201 Created
        expect(res.body).to.have.property('id', 1); // Expect user ID to be 1
        expect(res.body).to.have.property('name', 'John Doe'); // Expect user name to be 'John Doe'
        expect(res.body).to.have.property('hoursWorked', 0); // Expect hoursWorked to be 0
    });

    // Test case: Fetch a user by ID
    it('should fetch a user by ID', async () => {
        await request(app).post('/users').send({ name: 'John Doe' }); // Add a user
        const res = await request(app).get('/users/1'); // Send GET request to /users/1
        expect(res.status).to.equal(200); // Expect status 200 OK
        expect(res.body).to.have.property('id', 1); // Expect user ID to be 1
        expect(res.body).to.have.property('name', 'John Doe'); // Expect user name to be 'John Doe'
        expect(res.body).to.have.property('hoursWorked', 0); // Expect hoursWorked to be 0
    });

    // Test case: Return 404 for a non-existent user
    it('should return 404 for a non-existent user', async () => {
        const res = await request(app).get('/users/999'); // Send GET request to /users/999
        expect(res.status).to.equal(404); // Expect status 404 Not Found
        expect(res.text).to.equal('User not found'); // Expect response text to be 'User not found'
    });

    // Test case: Update a user by ID
    it('should update a user by ID', async () => {
        await request(app).post('/users').send({ name: 'John Doe' }); // Add a user
        const res = await request(app)
            .put('/users/1') // Send PUT request to /users/1
            .send({ name: 'Jane Doe' }); // Send updated user data
        expect(res.status).to.equal(200); // Expect status 200 OK
        expect(res.body).to.have.property('id', 1); // Expect user ID to be 1
        expect(res.body).to.have.property('name', 'Jane Doe'); // Expect user name to be 'Jane Doe'
    });

    // Test case: Update hours worked for a user
    it('should update hours worked for a user', async () => {
        await request(app).post('/users').send({ name: 'John Doe' }); // Add a user
        const res = await request(app)
            .patch('/users/1') // Send PATCH request to /users/1
            .send({ hoursToAdd: 5 }); // Send hours to add
        expect(res.status).to.equal(200); // Expect status 200 OK
        expect(res.body).to.have.property('id', 1); // Expect user ID to be 1
        expect(res.body).to.have.property('hoursWorked', 5); // Expect hoursWorked to be 5
    });

    // Test case: Delete a user by ID
    it('should delete a user by ID', async () => {
        await request(app).post('/users').send({ name: 'John Doe' }); // Add a user
        const res = await request(app).delete('/users/1'); // Send DELETE request to /users/1
        expect(res.status).to.equal(200); // Expect status 200 OK
        expect(res.body[0]).to.have.property('id', 1); // Expect deleted user ID to be 1
    });

    // Test case: Delete all users
    it('should delete all users', async () => {
        await request(app).post('/users').send({ name: 'John Doe' }); // Add a user
        const res = await request(app).delete('/users'); // Send DELETE request to /users
        expect(res.status).to.equal(200); // Expect status 200 OK
        expect(res.body).to.be.an('array').that.is.empty; // Expect an empty array
    });
});