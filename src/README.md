# 🧠 Jobs Dashboard UI (Next.js)

This project is a **frontend-only** implementation of a Job Submission Dashboard built with **Next.js** and **JavaScript**. It provides a user interface for submitting and tracking Jobs through a structured, multi-step process.

> ⚠️ This version is **UI-only** and does **not integrate with any backend or API** yet. It’s meant to serve as a foundation for later integration.

---

## 🚀 Features

### ✅ Job Status UI
Each Job has a clear status badge:
- `PENDING`
- `RUNNING`
- `COMPLETE`
- `FAILED`

Displayed on the **Dashboard**, with color-coded labels for clarity.

---

### 🖱 Submit Job Flow

On the main Dashboard:

- A button labeled **"Submit New Job"** is available.
- Clicking the button navigates to a dedicated submission page with **two tabs**:
  - `Simple Job`
  - `Complex Job`

Each tab offers:
- A form to **upload a Python script file** (initial step).
- After upload, the Job is considered "created", and the user is **redirected to a Job Detail Page**.

---

### 📄 Job Detail Page

- Displays Job metadata and current status.
- Allows the user to:
  - Upload associated **data files**.
  - Click a **"Submit Job"** button to mark the job as `PENDING`.

---

DO NOT modify the Register and Login pages, or their API requests
They are complete and correct 

The current API requests for the backend does not have seamless flow
Here are the respones returned from the BACKEND

@router.post("/register")
async def register(user: UserRegisterCreate, response: Response, session: AsyncSession = Depends(get_db)):
    user_service = get_user_service(session)
    if await user_service.user_exists(user.username, user.email):
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    db_user = await user_service.create_user(user)
    
    tokens = security_manager.create_tokens(user=db_user)
    
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600
    )
    
    response.set_cookie(
        key="refresh_token", 
        value=tokens["refresh_token"],
        httponly=True,
        secure=False, 
        samesite="lax",
        max_age=604800  
    )
    
    return {
        "user": db_user,
        "message": "User registered successfully",
        "success": True
    }

@router.post("/login")
async def login(user: UserLoginCreate, response: Response, session: AsyncSession = Depends(get_db)):
    user_service = get_user_service(session)
    db_user = await user_service.login_user(user)
    
    tokens = security_manager.create_tokens(user=db_user)
    
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=False,       
        samesite="lax",
        max_age=3600
    )
    
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=False,   
        samesite="lax",
        max_age=604800
    )
    
    return {
        "user": db_user,
        "message": "User logged in successfully",
        "success": True
    }

MODIFY THE CODE for those features to reflect correct backend integration 

ALSO here is the endpoint that the user authenticate itself with
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


Refactor the Home page (index) to be a modern Home page for parllel work distrubuited platform called
RunSurge, provide a navbar that has about us page. and Login and Register. in The Home page should be a button with a description of share your resources and start earning, this to a page that has some rules 

Implement the API request to get the user Jobs when the user login into his dashboard
The request on the backend at the following endpoint api/users/Jobs
Here is the response type
{
    "jobs": [
        {
            "job_id": 1,
            "status": "pending",
            "created_at": "2025-06-22T20:01:51.272456",
            "job_name": "test",
            "job_type": "simple"
        },
        {
            "job_id": 2,
            "status": "pending",
            "created_at": "2025-06-22T20:03:17.574214",
            "job_name": "test",
            "job_type": "simple"
        },
        {
            "job_id": 3,
            "status": "pending",
            "created_at": "2025-06-22T20:04:28.200895",
            "job_name": "test",
            "job_type": "simple"
        },
        {
            "job_id": 4,
            "status": "pending",
            "created_at": "2025-06-22T20:05:21.157550",
            "job_name": "test",
            "job_type": "simple"
        },
        {
            "job_id": 5,
            "status": "pending",
            "created_at": "2025-06-22T20:07:20.829249",
            "job_name": "test",
            "job_type": "simple"
        }
    ],
    "message": "Jobs fetched successfully",
    "success": true
}

and here is the route 
@router.get("/jobs")
async def get_user_jobs(
    current_user: User = Depends(get_current_user_optional),
    session: AsyncSession = Depends(get_db)
):
    """Get all jobs submitted by the current user."""
    print("current_user",current_user)
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    job_service = get_job_service(session)
    jobs = await job_service.get_user_jobs(current_user["user_id"])
    return {
        "jobs": [JobRead(
            job_id=job.job_id,
            job_name=job.job_name,
            job_type=job.job_type,
            status=job.status,
            created_at=job.created_at,
            user_id=current_user["user_id"]
        ) for job in jobs],
        "message": "Jobs fetched successfully",
        "success": True
    }
