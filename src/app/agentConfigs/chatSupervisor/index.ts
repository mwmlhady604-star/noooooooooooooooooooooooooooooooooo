//index.ts
import { RealtimeAgent, tool } from '@openai/agents/realtime'
import { getNextResponseFromSupervisor } from './supervisorAgent';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with better error handling
let supabase: any = null;
let supabaseInitialized = false;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseKey);
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
    supabaseInitialized = true;
    console.log('Supabase client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Define the saveClientInformation tool separately using the tool() function
export const saveClientInformation = tool({
  name: 'saveClientInformation',
  description: 'Save client information to Supabase database and JSON file for business registration inquiries',
  parameters: {
    type: 'object',
    properties: {
      clientName: {
        type: 'string',
        description: 'Full name of the client'
      },
      email: {
        type: 'string',
        description: 'Email address of the client'
      },
      businessType: {
        type: 'string',
        description: 'Type of Business Activity (Commercial, Industrial, Agricultural, Service)'
      },
      businessName: {
        type: 'string',
        description: 'Preferred Business Name'
      },
      businessLocation: {
        type: 'string',
        description: 'Business Location (City/Province)'
      },
      businessStructure: {
        type: 'string',
        description: 'Preferred Business Structure (Individual, Partnership, Company)'
      },
      numberOfPartners: {
        type: 'number',
        description: 'Number of Partners (if applicable)'
      },
      initialCapital: {
        type: 'number',
        description: 'Initial Capital Estimate'
      },
      expectedEmployees: {
        type: 'number',
        description: 'Number of Expected Employees'
      },
      businessAddress: {
        type: 'string',
        description: 'Business Address (Current or Planned)'
      },
      websiteOrSocialMedia: {
        type: 'string',
        description: 'Website or Social Media (if applicable)'
      },
      specificQuestions: {
        type: 'string',
        description: 'The user s exact question(s) about business registration in Iraq'
      },
      registrationTimeline: {
        type: 'string',
        description: 'Timeline for Registration'
      },
      budgetForFees: {
        type: 'number',
        description: 'Budget for Registration Fees'
      },
      specialRequirements: {
        type: 'string',
        description: 'Special Requirements (Trademark, Environmental Approval, etc.)'
      }
    },
    required: ['clientName'],
    additionalProperties: false
  },
  execute: async (params: any) => {
  console.log('Starting saveClientInformation with params:', params);
  
  // Extract context from params if available
  const { context, ...clientParams } = params;
  
  // Update client info in the App component if updateClientInfo function is available
  if (context && context.updateClientInfo && typeof context.updateClientInfo === 'function') {
    try {
      context.updateClientInfo(clientParams);
    } catch (error) {
      console.error('Error updating client info in App component:', error);
    }
  }

  // Save to JSON file (server-side only)
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs');
      const path = await import('path');

      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `client-info-${timestamp}.json`;
      const filepath = path.join(process.cwd(), 'data', filename);

      // Ensure the data directory exists
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Write the data to JSON file
      fs.writeFileSync(filepath, JSON.stringify(clientParams, null, 2));
      console.log('Successfully saved client information to JSON file:', filepath);
    } catch (fileError) {
      console.error('Error saving to JSON file:', fileError);
    }
  }

  if (!supabaseInitialized || !supabase) {
    const errorMsg = 'Supabase client not initialized. Check environment variables.';
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    // 🟢 نعمل mapping من camelCase → snake_case
    const mappedParams: any = {
      client_name: params.clientName,
      email: params.email,
      business_type: params.businessType,
      business_name: params.businessName,
      business_location: params.businessLocation,
      business_structure: params.businessStructure,
      number_of_partners: params.numberOfPartners,
      initial_capital: params.initialCapital,
      expected_employees: params.expectedEmployees,
      business_address: params.businessAddress,
      website_or_social_media: params.websiteOrSocialMedia,
      specific_questions: params.specificQuestions,
      registration_timeline: params.registrationTimeline,
      budget_for_fees: params.budgetForFees,
      special_requirements: params.specialRequirements
    };

    // 🟢 نفلتر الحقول الفارغة (null/undefined)
    const cleanedParams = Object.fromEntries(
      Object.entries(mappedParams).filter(([_, v]) => v !== undefined && v !== null)
    );

    console.log('Attempting to save cleaned params:', cleanedParams);

    const { data, error } = await supabase
      .from('business_registration_inquiries')
      .insert([cleanedParams])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });

      return { success: false, error: `Database error: ${error.message}` };
    }

    console.log('Successfully saved client information:', data);
    return { success: true, data };

  } catch (error: any) {
    console.error('Unexpected error in saveClientInformation:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return { success: false, error: `Unexpected error: ${error.message || 'Unknown error occurred'}` };
  }
}

});

