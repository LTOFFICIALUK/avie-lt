'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Typography, message, notification, Alert } from 'antd';
import { FlagOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Option } = Select;

type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
  streamId: string;
  streamTitle: string;
};

// Common report reasons for streaming content
const reportReasons = [
  'Harmful or dangerous content',
  'Hateful or abusive content',
  'Harassment or bullying',
  'Misinformation',
  'Child abuse',
  'Violent or graphic content',
  'Pornography or sexually explicit material',
  'Spam or misleading',
  'Illegal activities or regulated goods',
  'Unauthorized sharing',
  'Other'
];

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  streamId,
  streamTitle
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [reportDetails, setReportDetails] = useState<{reason: string, description?: string}>({reason: ''});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showDetailedConfirmation = () => {
    setShowConfirmModal(true);
  };

  const handleSubmit = async (values: { reason: string; description?: string }) => {
    // Reset error states
    setAlreadyReported(false);
    setErrorMessage(null);
    
    try {
      setSubmitting(true);
      setReportDetails(values);
      
      const response = await api.post('/api/stream/report', {
        streamId,
        reason: values.reason,
        description: values.description || ''
      });
      
      if (response.data.status === 'success') {
        // First close the report modal
        form.resetFields();
        onClose();
        
        // Show the detailed confirmation modal
        showDetailedConfirmation();
        
        // Also show a brief notification
        notification.success({
          message: 'Report Submitted Successfully',
          description: 'Thank you for your report. Click for more details.',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          placement: 'top',
          duration: 4,
          onClick: () => setShowConfirmModal(true)
        });
      } else {
        throw new Error(response.data.message || 'Failed to submit report');
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      
      // Check if it's a 409 conflict error (already reported)
      if (error.response && error.response.status === 409) {
        setAlreadyReported(true);
        // Don't close the modal, show the message inside
        // Parse the error message if it's in a format like "errors.report.already_reported"
        const errorMsg = error.response.data.message || 'You have already reported this stream';
        const friendlyMessage = errorMsg.includes('already_reported') 
          ? 'You have already reported this stream. Our team is reviewing it.'
          : errorMsg;
        setErrorMessage(friendlyMessage);
      } else {
        // For other errors, show a message but also don't close the modal
        setErrorMessage('Failed to submit report. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for the report timestamp
  const formattedDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleClose = () => {
    setAlreadyReported(false);
    setErrorMessage(null);
    form.resetFields();
    onClose();
  };

  return (
    <>
      {/* Main Report Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FlagOutlined />
            <span>Report Stream</span>
          </div>
        }
        open={visible}
        onCancel={handleClose}
        footer={null}
        centered
        destroyOnClose
      >
        <div className="mb-6">
          <Text>
            You are about to report: <strong>{streamTitle || 'this stream'}</strong>
          </Text>
          <Text className="block mt-2 text-gray-400 text-sm">
            Reports are confidential. Please help us understand what's happening so we can address it appropriately.
          </Text>
        </div>

        {/* Error Messages */}
        {alreadyReported && (
          <Alert
            message="Already Reported"
            description={errorMessage || "You have already reported this stream. Our team is reviewing it."}
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            className="mb-4"
          />
        )}
        
        {errorMessage && !alreadyReported && (
          <Alert
            message="Error Submitting Report"
            description={errorMessage}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          validateMessages={{
            required: '${label} is required'
          }}
        >
          <Form.Item
            name="reason"
            label="Reason for reporting"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a reason">
              {reportReasons.map(reason => (
                <Option key={reason} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Additional details (optional)"
          >
            <TextArea
              placeholder="Please provide any additional information that might help our moderation team understand the issue..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={500}
            />
          </Form.Item>

          <div className="text-sm text-gray-400 mb-4">
            <p>Our moderation team will review this report and take appropriate action according to our community guidelines.</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              danger
              disabled={alreadyReported}
            >
              Submit Report
            </Button>
          </div>
        </Form>
      </Modal>
      
      {/* Detailed Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>Report Submitted Successfully</span>
          </div>
        }
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        footer={[
          <Button 
            key="ok" 
            type="primary" 
            onClick={() => setShowConfirmModal(false)}
          >
            Close
          </Button>
        ]}
        centered
        width={500}
      >
        <div className="py-4">
          <div className="border-l-4 border-zinc-400 pl-4 py-2 mb-6 bg-zinc-100 dark:bg-zinc-800 rounded">
            <Text className="block text-zinc-800 dark:text-zinc-200 font-medium">
              Thank you for helping keep our community safe.
            </Text>
            <Text className="block text-zinc-700 dark:text-zinc-300 text-sm">
              Your report has been submitted to our admin team for review.
            </Text>
          </div>
          
          <div className="mb-4">
            <Title level={5}>Report Details</Title>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded mb-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start gap-2 mb-2">
                <InfoCircleOutlined className="mt-1 text-zinc-500" />
                <div>
                  <Text className="block font-medium">Reported Content</Text>
                  <Text className="block text-zinc-600 dark:text-zinc-400">{streamTitle || 'Untitled stream'}</Text>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Text className="block text-xs text-zinc-500 dark:text-zinc-400">REPORT ID</Text>
                  <Text className="block text-zinc-700 dark:text-zinc-300">
                    {streamId ? `${streamId.substring(0, 8)}...` : 'Not available'}
                  </Text>
                </div>
                <div>
                  <Text className="block text-xs text-zinc-500 dark:text-zinc-400">SUBMITTED ON</Text>
                  <Text className="block text-zinc-700 dark:text-zinc-300">{formattedDate}</Text>
                </div>
                <div>
                  <Text className="block text-xs text-zinc-500 dark:text-zinc-400">REPORT REASON</Text>
                  <Text className="block font-medium text-zinc-800 dark:text-zinc-200">{reportDetails.reason}</Text>
                </div>
                <div>
                  <Text className="block text-xs text-zinc-500 dark:text-zinc-400">STATUS</Text>
                  <Text className="block">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
                      Pending Review
                    </span>
                  </Text>
                </div>
              </div>
            </div>
            
            {reportDetails.description && (
              <div className="mb-4">
                <Text className="block text-sm font-medium mb-1 text-zinc-800 dark:text-zinc-200">Additional Information Provided:</Text>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {reportDetails.description}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded border border-zinc-200 dark:border-zinc-700">
            <Title level={5} className="text-zinc-800 dark:text-zinc-200 mb-2">What happens next?</Title>
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
              <li>Our admin team will review your report within 24-48 hours</li>
              <li>If the content violates our community guidelines, it will be removed</li>
              <li>Appropriate action will be taken against the reported account if necessary</li>
              <li>You will not be notified about the specific outcome of the review</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportModal; 