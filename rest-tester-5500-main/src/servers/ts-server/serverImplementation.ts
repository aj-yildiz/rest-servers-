import express, { Request, Response } from 'express';
import cors from 'cors';
import { User } from '../../User';

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));

// In-memory storage for users
let users: User[] = [];
let nextId = 1;

/**
 * @api {get} /users Get all users
 * @apiName GetUsers
 * @apiGroup User
 * @apiDescription Fetch all users from the in-memory database.
 */
app.get('/users', (req: Request, res: Response) => {
    console.log('GET /users - Fetching all users');
    res.json(users);
});

/**
 * @api {get} /users/:id Get a user by ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiParam {Number} id User's unique ID.
 * @apiDescription Fetch a specific user by their ID.
 */
app.get('/users/:id', (req: Request, res: Response) => {
    console.log(`GET /users/:id - Fetching user with ID: ${req.params.id}`);
    const user = users.find(u => u.id === Number(req.params.id)); // Find the user by ID
    if (user) {
        console.log(`User found: ${JSON.stringify(user)}`);
        res.json(user);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

/**
 * @api {delete} /users Delete all users
 * @apiName DeleteAllUsers
 * @apiGroup User
 * @apiDescription Delete all users from the in-memory database.
 */
app.delete('/users', (req: Request, res: Response) => {
    console.log(`DELETE /users - Deleting all users`);
    users = [];
    res.json(users);
    nextId = 1;
});

/**
 * @api {post} /users Add a new user
 * @apiName AddUser
 * @apiGroup User
 * @apiParam {String} name User's name.
 * @apiDescription Add a new user to the in-memory database.
 */
app.post('/users', (req: Request, res: Response) => {
    console.log('POST /users - Adding new user');
    const { name } = req.body;
    if (typeof name !== 'string' || !name.trim()) {
        console.log('Invalid name provided');
        res.status(400).send('Name is required and must be a non-empty string');
        return;
    }
    const newUser: User = { id: nextId, name: name.trim(), hoursWorked: 0 };
    nextId++;
    users.push(newUser);
    console.log(`New user added: ${JSON.stringify(newUser)}`);
    res.status(201).json(newUser);
});

/**
 * @api {put} /users/:id Update a user by ID
 * @apiName UpdateUserById
 * @apiGroup User
 * @apiParam {Number} id User's unique ID.
 * @apiParam {String} name User's new name (optional).
 * @apiDescription Update the name of an existing user by their ID.
 */
app.put('/users/:id', (req: Request, res: Response) => {
    console.log(`PUT /users/:id - Updating user with ID: ${req.params.id}`);
    const user = users.find(u => u.id === Number(req.params.id)); // Find the user by ID
    if (user) {
        const { name } = req.body;
        if (typeof name === 'string' && name.trim()) {
            user.name = name.trim();
            console.log(`Updated user name to: ${user.name}`);
        }
        res.json(user);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

/**
 * @api {patch} /users/:id Update hours worked for a user by adding a value
 * @apiName UpdateUserHours
 * @apiGroup User
 * @apiParam {Number} id User's unique ID.
 * @apiParam {Number} hoursToAdd Number of hours to add to the user's hoursWorked.
 * @apiDescription Update the hours worked for a user by adding a specific value.
 */
app.patch('/users/:id', (req: Request, res: Response) => {
    console.log(`PATCH /users/:id/hours - Updating hours for user with ID: ${req.params.id}`);
    const user = users.find(u => u.id === Number(req.params.id)); // Find the user by ID
    if (user) {
        const { hoursToAdd } = req.body;
        if (typeof hoursToAdd === 'number') {
            user.hoursWorked += hoursToAdd;
            console.log(`Added ${hoursToAdd} hours. Total hours worked: ${user.hoursWorked}`);
            res.json(user);
        } else {
            console.log('Invalid hoursToAdd value');
            res.status(400).send('Invalid hoursToAdd value');
        }
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});

/**
 * @api {delete} /users/:id Delete a user by ID
 * @apiName DeleteUserById
 * @apiGroup User
 * @apiParam {Number} id User's unique ID.
 * @apiDescription Delete a user from the in-memory database by their ID.
 */
app.delete('/users/:id', (req: Request, res: Response) => {
    console.log(`DELETE /users/:id - Deleting user with ID: ${req.params.id}`);
    const userIndex = users.findIndex(u => u.id === Number(req.params.id)); // Find the index of the user by ID
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        console.log(`User deleted: ${JSON.stringify(deletedUser)}`);
        res.json(deletedUser);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});



export default app;