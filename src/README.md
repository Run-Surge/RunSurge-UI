🧠 Task: Implement "View My Nodes" Dashboard Feature
🎯 Goal
Enhance the user dashboard by adding a new section where users can view their registered compute nodes. Each node will display essential details, and the page will also provide a high-level summary of node earnings and statistics.

🔧 Modifications to Make
✅ 1. Add Button to Dashboard
Location: User Dashboard UI

Button Label: View My Nodes

Behavior: Redirect to /nodes route/page

✅ 2. Create /nodes Page
🔗 Data Source
Use the following backend endpoint to fetch user node data:

http
Copy
Edit
GET /user/api/nodes
This endpoint returns a response shaped like the following model:

ts
Copy
Edit
interface DashboardRead {
  total_earnings: number;
  paid_earnings: number;
  pending_earnings: number;
  number_of_nodes: number;
  nodes: NodeRead[];
}

interface NodeRead {
  node_id: string;
  created_at: string;
  is_alive: boolean;
  total_node_earnings: number;
  num_of_completed_tasks: number;
}
🎨 UI Requirements
Match the visual style of the existing dashboard.

Use cards or a clean table layout for each node.

Display important fields for each node:

node_id

created_at

is_alive (use a green/red badge or status icon)

total_node_earnings

num_of_completed_tasks

At the top of the page, show a summary section:

Total Number of Nodes

Total Earnings

Paid Earnings

Pending Earnings

Each node card or row must include a:

"View Details" button → placeholder for now; just a button without behavior.

🧪 Example UI Structure (Suggested)
plaintext
Copy
Edit
╔════════════════════════════════════╗
║        📊 My Node Overview         ║
╠════════════════════════════════════╣
║  Total Nodes: 4                   ║
║  Total Earnings: $250.00         ║
║  Paid: $180.00 | Pending: $70.00 ║
╚════════════════════════════════════╝

[ Node ID: abc123 ]
  Created: 2024-10-11
  Status: ✅ Alive
  Completed Tasks: 87
  Earnings: $75.00
  [ View Details ]

[ Node ID: def456 ]
  ...
🚫 Notes
Do not implement the logic for the "View Details" button yet. Just render it.