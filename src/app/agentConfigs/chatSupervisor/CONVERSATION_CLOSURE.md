# Conversation Closure & Confirmation Behavior

This document explains the implementation of the conversation closure and confirmation behavior for the Iraqi business registration chat supervisor.

## Overview

The conversation closure feature provides a structured way to:
1. Confirm collected information with the user in Iraqi Arabic
2. Allow users to choose their preferred delivery method (PDF or step-by-step instructions)
3. Send a confirmation email with the collected information

## Implementation Details

### 1. New Tools

#### handleConversationClosure Tool
A new tool has been added to handle the conversation closure process:

- **Name**: `handleConversationClosure`
- **Description**: Handles conversation closure by confirming collected information with the user and setting email preferences
- **Parameters**:
  - `clientName`: Full name of the client
  - `nationalId`: National ID number of the client
  - `phoneNumber`: Personal phone number of the client
  - `email`: Email address of the client for sending confirmation
  - `businessType`: Type of Business Activity
  - `businessName`: Preferred Business Name
  - `businessLocation`: Business Location (City/Province)
  - `businessStructure`: Preferred Business Structure
  - `numberOfPartners`: Number of Partners (if applicable)
  - `initialCapital`: Initial Capital Estimate
  - `expectedEmployees`: Number of Expected Employees
  - `businessAddress`: Business Address
  - `businessPhone`: Business Phone Number
  - `businessEmail`: Business Email
  - `websiteOrSocialMedia`: Website or Social Media (if applicable)
  - `specificQuestions`: Specific Questions about Registration Process
  - `registrationTimeline`: Timeline for Registration
  - `budgetForFees`: Budget for Registration Fees
  - `specialRequirements`: Special Requirements
  - `confirmationStatus`: Status of user confirmation (`confirmed`, `needs_correction`, `not_yet_confirmed`)
  - `deliveryPreference`: User preference for information delivery (`pdf`, `step_by_step`, `none`)

### 2. Agent Instructions

The agent instructions have been updated to include guidance on the conversation closure process:

1. **Summarize Information**: The agent should summarize all collected information in a friendly and clear manner in Iraqi Arabic.
2. **Confirm Accuracy**: Ask the user to confirm that the information is correct.
3. **Delivery Preference**: If the information is correct, ask the user if they prefer step-by-step instructions or a PDF.
4. **Store Preference**: Use the `handleConversationClosure` tool to store the user's preference.

### 3. Email API

A new API endpoint has been created at `/api/email` to handle sending confirmation emails:

- **Method**: POST
- **Parameters**: Same as the `handleConversationClosure` tool
- **Behavior**: 
  - Validates required fields
  - Validates email format
  - Generates appropriate HTML content based on delivery preference
  - Sends the email (mock implementation)

### 4. PDF Utility

A PDF utility has been created to generate HTML content for business registration information:

- **generateBusinessRegistrationHTML**: Generates formatted HTML content with all business registration information
- **generateBusinessRegistrationPDF**: Placeholder for PDF generation (would use a library like pdfkit in a real implementation)

## Workflow

1. **Information Collection**: The agent collects all necessary business registration information from the user.
2. **Save Information**: The agent saves the information using the `saveClientInformation` tool.
3. **Confirmation**: The agent summarizes the information and asks for confirmation.
4. **Delivery Preference**: If confirmed, the agent asks about delivery preference.
5. **Send Email**: The agent uses the `handleConversationClosure` tool to send the confirmation email.

## Example Interaction

```
Agent: زين، حتى أتأكد وياك، انت اسمك أحمد محمد، رقمك +964 770 123 4567، نوع النشاط تجاري، واسم المشروع محل أحمد للأجهزة، صح لو أكو شي تحتاج أعدله؟

User: نعم، المعلومات صحيحة.

Agent: تحب أرسللك طريقة التسجيل خطوة بخطوة أو نسخة PDF من معلوماتك؟

User: أرسل لي نسخة PDF من فضلك.

Agent: تمام، راح أرسل لك نسخة PDF على بريدك الإلكتروني ahmed.mohammed@email.com.
```

## Technical Implementation

### File Structure
- `index.ts`: Contains the agent definition and the `handleConversationClosure` tool
- `supervisorAgent.ts`: Contains supervisor agent instructions and tool definitions
- `/api/email/route.ts`: API endpoint for sending emails
- `/lib/pdfUtils.ts`: Utility functions for generating PDF/HTML content

### Key Components

1. **Agent Tools**: The `handleConversationClosure` tool is added to both the agent and supervisor agent tool lists.
2. **API Endpoint**: The `/api/email` endpoint handles email sending.
3. **Utility Functions**: The PDF utility provides functions for generating formatted content.

## Testing

A test file (`conversationClosure.test.ts`) has been created to demonstrate how the feature works.

## Future Improvements

1. **Real Email Sending**: Replace the mock email implementation with a real email service (e.g., Nodemailer, SendGrid).
2. **Actual PDF Generation**: Implement actual PDF generation using a library like pdfkit or jsPDF.
3. **Database Storage**: Store conversation closure preferences in a database for future reference.
4. **Enhanced Error Handling**: Add more robust error handling for email sending failures.