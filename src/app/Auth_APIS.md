# 🔐 FastAPI Authentication API

This project contains a FastAPI-based backend with user authentication functionality. It uses cookie-based token management to handle registration, login, and user session validation.

---

## 📋 Overview

The current implementation improves the standard API flow by:
- Unifying response formats (`user`, `message`, `success`/`status`).
- Storing access and refresh tokens in secure, HTTP-only cookies.
- Ensuring frontend compatibility with consistent JSON schemas.
- Avoiding inconsistent types from `/me`.

---

## 🚀 Authentication Endpoints

### ✅ `POST /register`

Registers a new user, sets tokens in cookies, and returns structured user data.

#### Request Body
```json
{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "securepassword"
}
Response
json
Copy
Edit
{
  "user": { ... },
  "message": "User registered successfully",
  "success": true
}
Implementation
python
Copy
Edit
@router.post("/register")
async def register(
    user: UserRegisterCreate,
    response: Response,
    session: AsyncSession = Depends(get_db)
):
    user_service = get_user_service(session)

    if await user_service.user_exists(user.username, user.email):
        raise HTTPException(status_code=400, detail="Username or email already exists")

    db_user = await user_service.create_user(user)
    tokens = security_manager.create_tokens(user=db_user)

    response.set_cookie("access_token", tokens["access_token"], httponly=True, samesite="lax", max_age=3600)
    response.set_cookie("refresh_token", tokens["refresh_token"], httponly=True, samesite="lax", max_age=604800)

    return {
        "user": db_user,
        "message": "User registered successfully",
        "success": True
    }
🔐 POST /login
Authenticates the user and sets tokens in cookies.

Request Body
json
Copy
Edit
{
  "username_or_email": "exampleuser",
  "password": "securepassword"
}
Response
json
Copy
Edit
{
  "user": { ... },
  "message": "User logged in successfully",
  "success": true
}
Implementation
python
Copy
Edit
@router.post("/login")
async def login(
    user: UserLoginCreate,
    response: Response,
    session: AsyncSession = Depends(get_db)
):
    user_service = get_user_service(session)
    db_user = await user_service.login_user(user)

    tokens = security_manager.create_tokens(user=db_user)

    response.set_cookie("access_token", tokens["access_token"], httponly=True, samesite="lax", max_age=3600)
    response.set_cookie("refresh_token", tokens["refresh_token"], httponly=True, samesite="lax", max_age=604800)

    return {
        "user": db_user,
        "message": "User logged in successfully",
        "success": True
    }
🙋‍♂️ GET /me
Returns the currently authenticated user.

Response (authenticated)
json
Copy
Edit
{
  "status": "authenticated",
  "user": { ... },
  "message": "User fetched successfully."
}
Response (unauthenticated)
json
Copy
Edit
{
  "status": "unauthenticated",
  "user": null,
  "message": "User not found or not logged in."
}
Implementation
python
Copy
Edit
api/users/me
@router.get("/me")
def get_current_user(current_user: User = Depends(get_current_user_optional)):
    if not current_user:
        return {
            "status": "unauthenticated",
            "user": None,
            "message": "User not found or not logged in."
        }

    return {
        "status": "authenticated",
        "user": current_user,
        "message": "User fetched successfully."
    }
🍪 Cookie Details
Token	Purpose	Max Age	HTTP-Only	SameSite
access_token	Auth session	1 hour	✅	lax
refresh_token	Token renewal	7 days	✅	lax