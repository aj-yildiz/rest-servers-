
# Rust API Server - Setup Instructions

## File Extension
- Rust source code files use the `.rs` extension.
- Save the server code provided in a file named `main.rs`.

## Installation Instructions

### Install Rust on Windows
1. Go to the [official Rust website](https://www.rust-lang.org/tools/install).
2. Download and run the `rustup-init.exe` installer.
3. Follow the on-screen instructions to install Rust.
4. Once installed, verify the installation by running the following command in Command Prompt (CMD):
   ```sh
   rustc --version
   ```
   You should see the installed Rust version.

### Install Rust on macOS
1. Open Terminal and run the following command to install Rust via `rustup`:
   ```sh
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
2. Follow the on-screen instructions to complete the installation.
3. Once installed, verify the installation by running:
   ```sh
   rustc --version
   ```
   You should see the installed Rust version.

## Running the Server

1. Clone this repository to your local machine or create a new directory for the server code.
   ```sh
   cd src/servers/rust-server
   ```
1. Save the server code provided into a file named `main.rs` inside the project directory.

1. Initialize a new Rust project (optional but recommended for better structure):
  
1. Run the server using Cargo:
   ```sh
   cargo run
   ```

1. The server will start on port `5012`. You can verify that the server is running by accessing the following URL in your browser or using a tool like `curl`:
   ```
   http://localhost:5012/users
   ```

## Endpoints

The server exposes the following REST API endpoints:

1. **GET /users** - Retrieve all users.
2. **GET /users/{id}** - Retrieve a user by ID.
3. **POST /users** - Add a new user.
4. **PUT /users/{id}** - Update a user by ID.
5. **PATCH /users/{id}** - Update the hours worked for a user by adding a value.
6. **DELETE /users/{id}** - Delete a user by ID.
7. **DELETE /users** - Delete all users.
