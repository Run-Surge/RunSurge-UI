📚 RunSurge Documentation
Welcome to the official documentation of RunSurge, a parallel distributed platform that connects Consumers with Contributors (producers) for efficient task execution at scale.

🧠 About RunSurge
RunSurge is a decentralized computing platform built for performance, security, and scalability. It bridges the gap between users who need compute resources (Consumers) and those who provide them (Contributors), allowing for:

Parallel execution of compute-heavy tasks.

Efficient data transfer using gRPC.

Smart scheduling based on resource estimates and live monitoring.

Secure and isolated environments for safe execution of user-submitted code.

🧪 Job Types
RunSurge supports two primary job modes:

1. Single Jobs
Standalone data submission with a dedicated script.

2. Grouped Jobs
Multiple data inputs submitted across jobs with shared logic (the same Python script).

Includes built-in aggregation capabilities to summarize or analyze results collectively across the group.

🛡️ Security & Isolation
All submitted code is scanned using Semgrep before execution.

Each job runs inside an isolated sandbox environment to ensure safety and prevent side effects.

Contributor nodes are monitored with:

Heartbeats for liveness.

Log tracing to detect runtime issues or anomalies.

📈 Memory Estimation & Scheduling
We provide a memory estimator that predicts an upper bound for peak RAM usage.

This estimation is used to intelligently assign tasks to contributor nodes with sufficient resources.

While current estimations are approximate, actual usage is tracked during execution for feedback and improvement.

🧑‍💻 Sample Submission Code
Here’s a basic example of a user-submitted Python script:

python
Copy
Edit
# user_submission.py

def process(input_data: str) -> dict:
    """
    Process input data and return structured results.
    """
    lines = input_data.splitlines()
    word_count = sum(len(line.split()) for line in lines)
    
    return {
        "lines": len(lines),
        "words": word_count,
    }
✅ All scripts must implement a process(input_data: str) -> dict function. The input is passed as a string, and the output must be a serializable dictionary.

🔌 Communication Layer
We use gRPC for all node-client communication, which allows:

High-throughput data streaming.

Low latency over heterogeneous networks.

Strong typing and schema enforcement using Protocol Buffers.

🔍 Monitoring
Contributors are actively monitored through:

Heartbeat pings to ensure they are alive and responsive.

Periodic resource logs to analyze usage trends and detect failures.

Real-time task-level monitoring to track CPU, memory, and execution duration.

📄 About This Page
This documentation page is part of the official RunSurge docs. For more platform internals, API references, or guides, explore the full documentation suite or visit:

🌐 https://runsurge.ai/docs (placeholder link)


💸 Payment & Compensation Model
RunSurge operates on a pay-per-resource model to ensure fairness and transparency for both Consumers and Contributors.

🧾 Consumer Billing
Consumers are charged based on the actual resources consumed during job execution. The pricing model is defined by the formula:

Cost = Average RAM Used (in MB) × Execution Time (in Seconds) × Contributor Machine Factor
🔍 Breakdown:
Average RAM Used: Measured throughout the job’s execution.

Execution Time: Total runtime from job start to completion.

Contributor Machine Factor: A dynamic multiplier reflecting the computational capability of the machine running the job.

Machines with higher CPU, I/O, or RAM performance have higher factors.

The factor is referenced to BASELINE machine to ensure standerdization of all contrubuir resources in the platform

This ensures faster, high-performance nodes are fairly rewarded.

