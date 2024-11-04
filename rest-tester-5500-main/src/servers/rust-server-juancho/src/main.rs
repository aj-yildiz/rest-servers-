use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use env_logger::Env;
use log::info;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct User {
    id: u32,
    name: String,
    hours_worked: f64,
}

struct AppState {
    users: Mutex<Vec<User>>,
    next_id: Mutex<u32>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize the logger
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let app_state = web::Data::new(AppState {
        users: Mutex::new(vec![]),
        next_id: Mutex::new(1),
    });

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allowed_methods(vec!["GET", "POST", "PUT", "PATCH", "DELETE"])
            .allowed_headers(vec![actix_web::http::header::CONTENT_TYPE])
            .max_age(3600);

        App::new()
            .app_data(app_state.clone())
            .wrap(cors)
            .route("/users", web::get().to(get_all_users))
            .route("/users/{id}", web::get().to(get_user_by_id))
            .route("/users", web::post().to(add_user))
            .route("/users/{id}", web::put().to(update_user))
            .route("/users/{id}", web::patch().to(update_user_hours))
            .route("/users/{id}", web::delete().to(delete_user))
            .route("/users", web::delete().to(delete_all_users))
    })
    .bind("127.0.0.1:5012")?
    .run()
    .await
}

async fn get_all_users(data: web::Data<AppState>) -> impl Responder {
    let users = data.users.lock().unwrap();
    info!("GET /users - Returning all users");
    HttpResponse::Ok().json(&*users)
}

async fn get_user_by_id(data: web::Data<AppState>, user_id: web::Path<u32>) -> impl Responder {
    let users = data.users.lock().unwrap();
    info!("GET /users/{} - Fetching user by ID", user_id);
    match users.iter().find(|u| u.id == *user_id) {
        Some(user) => HttpResponse::Ok().json(user.clone()),
        None => HttpResponse::NotFound().body("User not found"),
    }
}

async fn add_user(data: web::Data<AppState>, new_user: web::Json<UserRequest>) -> impl Responder {
    if new_user.name.trim().is_empty() {
        info!("POST /users - Invalid request body or missing name");
        return HttpResponse::BadRequest().body("Name is required and must be a non-empty string");
    }

    let mut users = data.users.lock().unwrap();
    let mut next_id = data.next_id.lock().unwrap();
    let user = User {
        id: *next_id,
        name: new_user.name.clone(),
        hours_worked: 0.0,
    };
    *next_id += 1;
    users.push(user.clone());
    info!("POST /users - Added new user: {:?}", user);
    HttpResponse::Created().json(user)
}

async fn update_user(data: web::Data<AppState>, user_id: web::Path<u32>, updated_user: web::Json<UserRequest>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    info!("PUT /users/{} - Updating user", user_id);
    match users.iter_mut().find(|u| u.id == *user_id) {
        Some(user) => {
            if !updated_user.name.trim().is_empty() {
                user.name = updated_user.name.clone();
            }
            info!("PUT /users/{} - Updated user: {:?}", user_id, user);
            HttpResponse::Ok().json(user.clone())
        }
        None => HttpResponse::NotFound().body("User not found"),
    }
}

async fn update_user_hours(data: web::Data<AppState>, user_id: web::Path<u32>, hours: web::Json<HoursRequest>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    info!("PATCH /users/{} - Updating hours worked", user_id);
    match users.iter_mut().find(|u| u.id == *user_id) {
        Some(user) => {
            user.hours_worked += hours.hoursToAdd;
            info!("PATCH /users/{} - Updated user hours: {:?}", user_id, user);
            HttpResponse::Ok().json(user.clone())
        }
        None => HttpResponse::NotFound().body("User not found"),
    }
}

async fn delete_user(data: web::Data<AppState>, user_id: web::Path<u32>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    info!("DELETE /users/{} - Deleting user", user_id);
    if let Some(index) = users.iter().position(|u| u.id == *user_id) {
        let deleted_user = users.remove(index);
        info!("DELETE /users/{} - Deleted user: {:?}", user_id, deleted_user);
        HttpResponse::Ok().json(deleted_user)
    } else {
        HttpResponse::NotFound().body("User not found")
    }
}

async fn delete_all_users(data: web::Data<AppState>) -> impl Responder {
    let mut users = data.users.lock().unwrap();
    users.clear();
    let mut next_id = data.next_id.lock().unwrap();
    *next_id = 1;
    info!("DELETE /users - Deleted all users");
    HttpResponse::Ok().json(users.clone())
}

#[derive(Deserialize)]
struct UserRequest {
    name: String,
}

#[derive(Deserialize)]
struct HoursRequest {
    hoursToAdd: f64,
}