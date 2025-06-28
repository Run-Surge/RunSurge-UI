"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { jobsService } from "../../../../lib/jobsService";
import toast from "react-hot-toast";

// Helper function to format bytes to a human-readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper function to format seconds to hours, minutes, seconds
const formatTime = (seconds) => {
  if (!seconds) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);
  
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || hours > 0) result += `${minutes}m `;
  result += `${remainingSeconds}s`;
  return result;
};

export default function PaymentDetailsPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      
      // First, check if the job exists and is completed
      const jobResult = await jobsService.getJob(params.id);
      
      if (jobResult.success && jobResult.job && jobResult.job.status === "completed") {
        setJob(jobResult.job);
        
        // Then fetch the detailed payment information
        const paymentResult = await jobsService.getJobPayment(params.id);
        
        if (paymentResult.success) {
          setPaymentDetails(paymentResult.payment);
        } else {
          toast.error(paymentResult.message || "Failed to load payment details");
        }
      } else {
        // If job is not completed, redirect to job details page
        toast.error("Payment details are only available for completed jobs");
        router.push(`/job/${params.id}`);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to load payment details");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [params.id, router]);

  const handleProcessPayment = async () => {
    try {
      setProcessingPayment(true);
      const result = await jobsService.processPayment(params.id);
      
      if (result.success) {
        toast.success(result.message || "Payment processed successfully");
        // Refresh the payment details to show updated status
        await fetchPaymentDetails();
      } else {
        toast.error(result.message || "Failed to process payment");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("An error occurred while processing payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!job || !paymentDetails) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details Not Available</h2>
            <p className="mt-2 text-gray-600">
              The payment information could not be loaded or the job is not completed.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Check if the payment status is pending to show the Pay button
  const isPendingPayment = paymentDetails.status === "pending";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Payment Summary Card */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
                  <p className="mt-1 text-sm text-gray-600">Job: {job.job_name}</p>
                </div>
                {/* Pay Button - Only show for pending payments */}
                {isPendingPayment && (
                  <button
                    onClick={handleProcessPayment}
                    disabled={processingPayment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pay Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Job ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{paymentDetails.job_id}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paymentDetails.status === "completed" 
                        ? "bg-green-100 text-green-800" 
                        : paymentDetails.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    } capitalize`}>
                      {paymentDetails.status}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {paymentDetails.payment_date 
                      ? new Date(paymentDetails.payment_date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) 
                      : "Not processed yet"}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Tasks</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {paymentDetails.tasks?.length || 0}
                  </dd>
                </div>
                
                <div className="sm:col-span-3 border-t border-gray-200 pt-4 mt-2">
                  <dt className="text-lg font-bold text-gray-800">Total Payment Amount</dt>
                  <dd className="mt-2 text-3xl font-extrabold text-green-600">
                    ${typeof paymentDetails.amount === 'number' 
                      ? paymentDetails.amount.toFixed(2) 
                      : paymentDetails.amount || "0.00"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Task Details Table */}
          {paymentDetails.tasks && paymentDetails.tasks.length > 0 && (
            <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Task Usage Details ({paymentDetails.tasks.length} {paymentDetails.tasks.length === 1 ? 'task' : 'tasks'})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Memory Usage
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentDetails.tasks.map((task) => (
                      <tr key={task.task_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.task_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(task.total_active_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatBytes(task.avg_memory_bytes)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${typeof task.task_payment_amount === 'number' 
                            ? (task.task_payment_amount).toFixed(2) 
                            : task.task_payment_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => router.push(`/job/${job.job_id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Job Details
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 