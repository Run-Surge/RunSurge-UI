🧠 Task: Add Group Payment Button (Only If Group Status Is Completed)
📍 Page to Modify
bash
Copy
Edit
app/group/[groupid]/GroupDetailsPage.js
✅ Objective
Modify the Group Details Page to:

Render a "Pay" button only if:

group.status === "completed" AND

group.payment_status !== "completed"

Send a POST request to initiate group payment via the following FastAPI endpoint:

http
Copy
Edit
POST /{group_id}/payment
Show the payment_amount for each job inside the group (from jobs[]). only if the job status is completed

📦 API Response Structure
python
Copy
Edit
class GroupDetailRead(GroupBase):
    jobs: List[ComplexJobDetailRead]

class ComplexJobDetailRead(ComplexJobRead):
    input_file_name: str
    payment_amount: Optional[float] = None

class GroupBase(BaseModel):
    group_id: int
    group_name: str
    python_file_name: str
    num_of_jobs: int
    created_at: datetime
    aggregator_file_name: str
    status: GroupStatus  # Enum: "pending", "running", "completed"
    payment_status: Optional[PaymentStatus] = PaymentStatus.pending
    payment_amount: Optional[float] = None
🔘 Pay Button Behavior
Only show the "Pay" button when:

ts
Copy
Edit
group.status === "completed" && group.payment_status !== "completed"
On button click, send POST request to:

bash
Copy
Edit
POST /api/group/{group_id}/payment
Handle success and error messages appropriately (e.g., toast, )