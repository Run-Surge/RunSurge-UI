# 📄 User Jobs Dashboard Integration

This document outlines the implementation of the API request to fetch all jobs submitted by a logged-in user, and how this endpoint can be integrated into the user's dashboard.

This is a python fast API backend not Next.js backend

## ✅ Implementation Status: **COMPLETED**

The `/api/users/jobs` endpoint has been successfully integrated into the Next.js frontend dashboard.

---

## 🔗 API Endpoint

**URL:** `/api/users/jobs`  
**Method:** `GET`  
**Authentication:** Required (User must be logged in)

---

## 📥 Request

This endpoint does not require any body parameters, but it depends on the **authenticated user**. Make sure the access token is attached (e.g., in the `Authorization` header).

```http
GET /api/users/jobs HTTP/1.1
Authorization: Bearer <access_token>
```

## 📤 Response
### ✅ Success Response (200 OK)
```json
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
    }
    // ... more jobs
  ],
  "message": "Jobs fetched successfully",
  "success": true
}
```

## 🛠️ Backend Implementation (FastAPI)

```python
@router.get("/jobs")
async def get_user_jobs(
    current_user: User = Depends(get_current_user_optional),
    session: AsyncSession = Depends(get_db)
):
    """Get all jobs submitted by the current user."""
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
```

## 🎯 Frontend Integration (Next.js)

### Service Layer
- **File:** `src/lib/jobsService.js`
- **Method:** `jobsService.getUserJobs()`
- **Endpoint:** Uses `API_ENDPOINTS.USER_JOBS` (`/api/users/jobs`)

### Dashboard Component
- **File:** `src/app/dashboard/DashboardPage.js`
- **Features:**
  - Fetches user jobs on component mount
  - Displays jobs in a responsive table
  - Shows job statistics (total, completed, running)
  - Handles loading states and error states
  - Transforms backend response to match frontend expectations

### Authentication
- Uses HTTP-only cookies for secure authentication
- Automatically includes cookies in requests via `credentials: 'include'`
- Integrates with `AuthContext` for user authentication state

### Data Transformation
The frontend transforms the FastAPI response format:
```javascript
// Backend format -> Frontend format
{
  job_id: 1,           -> id: 1,
  job_name: "test",    -> name: "test",
  job_type: "simple",  -> type: "simple",
  status: "pending",   -> status: "pending",
  created_at: "...",   -> created_at: "..."
}
```

### Error Handling
- Network errors are caught and displayed to user
- Failed API responses show error messages
- Retry functionality available for failed requests
- Loading states provide user feedback

## 🚀 Usage

The dashboard automatically loads user jobs when:
1. User is authenticated (`user` exists in AuthContext)
2. Component mounts (`useEffect` dependency on `user`)
3. API call to `/api/users/jobs` succeeds

The integration is complete and ready for production use with the FastAPI backend.
