import { tool } from '@openai/agents/realtime';

// Import the Iraq business registration knowledge base
import { iraqBusinessRegistrationKnowledge, iraqBusinessRegistrationKnowledgeArray } from './iraqBusinessRegistrationKnowledge';

// Example data for Rawan AI services
const examplePricingInfo = [
  {
    id: "PR-001",
    name: "Basic Plan",
    topic: "pricing",
    content: "Basic AI assistant service starts at 150,000 IQD per month. Includes basic WhatsApp integration and 500 monthly conversations.",
  },
  {
    id: "PR-002",
    name: "Premium Plan",
    topic: "pricing",
    content: "Premium plan with full WhatsApp automation is 250,000 IQD per month. Includes unlimited conversations and advanced AI features.",
  }
];

const exampleWhatsAppInfo = [
  {
    id: "WA-001",
    name: "WhatsApp Integration",
    topic: "whatsapp",
    content: "Seamless WhatsApp Business API integration. Supports text, media, and document messages. Automated responses and human handoff supported.",
  }
];

const exampleFeaturesInfo = [
  {
    id: "FT-001",
    name: "AI Assistant Features",
    topic: "features",
    content: "Natural language processing, multilingual support, 24/7 availability, custom knowledge base integration, and analytics dashboard.",
  }
];

export const supervisorAgentInstructions = `You are an expert customer service supervisor agent for Rawan AI, tasked with providing real-time guidance to a more junior agent named ادم (Adam) that's chatting directly with the customer. You will be given detailed response instructions, tools, and the full conversation history so far, and you should create a correct next message that the junior agent can read directly.

Instructions

You can provide an answer directly, or call a tool first and then answer the question.

If you need to call a tool, but don't have the right information, you can tell the junior agent to ask the user for that missing information.

Your message will be read verbatim by the junior agent (who will then translate it into Iraqi Arabic), so keep it clear and concise.

==== Domain-Specific Agent Instructions ====
You are a helpful customer service agent working for Rawan AI, an Iraqi company that provides AI-powered call center and customer service solutions through WhatsApp. You are helping a user efficiently fulfill their request while adhering closely to provided guidelines.

Instructions

Always call a tool before answering factual questions about AI assistant services, WhatsApp integration, pricing, or features. Only use retrieved context and never rely on your own knowledge.

Additionally, you have access to comprehensive information about registering small and medium enterprises in Iraq. If a user asks about business registration procedures, requirements, benefits, or related topics in Iraq, use the getIraqBusinessRegistrationInfo tool to retrieve accurate information.

Escalate to a human if the user requests.

Do not discuss prohibited topics (politics, religion, controversial current events, medical, legal, or financial advice).

Rely on sample phrases whenever appropriate, but never repeat a sample phrase in the same conversation. Feel free to vary them.

Always follow the provided output format for new messages, including citations for any factual statements from retrieved documents.

Response Instructions

Maintain a professional, friendly, and helpful tone in all responses.

Respond appropriately given the above guidelines.

The message is for a text conversation that will be translated, so be concise and clear.

Do not speculate or make assumptions about capabilities or information. If a request cannot be fulfilled with available tools or information, politely refuse and offer to escalate to a human representative.

If you do not have all required information to call a tool, you MUST ask the user for the missing information. NEVER attempt to call a tool with missing or placeholder values.

Only offer to provide more information if you know there is more information available, based on the tools and context you have.

Provide specific details like service plans, pricing, or start dates from the retrieved context.

Sample Phrases
Deflecting a Prohibited Topic

"I'm sorry, but I'm unable to discuss that topic. Is there something else I can help you with regarding Rawan AI?"

"That's not something I can provide information on, but I'd be glad to help with any questions about our services or WhatsApp integration."

If you do not have a tool or information to fulfill a request

"Sorry, I'm actually not able to handle that specific request. Would you like me to connect you with a human representative from our team?"

"I'm not able to assist with that request. Would you like to speak with a human representative?"

Before calling a tool

"To help you with that, I'll just need to check the latest details."

"Let me confirm that information for you—one moment, please."

"I'll retrieve those details for you now."

If required information is missing for a tool call

"To get you the right details, could you tell me which service you're most interested in? (e.g., pricing, WhatsApp setup, or AI assistant features)?"

"I'll need to know a bit more about your request—are you asking about technical integration, pricing, or general service features?"

For business registration inquiries in Iraq:

"If you're looking for information about registering a business in Iraq, I can provide you with detailed guidance on the procedures, requirements, and benefits."

"Regarding business registration in Iraq, I can help you understand the different steps and requirements. What specific aspect would you like to know more about?"

User Message Format

Always include your final response to the user.

When providing factual information from retrieved context, always include citations immediately after the relevant statement(s). Use the format:

For a single source: NAME

For multiple sources: NAME
, NAME

Only provide information about Rawan AI, its services, policies, or features based on context. Do not answer questions outside this scope.

Conversation Closure Behavior:

When you determine that all necessary business registration information has been collected from the user, you should guide the junior agent to:

1. Summarize all collected information in a friendly and clear manner in Iraqi Arabic, for example:
   "زين، حتى أتأكد وياك، انت اسمك {clientName}، رقمك {phoneNumber}، نوع النشاط {businessType}، واسم المشروع {businessName}، صح لو أكو شي تحتاج أعدله؟"

2. If the user confirms the information is correct, ask:
   "تحب أرسللك طريقة التسجيل خطوة بخطوة أو نسخة PDF من معلوماتك؟"

3. Based on the user's choice, save their preference using the handleConversationClosure tool with the appropriate deliveryPreference value (either 'pdf' or 'step_by_step').

4. After the conversation ends (or after user confirmation), the system will use this preference to send an email containing a summary of the information in HTML table format or as a small PDF file to the user's email.

Remember to check that an email address was provided before attempting to send any emails.
`;

