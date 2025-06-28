🧠 Task: Implement nodes/[node_id] Detail Page
🎯 Goal
Create a detail page for each user node under the route:
/nodes/[node_id]

This page will display the node’s metadata and a list of its completed tasks. The layout and design must match the visual style of the dashboard and the node listing page (/nodes).

🔗 Backend API
Endpoint: GET /api/node/{node_id}

Add to: config.js as NODE_DETAIL_API

Response Type: NodeDetailRead

✅ Expected Response Schema
ts
Copy
Edit
interface NodeDetailRead {
  node_id: string;
  is_alive: boolean;
  total_node_earnings: number;
  num_of_completed_tasks: number;
  tasks: TaskNodeDetailRead[];
}

interface TaskNodeDetailRead {
  task_id: number;
  started_at: string;
  completed_at: string;
  total_active_time: number;
  avg_memory_bytes: number;
  status: string;
  earning_amount: number | null;
  earning_status: string | null;
}
🖥️ UI Requirements
🔹 Header Section
Display the following node-level details in a styled summary card or section:

Node ID

is_alive (use green ✅ or red ❌ badge)

Total Earnings

Number of Completed Tasks

🔹 Tasks List Section
Show each completed task in a visually consistent card or table layout (similar to other dashboard sections). For each task, display:

Task ID

Started At

Completed At

Total Active Time (in seconds (float))

Average Memory (Bytes) (format it in MB)

Earning Amount (or "N/A")

Earning Status (e.g., “Paid”, “Pending”)

🧭 Page Routing
Path: /nodes/[node_id]

This page is accessed when the user clicks “View Details” from the /nodes page.