// Define the sendProgressEmail tool for sending email summaries during the conversation
export const sendProgressEmail = tool({
  name: 'sendProgressEmail',
  description: 'Send a progress email summary to the user during the conversation',
  parameters: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address of the client for sending the summary'
      },
      clientName: {
        type: 'string',
        description: 'Full name of the client'
      },
      businessType: {
        type: 'string',
        description: 'Type of Business Activity (Commercial, Industrial, Agricultural, Service)'
      },
      businessName: {
        type: 'string',
        description: 'Preferred Business Name'
      },
      businessLocation: {
        type: 'string',
        description: 'Business Location (City/Province)'
      },
      businessStructure: {
        type: 'string',
        description: 'Preferred Business Structure (Individual, Partnership, Company)'
      },
      numberOfPartners: {
        type: 'number',
        description: 'Number of Partners (if applicable)'
      },
      initialCapital: {
        type: 'number',
        description: 'Initial Capital Estimate'
      },
      expectedEmployees: {
        type: 'number',
        description: 'Number of Expected Employees'
      },
      businessAddress: {
        type: 'string',
        description: 'Business Address (Current or Planned)'
      },
      websiteOrSocialMedia: {
        type: 'string',
        description: 'Website or Social Media (if applicable)'
      },
      specificQuestions: {
        type: 'string',
        description: 'The user s exact question(s) about business registration in Iraq'
      },
      registrationTimeline: {
        type: 'string',
        description: 'Timeline for Registration'
      },
      budgetForFees: {
        type: 'number',
        description: 'Budget for Registration Fees'
      },
      specialRequirements: {
        type: 'string',
        description: 'Special Requirements (Trademark, Environmental Approval, etc.)'
      }
    },
    required: ['email'],
    additionalProperties: false
  },
  execute: async (params: any) => {
    console.log('Sending progress email with params:', params);
    
    try {
      // Call the email API to send the progress email
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          subject: "Progress Update - Business Registration Information",
          html: `
            <h2>Business Registration Progress Update</h2>
            <p>Hello ${params.clientName || 'Valued Customer'},</p>
            <p>Here's a summary of the information we've collected so far:</p>
            
            <h3>Personal Information</h3>
            <ul>
              <li>Name: ${params.clientName || 'Not provided'}</li>
            </ul>
            
            <h3>Business Information</h3>
            <ul>
              <li>Business Type: ${params.businessType || 'Not provided'}</li>
              <li>Business Name: ${params.businessName || 'Not provided'}</li>
              <li>Business Location: ${params.businessLocation || 'Not provided'}</li>
              <li>Business Structure: ${params.businessStructure || 'Not provided'}</li>
            </ul>
            
            <p>We'll continue collecting information and send you a final summary at the end of the session.</p>
            <p>Best regards,<br>The Business Registration Team</p>
          `,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Progress email sent successfully:', result);
        return { success: true, message: 'Progress email sent successfully' };
      } else {
        console.error('Failed to send progress email:', result.error);
        return { success: false, error: `Failed to send progress email: ${result.error}` };
      }
    } catch (error) {
      console.error('Error sending progress email:', error);
      return { success: false, error: `Error sending progress email: ${error}` };
    }
  }
});

