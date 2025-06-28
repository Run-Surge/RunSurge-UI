🏠 Add Global Statistics to Home Page
🧠 Task Summary
Update the Home Page UI to display global statistics about the platform:

Total number of active contributions (nodes).

Total lifetime earnings in the system.

These statistics will be fetched from a provided backend API endpoint.

📍 Location
Modify the following page:

arduino
Copy
Edit
/app/page.tsx  (or similar home page component)
📡 API Integration
Fetch the data from the following backend endpoint:

Endpoint
pgsql
Copy
Edit
GET /api/statistics
Response Format
json
Copy
Edit
{
  "nodes": <number>,     // total number of active nodes/contributions
  "earnings": <float>    // total lifetime earnings
}
Backend Endpoint Source (for reference only)
python
Copy
Edit
@router.get("/")
async def get_statistics(
    session: AsyncSession = Depends(get_db),
):
    node_service = get_node_service(session)
    nodes = await node_service.get_all_nodes()
    earnings_service = get_earnings_service(session)
    earnings = await earnings_service.get_all_earnings_amount()
    return {"nodes": len(nodes), "earnings": earnings}
🎨 UI Requirements
Add a new section to the top or a visible area of the Home Page that displays:

✅ Total Active Contributions: Display value from nodes.

💰 Lifetime Earnings: Display value from earnings, formatted with appropriate currency styling (e.g., $12,345.67).

Design Tips:

Use cards or summary boxes with icons if available.

Ensure responsiveness and proper alignment with existing layout.