🧠 Task Instruction for Agent: Upload Data Section on GroupDetailsPage
Objective:
Enhance the GroupDetailsPage to include a data upload section that dynamically renders multiple upload slots, one per required task.

✅ What You Need to Do:
Locate:
Modify or extend the GroupDetailsPage.

Render Upload Section in a Loop:

Use the required_tasks value (numeric) as the loop count.

For each task, display a form section with:

data_file: file input (accept .csv only)

required_ram: input field (e.g., number in GB or MB)

UX Requirements:

All upload sections should be shown on the same page.

Group each task’s inputs clearly (e.g., with a heading like Task 1, Task 2, etc.)

Each upload section should be independent (user can fill them out one by one).
