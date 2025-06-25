📦 Group Data Upload Implementation Guide
📍 Objective
Enhance the RunSurge-UI/src/app/group/[id] page to support chunked uploads of .zip data files — one per job inside a group. This behavior should mirror the existing implementation in RunSurge-UI/src/app/job/[id].

📌 Task Overview
📄 Each job under a group requires one .zip file upload.

🔁 The upload must be chunked using the same strategy as on the job/[id] page.

📂 The upload UI and logic must be rendered per job within the group.

✅ Requirements Summary
1. 📄 Frontend Page: RunSurge-UI/src/app/group/[id]
Use the jobs array from the group response to loop over jobs.

For each job:

Display a chunked .zip upload interface (similar to job/[id] page).

Ensure file upload happens via chunks using chunk_index and total_chunks.

2. 📡 API Endpoint
The backend chunked upload is already implemented at:

python
Copy
Edit
POST /{job_id}/upload-zip-file
Accepted form-data:

Field	Type	Description
file	UploadFile	Zip chunk of the job data
chunk_index	int	Index of this chunk (starts at 0)
total_chunks	int	Total number of chunks
required ram   big int 

⚠️ Note: Validation and processing are handled differently based on the job type.

🧾 Sample Response from Group API
json
Copy
Edit
{
  "group_id": 5,
  "group_name": "group2",
  "num_of_jobs": 3,
  "created_at": "2025-06-25T04:03:30.592432",
  "python_file_name": "test",
  "jobs": [
    {
      "group_id": 5,
      "job_id": 20,
      "job_name": "group2_job_1",
      "status": "submitted",
      "created_at": "2025-06-25T04:03:30.622120"
    },
    ...
  ]
}
You must use this list of jobs to render an upload section for each job.
display only 