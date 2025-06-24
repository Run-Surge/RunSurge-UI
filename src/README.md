## 🌐 Backend API Integration

### ✅ Endpoint
```http
POST /api/group
🧾 Request Payload (multipart/form-data)
Field	Type	Description
group_name	string	Name of the job group
num_of_jobs	integer	Number of jobs/tasks
file	UploadFile	Python file (.py) to be processed

🛡️ Authentication
Authenticated via cookie (get_current_user_from_cookie)

If not authenticated, returns:

http
Copy
Edit
HTTP 401 Unauthorized
📥 Response Schema: GroupRead
On success, the response is:

json
Copy
Edit
{
  "group_id": 12,
  "group_name": "Batch Parser",
  "python_file_name": "parser.py",
  "num_of_jobs": 25,
  "created_at": "2025-06-24T14:35:22.123Z"
}
Use group_id to redirect the user to:

bash
Copy
Edit
/group/{group_id}
🔄 Fetch Group Details
✅ Endpoint
http
Copy
Edit
GET /api/group/{group_id}
🔁 Description
Fetches full details of a created group.

Required after successful creation to display group info on /group/{group_id}.

📥 Response Schema: GroupRead
Same as above:

json
Copy
Edit
{
  "group_id": 12,
  "group_name": "Batch Parser",
  "python_file_name": "parser.py",
  "num_of_jobs": 25,
  "created_at": "2025-06-24T14:35:22.123Z"
}
🛡️ Authentication
Requires cookie-based auth (get_current_user_from_cookie)

Possible errors:

401 Unauthorized

404 Group not found

500 Internal Server Error