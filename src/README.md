🎯 Objective
Refactor the job creation flow to integrate with the backend API provided by a Python FastAPI server. Upon creating a new job, you should redirect the user to the following route:

bash
Copy
Edit
/job/{job_id}
This is necessary to continue with the data upload phase for that specific job.

⚙️ Backend Endpoint Specification
Endpoint:

bash
Copy
Edit
POST /api/job/
Request Type: multipart/form-data

Parameters:

Name	Type	Required	Description
job_name	string	✅	The name of the job
job_type	enum	✅	Type of the job (e.g., from a predefined enum JobType)
file	UploadFile	✅	Python script to be executed

Authentication:
The user must be authenticated. The session is expected to be validated via cookies (sent automatically by browser).

Successful Response:

json
Copy
Edit
{
  "job_id": 123,
  "job_name": "example",
  "status": "pending",
  "created_at": "2025-06-22T20:01:51.272456",
  ...
}
🧠 Task Requirements
✅ Keep the current UI unchanged.

✅ Collect form data (including the Python script) and send it via a POST request to the above endpoint using FormData.

✅ After receiving the response, extract job_id and navigate to /job/{job_id}.

✅ Handle any errors (e.g., backend 500s) gracefully and display a message if needed.