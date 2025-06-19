// /app/api/jobs/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// The function MUST be named after the HTTP method (e.g., GET, POST)
export async function GET(request) {
  // 1. Get the Authorization header
  const headersList = headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  // 2. Verify the token
  const token = authHeader.split(" ")[1];
  if (
    token !==
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.D_0pB3tSg9aV1FzW-b2M_jZ-5jJ4-rJ6b_rY3bK_jZc"
  ) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // 3. If token is valid, return the data
  const currentUserId = 123;
  const allJobsInDatabase = [
    {
      job_id: 101,
      user_id: 123,
      status: "completed",
      created_at: "2023-10-26T10:00:00Z",
    },
    {
      job_id: 102,
      user_id: 456,
      status: "completed",
      created_at: "2023-10-25T11:30:00Z",
    },
    {
      job_id: 103,
      user_id: 456,
      status: "in_progress",
      created_at: "2023-10-27T14:00:00Z",
    },
    {
      job_id: 104,
      user_id: 123,
      status: "failed",
      created_at: "2023-10-28T09:15:00Z",
    },
  ];
  const userJobs = allJobsInDatabase.filter(
    (job) => job.user_id === currentUserId
  );

  return NextResponse.json(userJobs, { status: 200 });
}