// Define the handleConversationClosure tool for confirming information and setting email preferences
export const handleConversationClosure = tool({
  name: 'handleConversationClosure',
  description: 'Handle conversation closure by confirming collected information with the user and setting email preferences. Also saves data to JSON file.',
  parameters: {
    type: 'object',
    properties: {
      clientName: {
        type: 'string',
        description: 'Full name of the client'
      },
      email: {
        type: 'string',
        description: 'Email address of the client for sending confirmation'
      },
      businessType: {
        type: 'string',
        description: 'Type of Business Activity (Commercial, Industrial, Agricultural, Service)'
      },
      businessName: {
        type: 'string',
        description: 'Preferred Business Name'
      },
      businessLocation: {
        type: 'string',
        description: 'Business Location (City/Province)'
      },
      businessStructure: {
        type: 'string',
        description: 'Preferred Business Structure (Individual, Partnership, Company)'
      },
      numberOfPartners: {
        type: 'number',
        description: 'Number of Partners (if applicable)'
      },
      initialCapital: {
        type: 'number',
        description: 'Initial Capital Estimate'
      },
      expectedEmployees: {
        type: 'number',
        description: 'Number of Expected Employees'
      },
      businessAddress: {
        type: 'string',
        description: 'Business Address (Current or Planned)'
      },
      websiteOrSocialMedia: {
        type: 'string',
        description: 'Website or Social Media (if applicable)'
      },
      specificQuestions: {
        type: 'string',
        description: 'The user s exact question(s) about business registration in Iraq'
      },
      registrationTimeline: {
        type: 'string',
        description: 'Timeline for Registration'
      },
      budgetForFees: {
        type: 'number',
        description: 'Budget for Registration Fees'
      },
      specialRequirements: {
        type: 'string',
        description: 'Special Requirements (Trademark, Environmental Approval, etc.)'
      },
      confirmationStatus: {
        type: 'string',
        enum: ['confirmed', 'needs_correction', 'not_yet_confirmed'],
        description: 'Status of user confirmation'
      },
      deliveryPreference: {
        type: 'string',
        enum: ['pdf', 'step_by_step', 'none'],
        description: 'User preference for information delivery'
      }
    },
    required: ['clientName', 'businessType', 'businessName', 'confirmationStatus'],
    additionalProperties: false
  },
  execute: async (params: any) => {
    console.log('Handling conversation closure with params:', params);
    
    // Save to JSON file
    try {
      if (typeof window === 'undefined') {
        const fs = await import('fs');
        const path = await import('path');

        // Create a timestamp for the filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `conversation-closure-${timestamp}.json`;
        const filepath = path.join(process.cwd(), 'data', filename);

        // Ensure the data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        // Write the data to JSON file
        fs.writeFileSync(filepath, JSON.stringify(params, null, 2));
        console.log('Successfully saved conversation closure data to JSON file:', filepath);
      }
    } catch (fileError) {
      console.error('Error saving conversation closure to JSON file:', fileError);
    }
    
    // If the user has confirmed and chosen a delivery preference, send the email
    if (params.confirmationStatus === 'confirmed' && params.deliveryPreference && params.email) {
      try {
        // Prepare the email content based on the user's preference
        let subject = '';
        let html = '';

        if (params.deliveryPreference === 'pdf') {
          // Send PDF information
          subject = 'Your Business Registration Information - PDF Ready';
          html = `
            <h2>Business Registration Information</h2>
            <p>Hello ${params.clientName || 'Valued Customer'},</p>
            <p>Your business registration information has been prepared as a PDF document.</p>
            <p>We will send you the PDF shortly.</p>
            <p>Best regards,<br>The Business Registration Team</p>
          `;
        } else if (params.deliveryPreference === 'step_by_step') {
          // Send step-by-step information
          subject = 'Business Registration Steps - Guide';
          html = `
            <h2>Business Registration Steps Guide</h2>
            <p>Hello ${params.clientName || 'Valued Customer'},</p>
            <p>Here are the step-by-step instructions for business registration in Iraq:</p>
            <ol>
              <li>Prepare required documents</li>
              <li>Choose business structure</li>
              <li>Register with relevant authorities</li>
              <li>Obtain necessary licenses</li>
            </ol>
            <p>Best regards,<br>The Business Registration Team</p>
          `;
        }

        // Call the email API to send the confirmation email
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: params.email,
            subject,
            html
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log('Email sent successfully:', result);
          return { success: true, message: 'Conversation closure handled and email sent successfully' };
        } else {
          console.error('Failed to send email:', result.error);
          return { success: false, error: `Failed to send email: ${result.error}` };
        }
      } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: `Error sending email: ${error}` };
      }
    }
    
    // Store the delivery preference in the session or database if needed
    // For now, we'll just return success
    
    return { success: true, message: 'Conversation closure handled successfully' };
  }
});

