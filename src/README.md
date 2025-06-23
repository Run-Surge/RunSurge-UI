🚀 Chunked File Upload Integration (100MB Streaming)
🧩 Objective
Implement large CSV file upload functionality in the frontend that streams the data to the backend in 100MB chunks.

✅ Target: Reliable chunked upload flow with backend coordination and post-upload job execution trigger.

🌐 Backend API: Upload Endpoint
POST /{job_id}/upload-data
This endpoint:

Authenticates the user.

Validates and stores each data chunk sequentially.

Triggers the job execution only after the last chunk is uploaded.

📥 Request Parameters
Sent via multipart/form-data:

Field	Type	Description
file	File	The file chunk
chunk_index	Form (int)	Index of the current chunk (0-based)
total_chunks	Form (int)	Total number of chunks to be sent

✅ Success Responses
Partial Upload:

json
Copy
Edit
{
  "message": "Data chunk uploaded successfully",
  "data_chunk_index": 2,
  "job_id": 123
}
Final Chunk Upload:

json
Copy
Edit
{
  "message": "Data uploaded successfully and job started",
  "data_chunk_index": 4,
  "job_id": 123
}
📦 Frontend Integration
🔧 Constants
js
Copy
Edit
const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB global chunk size
🧠 Upload Flow
User selects a CSV file.

File is split into 100MB chunks.

Each chunk is sent with its chunkIndex and totalChunks.

If all chunks are uploaded successfully, backend starts the job.

🛠️ Upload Handlers
js
Copy
Edit
// Here are sample implmentation for motivation and intuation ( use the same technique) 
but provide neccessary modifications to run on the existing codebase
 const uploadChunk = async (chunk, chunkIndex, totalChunks, jobId) => {
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkIndex', chunkIndex);
    formData.append('totalChunks', totalChunks);

    try {
        const response = await fetch(`/api/job/${jobId}/upload-data`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Chunk ${chunkIndex} uploaded`, data);
        return true;
    } catch (error) {
        console.error(`❌ Error uploading chunk ${chunkIndex}:`, error);
        return false;
    }
};
js
Copy
Edit
// Main handler for initiating the upload
const handleUpload = async () => {
    if (!file || !jobId) {
        alert('Select a file and ensure a job ID is available.');
        return;
    }

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedChunks = 0;

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);

        const success = await uploadChunk(chunk, i, totalChunks, jobId);

        if (!success) {
            alert(`Upload failed at chunk ${i}. Aborting.`);
            return;
        }

        uploadedChunks++;
        const progress = ((uploadedChunks / totalChunks) * 100).toFixed(2);
        console.log(`📦 Upload progress: ${progress}%`);
    }

    alert('🎉 Upload completed and job has started.');
};