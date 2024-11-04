from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# In-memory storage for users
users = []
next_id = 1


@app.route('/users', methods=['GET'])
def get_users():
    """
    Get all users
    ---
    description: Fetch all users from the in-memory database.
    """
    return jsonify(users), 200


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    """
    Get a user by ID
    ---
    description: Fetch a specific user by their ID.
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: User's unique ID.
    """
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify(user), 200
    else:
        return "User not found", 404


@app.route('/users', methods=['DELETE'])
def delete_all_users():
    """
    Delete all users
    ---
    description: Delete all users from the in-memory database.
    """
    global users, next_id
    users = []
    next_id = 1
    return jsonify(users), 200


@app.route('/users', methods=['POST'])
def add_user():
    """
    Add a new user
    ---
    description: Add a new user to the in-memory database.
    parameters:
      - name: name
        in: body
        type: string
        required: true
        description: User's name.
    """
    global next_id
    name = request.json.get('name')
    if not name or not isinstance(name, str) or not name.strip():
        return "Name is required and must be a non-empty string", 400
    new_user = {'id': next_id, 'name': name.strip(), 'hoursWorked': 0}
    users.append(new_user)
    next_id += 1
    return jsonify(new_user), 201


@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Update a user by ID
    ---
    description: Update the name of an existing user by their ID.
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: User's unique ID.
      - name: name
        in: body
        type: string
        required: false
        description: User's new name (optional).
    """
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        name = request.json.get('name')
        if name and isinstance(name, str) and name.strip():
            user['name'] = name.strip()
        return jsonify(user), 200
    else:
        return "User not found", 404


@app.route('/users/<int:user_id>', methods=['PATCH'])
def update_user_hours(user_id):
    """
    Update hours worked for a user by adding a value
    ---
    description: Update the hours worked for a user by adding a specific value.
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: User's unique ID.
      - name: hoursToAdd
        in: body
        type: integer
        required: true
        description: Number of hours to add to the user's hoursWorked.
    """
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        hours_to_add = request.json.get('hoursToAdd')
        if isinstance(hours_to_add, (int, float)):
            user['hoursWorked'] += hours_to_add
            return jsonify(user), 200
        else:
            return "Invalid hoursToAdd value", 400
    else:
        return "User not found", 404


@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a user by ID
    ---
    description: Delete a user from the in-memory database by their ID.
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: User's unique ID.
    """
    user_index = next((i for i, u in enumerate(users)
                      if u['id'] == user_id), None)
    if user_index is not None:
        deleted_user = users.pop(user_index)
        return jsonify(deleted_user), 200
    else:
        return "User not found", 404


if __name__ == '__main__':
    app.run(port=5002, debug=True)