export const chatAgent = new RealtimeAgent({
  name: 'chatAgent',
  voice: 'cedar',
  instructions: `
  You are a helpful junior business registration advisor named ادم (Adam). Your task is to maintain a natural conversation flow with the user, help them understand the process of registering a business in Iraq, and to defer heavily to a more experienced and intelligent Supervisor Agent.

  # General Instructions

  Your name is ادم (Adam).

  You only speak and respond in Iraqi Arabic. maybe use English or Modern Standard Arabic (Fus'ha).

  You are very new and can only handle basic tasks, and will rely heavily on the Supervisor Agent via the getNextResponseFromSupervisor tool.

  By default, you must always use the getNextResponseFromSupervisor tool to get your next response, except for very specific exceptions.

  You represent a business registration advisory service in Iraq, helping entrepreneurs understand the procedures, requirements, and benefits of formally registering their businesses.

  Always greet the user with:
  "اهلا، هذا ادم من خدمة استشارات تسجيل الشركات، شلون اكدر اساعدك بتسجيل مشروعك؟"

  If the user later says "اهلا", "هلو", or similar greetings, just respond briefly and naturally (e.g., "اهلا!" or "هلو!") instead of repeating the full greeting.

  Avoid repeating yourself; vary your responses so the conversation feels natural.

  Do not use any information or values from examples as references in conversation. Only use what the Supervisor provides.

  ## Special Instructions for Business Registration Inquiries

  When a customer shows interest in registering a business in Iraq, you should collect the following information naturally in conversation:

  1️⃣ General Business Information
  - Type of Business Activity (Commercial, Industrial, Agricultural, Service)
  - Business Name (if already chosen)
  - Business Location (City/Province)

  2️⃣ Personal Information
  - Full Name
  ]

  3️⃣ Business Structure Information
  - Preferred Business Structure (Individual, Partnership, Company)
  - Number of Partners (if applicable)
  - Initial Capital Estimate
  - Number of Expected Employees

  4️⃣ Operational Information
  - Business Address (Current or Planned)
  - Website or Social Media (if applicable)

  5️⃣ Specific Requirements
  - The user s exact question(s) about business registration in Iraq
  - Timeline for Registration
  - Budget for Registration Fees
  - Special Requirements (Trademark, Environmental Approval, etc.)

  6️⃣ Contact Information (Email)
  - Email Address (Ask for this as the last piece of information before saving)
  
  Collect this information naturally in conversation. Ask for the email address as the last piece of information before saving, then save it using the saveClientInformation tool before consulting the supervisor.
  
  During the conversation, when significant information has been collected (e.g., after collecting the client's name, business type, and business name), you should use the sendProgressEmail tool to send a progress update to the user's email address.
  
  ## Conversation Closure Process

  Once you have collected all the necessary information from the user, including their email as the final piece, you should:

  1. Summarize all collected information in a friendly and clear manner in Iraqi Arabic, for example:
     "زين، حتى أتأكد وياك، انت اسمك {clientName}، نوع النشاط {businessType}، واسم المشروع {businessName}، صح لو أكو شي تحتاج أعدله؟"

  2. If the user confirms the information is correct, ask:
     "تحب أرسللك طريقة التسجيل خطوة بخطوة أو نسخة PDF من معلوماتك؟"

  3. Based on the user's choice, use the handleConversationClosure tool to save their preference with the appropriate deliveryPreference value (either 'pdf' or 'step_by_step').

  4. After the conversation ends (or after user confirmation), the system will use this preference to send an email containing a summary of the information to the user's email.

  ## Specialized Knowledge Areas

  The supervisor has access to comprehensive information about:
  - Benefits of formal registration
  - Choosing the right business structure
  - Types of business activities
  - Commercial name and trademark requirements
  - Registration procedures for different business types
  - Environmental compliance requirements
  - Intellectual property protection
  - Tax obligations
  - Social security registration
  - Useful resources and relevant websites

  ## Tone

  Maintain a friendly, helpful, natural Iraqi tone.

  Keep responses quick and concise.

  # Tools

  You can call getNextResponseFromSupervisor, saveClientInformation, sendProgressEmail, and handleConversationClosure.

  # Allowed Direct Actions (without Supervisor)

  Handle greetings and basic chitchat (e.g., "شلونك?", "شكراً").

  Repeat or clarify information if asked.

  Collect user information needed for business registration inquiries.

  # Out-of-Scope Questions Policy

  CRITICAL: If a user asks a question that is NOT covered by the ILO business registration knowledge base (the topics listed under "Specialized Knowledge Areas" above), you MUST:

  1. Politely tell the user in Iraqi Arabic that you do not have enough information to answer their question accurately. For example:
     "عذراً، هذا السؤال خارج نطاق المعلومات المتوفرة عدي. ما أكدر أعطيك جواب دقيق عليه."
  2. Advise them to consult a qualified legal advisor or lawyer. For example:
     "أنصحك تستشير محامي أو مستشار قانوني متخصص بالقانون العراقي حتى تحصل على معلومات دقيقة وموثوقة."
  3. Do NOT attempt to answer, guess, or provide general information. Incorrect legal or financial information can have serious consequences for the user.
  4. You may offer to help with any topic that IS within your knowledge base scope.

  This applies even for questions that seem related to business but are not explicitly covered in the ILO guide, such as specific court rulings, sector-specific regulations not in the guide, foreign investment details, banking regulations, or labor disputes.

  # getNextResponseFromSupervisor Usage

  For everything else, you MUST always call getNextResponseFromSupervisor.

  Do NOT answer or attempt to resolve things yourself.

  You must always say a short filler phrase in Iraqi Arabic before calling the tool. Examples:

  "ثواني."
  "خل اشوف."
  "دقيقة."
  "خلني اتأكد."

  Then immediately call the tool.
  `,
  tools: [
    getNextResponseFromSupervisor,
    saveClientInformation,
    sendProgressEmail,
    handleConversationClosure
  ],
});

export const chatSupervisorScenario = [chatAgent];

// Name of the company represented by this agent set. Used by guardrails
export const chatSupervisorCompanyName = 'Iraq Business Registration Service';

export default chatSupervisorScenario;