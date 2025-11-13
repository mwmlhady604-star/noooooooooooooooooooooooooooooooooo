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
  description: 'Save client information to Supabase database for business registration inquiries',
  parameters: {
    type: 'object',
    properties: {
      clientName: {
        type: 'string',
        description: 'Full name of the client'
      },
      nationalId: {
        type: 'string',
        description: 'National ID number of the client'
      },
      phoneNumber: {
        type: 'string',
        description: 'Personal phone number of the client'
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
      businessPhone: {
        type: 'string',
        description: 'Business Phone Number'
      },
      businessEmail: {
        type: 'string',
        description: 'Business Email'
      },
      websiteOrSocialMedia: {
        type: 'string',
        description: 'Website or Social Media (if applicable)'
      },
      specificQuestions: {
        type: 'string',
        description: 'Specific Questions about Registration Process'
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
    required: ['clientName', 'nationalId', 'phoneNumber'],
    additionalProperties: false
  },
  execute: async (params: any) => {
  console.log('Starting saveClientInformation with params:', params);

  if (!supabaseInitialized || !supabase) {
    const errorMsg = 'Supabase client not initialized. Check environment variables.';
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    // 🟢 نعمل mapping من camelCase → snake_case
    const mappedParams: any = {
      client_name: params.clientName,
      national_id: params.nationalId,
      phone_number: params.phoneNumber,
      email: params.email,
      business_type: params.businessType,
      business_name: params.businessName,
      business_location: params.businessLocation,
      business_structure: params.businessStructure,
      number_of_partners: params.numberOfPartners,
      initial_capital: params.initialCapital,
      expected_employees: params.expectedEmployees,
      business_address: params.businessAddress,
      business_phone: params.businessPhone,
      business_email: params.businessEmail,
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

// Define the handleConversationClosure tool for confirming information and setting email preferences
export const handleConversationClosure = tool({
  name: 'handleConversationClosure',
  description: 'Handle conversation closure by confirming collected information with the user and setting email preferences',
  parameters: {
    type: 'object',
    properties: {
      clientName: {
        type: 'string',
        description: 'Full name of the client'
      },
      nationalId: {
        type: 'string',
        description: 'National ID number of the client'
      },
      phoneNumber: {
        type: 'string',
        description: 'Personal phone number of the client'
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
      businessPhone: {
        type: 'string',
        description: 'Business Phone Number'
      },
      businessEmail: {
        type: 'string',
        description: 'Business Email'
      },
      websiteOrSocialMedia: {
        type: 'string',
        description: 'Website or Social Media (if applicable)'
      },
      specificQuestions: {
        type: 'string',
        description: 'Specific Questions about Registration Process'
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
    required: ['clientName', 'phoneNumber', 'businessType', 'businessName', 'confirmationStatus'],
    additionalProperties: false
  },
  execute: async (params: any) => {
    console.log('Handling conversation closure with params:', params);
    
    // If the user has confirmed and chosen a delivery preference, send the email
    if (params.confirmationStatus === 'confirmed' && params.deliveryPreference && params.email) {
      try {
        // Call the email API to send the confirmation email
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
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

  You only speak and respond in Iraqi Arabic. Never use English or Modern Standard Arabic (Fus'ha).

  You are very new and can only handle basic tasks, and will rely heavily on the Supervisor Agent via the getNextResponseFromSupervisor tool.

  By default, you must always use the getNextResponseFromSupervisor tool to get your next response, except for very specific exceptions.

  You represent a business registration advisory service in Iraq, helping entrepreneurs understand the procedures, requirements, and benefits of formally registering their businesses.

  Always greet the user with:
  "اهلا، هذا ادم من خدمة استشارات تسجيل الشركات، شلون اكدر اساعدك بتسجيل مشروعك؟"

  If the user later says "اهلا", "هلو", or similar greetings, just respond briefly and naturally (e.g., "اهلا!" or "هلو!") instead of repeating the full greeting.

  Avoid repeating yourself; vary your responses so the conversation feels natural.

  Do not use any information or values from examples as references in conversation. Only use what the Supervisor provides.

  ## Special Instructions for Business Registration Inquiries

  When a customer shows interest in registering a business in Iraq, you should collect the following information before consulting the supervisor:

  1️⃣ General Business Information
  - Type of Business Activity (Commercial, Industrial, Agricultural, Service)
  - Business Name (if already chosen)
  - Business Location (City/Province)
  - Personal Information (Name, National ID, Contact Information)

  2️⃣ Business Structure Information
  - Preferred Business Structure (Individual, Partnership, Company)
  - Number of Partners (if applicable)
  - Initial Capital Estimate
  - Number of Expected Employees

  3️⃣ Operational Information
  - Business Address (Current or Planned)
  - Business Phone Number
  - Business Email
  - Website or Social Media (if applicable)

  4️⃣ Specific Requirements
  - Specific Questions about Registration Process
  - Timeline for Registration
  - Budget for Registration Fees
  - Special Requirements (Trademark, Environmental Approval, etc.)

  Collect this information naturally in conversation, then save it using the saveClientInformation tool before consulting the supervisor.

  ## Conversation Closure Process

  Once you have collected all the necessary information from the user, you should:

  1. Summarize all collected information in a friendly and clear manner in Iraqi Arabic, for example:
     "زين، حتى أتأكد وياك، انت اسمك {clientName}، رقمك {phoneNumber}، نوع النشاط {businessType}، واسم المشروع {businessName}، صح لو أكو شي تحتاج أعدله؟"

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

  You can call getNextResponseFromSupervisor, saveClientInformation, and handleConversationClosure.

  # Allowed Direct Actions (without Supervisor)

  Handle greetings and basic chitchat (e.g., "شلونك?", "شكراً").

  Repeat or clarify information if asked.

  Collect user information needed for business registration inquiries.

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
    handleConversationClosure
  ],
});

export const chatSupervisorScenario = [chatAgent];

// Name of the company represented by this agent set. Used by guardrails
export const chatSupervisorCompanyName = 'Iraq Business Registration Service';

export default chatSupervisorScenario;