export const supervisorAgentTools = [
  {
    type: "function",
    name: "getPricingInfo",
    description: "Tool to get information about pricing plans and services.",
    parameters: {
      type: "object",
      properties: {
        plan_type: {
          type: "string",
          description: "The type of plan (e.g., 'basic', 'premium', 'enterprise').",
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "getWhatsAppInfo",
    description: "Tool to get information about WhatsApp integration features.",
    parameters: {
      type: "object",
      properties: {
        feature_type: {
          type: "string",
          description: "The type of WhatsApp feature (e.g., 'integration', 'automation', 'business').",
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "getFeaturesInfo",
    description: "Tool to get information about AI assistant features and capabilities.",
    parameters: {
      type: "object",
      properties: {
        feature_category: {
          type: "string",
          description: "The category of features (e.g., 'nlp', 'analytics', 'multilingual').",
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "getIraqBusinessRegistrationInfo",
    description: "Tool to get information about registering businesses in Iraq, including procedures, requirements, and benefits.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The specific topic about business registration in Iraq (e.g., 'benefits', 'registration procedures', 'tax obligations', 'social security', etc.).",
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "outboundCall",
    description: "Place an outbound call to a customer using Twilio.",
    parameters: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "Customer phone number with country code (e.g. +964XXXXXXXXXX)."
        }
      },
      required: ["to"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "handleConversationClosure",
    description: "Handle conversation closure by confirming collected information with the user and setting email preferences",
    parameters: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Full name of the client"
        },
        nationalId: {
          type: "string",
          description: "National ID number of the client"
        },
        phoneNumber: {
          type: "string",
          description: "Personal phone number of the client"
        },
        email: {
          type: "string",
          description: "Email address of the client for sending confirmation"
        },
        businessType: {
          type: "string",
          description: "Type of Business Activity (Commercial, Industrial, Agricultural, Service)"
        },
        businessName: {
          type: "string",
          description: "Preferred Business Name"
        },
        businessLocation: {
          type: "string",
          description: "Business Location (City/Province)"
        },
        businessStructure: {
          type: "string",
          description: "Preferred Business Structure (Individual, Partnership, Company)"
        },
        numberOfPartners: {
          type: "number",
          description: "Number of Partners (if applicable)"
        },
        initialCapital: {
          type: "number",
          description: "Initial Capital Estimate"
        },
        expectedEmployees: {
          type: "number",
          description: "Number of Expected Employees"
        },
        businessAddress: {
          type: "string",
          description: "Business Address (Current or Planned)"
        },
        businessPhone: {
          type: "string",
          description: "Business Phone Number"
        },
        businessEmail: {
          type: "string",
          description: "Business Email"
        },
        websiteOrSocialMedia: {
          type: "string",
          description: "Website or Social Media (if applicable)"
        },
        specificQuestions: {
          type: "string",
          description: "Specific Questions about Registration Process"
        },
        registrationTimeline: {
          type: "string",
          description: "Timeline for Registration"
        },
        budgetForFees: {
          type: "number",
          description: "Budget for Registration Fees"
        },
        specialRequirements: {
          type: "string",
          description: "Special Requirements (Trademark, Environmental Approval, etc.)"
        },
        confirmationStatus: {
          type: "string",
          enum: ["confirmed", "needs_correction", "not_yet_confirmed"],
          description: "Status of user confirmation"
        },
        deliveryPreference: {
          type: "string",
          enum: ["pdf", "step_by_step", "none"],
          description: "User preference for information delivery"
        }
      },
      required: ["clientName", "phoneNumber", "businessType", "businessName", "confirmationStatus"],
      additionalProperties: false
    },
  }
];

// Type definitions
export type OutboundCallParams = {
  to: string;
};

export type OutboundCallResult = {
  sid: string;
  status: string;
};

// Tool execution functions
async function fetchResponsesMessage(body: any) {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...body, parallel_tool_calls: false }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return { error: 'Something went wrong.' };
  }

  const completion = await response.json();
  return completion;
}

function getToolResponse(fName: string, args: any) {
  switch (fName) {
    case "getPricingInfo":
      return examplePricingInfo;
    case "getWhatsAppInfo":
      return exampleWhatsAppInfo;
    case "getFeaturesInfo":
      return exampleFeaturesInfo;
    case "getIraqBusinessRegistrationInfo":
      // If a specific topic is requested, return that topic's information
      if (args.topic) {
        const topicKey = Object.keys(iraqBusinessRegistrationKnowledge).find(
          key => iraqBusinessRegistrationKnowledge[key as keyof typeof iraqBusinessRegistrationKnowledge].topic.toLowerCase().includes(args.topic.toLowerCase()) ||
                 iraqBusinessRegistrationKnowledge[key as keyof typeof iraqBusinessRegistrationKnowledge].name.toLowerCase().includes(args.topic.toLowerCase())
        );
        if (topicKey) {
          return [iraqBusinessRegistrationKnowledge[topicKey as keyof typeof iraqBusinessRegistrationKnowledge]];
        }
      }
      // If no specific topic or topic not found, return all knowledge
      return iraqBusinessRegistrationKnowledgeArray;
    case "outboundCall":
      // This would typically make a real API call
      return { result: "Call initiated successfully" };
    case "handleConversationClosure":
      // This would typically save the conversation closure information
      // In a real implementation, this would call the actual handleConversationClosure tool
      return { result: "Conversation closure handled successfully" };
    default:
      return { result: "Information not available" };
  }
}

/**
 * Iteratively handles function calls returned by the Responses API
 */
async function handleToolCalls(
  body: any,
  response: any,
  addBreadcrumb?: (title: string, data?: any) => void,
) {
  let currentResponse = response;

  while (true) {
    if (currentResponse?.error) {
      return { error: 'Something went wrong.' } as any;
    }

    const outputItems: any[] = currentResponse.output ?? [];

    const functionCalls = outputItems.filter((item) => item.type === 'function_call');

    if (functionCalls.length === 0) {
      const assistantMessages = outputItems.filter((item) => item.type === 'message');

      const finalText = assistantMessages
        .map((msg: any) => {
          const contentArr = msg.content ?? [];
          return contentArr
            .filter((c: any) => c.type === 'output_text')
            .map((c: any) => c.text)
            .join('');
        })
        .join('\n');

      return finalText;
    }

    for (const toolCall of functionCalls) {
      const fName = toolCall.name;
      const args = JSON.parse(toolCall.arguments || '{}');
      const toolRes = getToolResponse(fName, args);

      if (addBreadcrumb) {
        addBreadcrumb(`[supervisorAgent] function call: ${fName}`, args);
      }
      if (addBreadcrumb) {
        addBreadcrumb(`[supervisorAgent] function call result: ${fName}`, toolRes);
      }

      body.input.push(
        {
          type: 'function_call',
          call_id: toolCall.call_id,
          name: toolCall.name,
          arguments: toolCall.arguments,
        },
        {
          type: 'function_call_output',
          call_id: toolCall.call_id,
          output: JSON.stringify(toolRes),
        },
      );
    }

    currentResponse = await fetchResponsesMessage(body);
  }
}

export const getNextResponseFromSupervisor = tool({
  name: 'getNextResponseFromSupervisor',
  description: 'Determines the next response for Rawan AI customer service',
  parameters: {
    type: 'object',
    properties: {
      relevantContextFromLastUserMessage: {
        type: 'string',
        description: 'Key information from the user\'s most recent message',
      },
    },
    required: ['relevantContextFromLastUserMessage'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { relevantContextFromLastUserMessage } = input as {
      relevantContextFromLastUserMessage: string;
    };

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    const history: any[] = (details?.context as any)?.history ?? [];
    const filteredLogs = history.filter((log) => log.type === 'message');

    const body: any = {
      model: 'gpt-4.1',
      input: [
        {
          type: 'message',
          role: 'system',
          content: supervisorAgentInstructions,
        },
        {
          type: 'message',
          role: 'user',
          content: `Conversation History:
          ${JSON.stringify(filteredLogs, null, 2)}
          
          Recent Context:
          ${relevantContextFromLastUserMessage}
          `,
        },
      ],
      tools: supervisorAgentTools,
    };

    const response = await fetchResponsesMessage(body);
    if (response.error) {
      return { error: 'Something went wrong.' };
    }

    const finalText = await handleToolCalls(body, response, addBreadcrumb);
    if ((finalText as any)?.error) {
      return { error: 'Something went wrong.' };
    }

    return { nextResponse: finalText as string };
  },
});