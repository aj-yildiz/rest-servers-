
# API Routes Documentation

This document describes the REST API endpoints for managing users. The server runs on `http://localhost:5002`.

### 1. Get All Users
- **Endpoint**: `GET /users`
- **Description**: Fetches a list of all users.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: Array of user objects.
  ```json
  [
    {
      "id": 1,
      "name": "Alice",
      "hoursWorked": 10
    },
    {
      "id": 2,
      "name": "Bob",
      "hoursWorked": 5
    }
  ]
  ```

### 2. Get User by ID
- **Endpoint**: `GET /users/:id`
- **Description**: Fetches a specific user by their ID.
- **Path Parameter**: `id` (integer) - The ID of the user.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: User object.
  ```json
  {
    "id": 1,
    "name": "Alice",
    "hoursWorked": 10
  }
  ```
  - **Status**: `404 Not Found` if the user does not exist.

### 3. Add a New User
- **Endpoint**: `POST /users`
- **Description**: Adds a new user to the list.
- **Request Body**:
  - **Required**: `{ "name": "string" }`
- **Response**:
  - **Status**: `201 Created`
  - **Body**: The newly created user object.
  ```json
  {
    "id": 3,
    "name": "Charlie",
    "hoursWorked": 0
  }
  ```
  - **Status**: `400 Bad Request` if the name is missing or empty.

### 4. Update User by ID
- **Endpoint**: `PUT /users/:id`
- **Description**: Updates a user's information.
- **Path Parameter**: `id` (integer) - The ID of the user.
- **Request Body**:
  - **Optional**: `{ "name": "string" }`
- **Response**:
  - **Status**: `200 OK`
  - **Body**: The updated user object.
  ```json
  {
    "id": 1,
    "name": "Alice Updated",
    "hoursWorked": 15
  }
  ```
  - **Status**: `404 Not Found` if the user does not exist.

### 5. Update Hours Worked for a User
- **Endpoint**: `PATCH /users/:id`
- **Description**: Adds hours to a user's `hoursWorked` field.
- **Path Parameter**: `id` (integer) - The ID of the user.
- **Request Body**:
  - **Required**: `{ "hoursToAdd": number }`
- **Response**:
  - **Status**: `200 OK`
  - **Body**: The updated user object.
  ```json
  {
    "id": 1,
    "name": "Alice",
    "hoursWorked": 20
  }
  ```
  - **Status**: `400 Bad Request` if `hoursToAdd` is invalid.
  - **Status**: `404 Not Found` if the user does not exist.

### 6. Delete User by ID
- **Endpoint**: `DELETE /users/:id`
- **Description**: Deletes a specific user by their ID.
- **Path Parameter**: `id` (integer) - The ID of the user.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: The deleted user object.
  ```json
  {
    "id": 1,
    "name": "Alice",
    "hoursWorked": 10
  }
  ```
  - **Status**: `404 Not Found` if the user does not exist.

### 7. Delete All Users
- **Endpoint**: `DELETE /users`
- **Description**: Deletes all users from the list.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: An empty array.
  ```json
  []
  ```

## Example User Object
```json
{
  "id": 1,
  "name": "Alice",
  "hoursWorked": 10
}
```

## Notes
- The `id` field is auto-incremented for each new user.
- All CORS requests from `localhost` are allowed.
