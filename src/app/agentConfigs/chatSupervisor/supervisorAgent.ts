// supervisorAgent.ts
import { tool } from '@openai/agents/realtime';

// Import the Iraq business registration knowledge base
import { iraqBusinessRegistrationKnowledge, iraqBusinessRegistrationKnowledgeArray } from './iraqBusinessRegistrationKnowledge';

// Iraq Business Registration Knowledge Base Integration
// Module-level citation store — set when supervisor fetches knowledge,
// consumed by useHandleSessionHistory when the next assistant message is added.
let _pendingCitation: string | null = null;
export function consumePendingCitation(): string | null {
  const val = _pendingCitation;
  _pendingCitation = null;
  return val;
}

export const iraqBusinessRegistrationTopics = {
  benefits: "benefits_of_registration",
  procedures: "registration_procedures",
  requirements: "general_requirements",
  business_structures: "business_structures",
  business_activities: "business_activities",
  commercial_names: "commercial_names",
  environmental: "environmental_compliance",
  intellectual_property: "intellectual_property",
  tax: "tax_obligations",
  social_security: "social_security",
  resources: "useful_resources"
};

export const supervisorAgentInstructions = `You are an expert customer service supervisor agent for Iraq Business Registration Service, tasked with providing real-time guidance to a more junior agent named ادم (Adam) that's chatting directly with the customer. You will be given detailed response instructions, tools, and the full conversation history so far, and you should create a correct next message that the junior agent can read directly.

# Instructions

You can provide an answer directly, or call a tool first and then answer the question.

If you need to call a tool, but don't have the right information, you can tell the junior agent to ask the user for that missing information.

Your message will be read verbatim by the junior agent (who will then translate it into Iraqi Arabic), so keep it clear and concise.

==== Domain-Specific Agent Instructions ====
You are a helpful customer service agent working for Iraq Business Registration Service, helping entrepreneurs understand and complete the process of registering businesses in Iraq. You are helping a user efficiently fulfill their request while adhering closely to provided guidelines.

# Core Responsibilities

## Business Registration Expertise
You have comprehensive knowledge about registering small and medium enterprises in Iraq. You must use the getIraqBusinessRegistrationInfo tool for all business registration inquiries to provide accurate, up-to-date information.

## Information Collection
When users inquire about business registration, guide the junior agent to collect the following information naturally:
- Personal details (name, email)
- Business information (type, name, location, structure)
- Operational details (capital, employees, address)
- Specific requirements and timeline

## Email Communication
You can send comprehensive business registration summaries to users via email using the sendSummaryToEmail tool. This should be used when:
- The user requests email documentation
- All necessary information has been collected
- The user confirms they want to receive information by email

## Tool Usage
Always call a tool before answering factual questions about:
- Business registration procedures in Iraq
- Requirements and documentation
- Benefits of formal registration
- Tax obligations and social security
- Environmental compliance
- Intellectual property protection

## Escalation Policy
- Escalate to a human if the user requests complex legal advice
- Do not discuss prohibited topics (politics, religion, controversial current events)
- Refuse to provide financial or legal advice beyond general guidance

# Business Registration Knowledge Areas

You have access to comprehensive information about:

## 1. Benefits of Formal Registration
- Legal protection and credibility
- Access to banking and financing
- Government support programs
- Tax benefits and incentives

## 2. Business Structures
- Individual Establishment
- Partnership Companies
- Limited Liability Companies
- Joint Stock Companies

## 3. Registration Procedures
- Document preparation and submission
- Commercial name registration
- Tax registration process
- Social security registration

## 4. Compliance Requirements
- Environmental approvals
- Intellectual property protection
- Municipal licenses
- Industry-specific regulations

## 5. Ongoing Obligations
- Tax filing requirements
- Social security contributions
- Annual renewals
- Compliance reporting

# Response Instructions

## Tone and Style
- Maintain a professional, friendly, and helpful tone
- Be clear and concise for text conversation translation
- Use simple language that can be easily translated to Iraqi Arabic

## Information Accuracy
- Only use information retrieved from the knowledge base tools
- Do not speculate or make assumptions
- Cite specific requirements and procedures from official sources

## Tool Calling Protocol
- Always call getIraqBusinessRegistrationInfo for business registration inquiries
- Use sendSummaryToEmail when users want documentation sent to their email
- If missing information for tool calls, ask the user for clarification
- Never use placeholder values in tool calls

# Sample Phrases

## Before Calling Tools
"Let me get the specific details about that for you."
"I'll check the official requirements for your situation."
"One moment while I look up the exact procedure."

## When Information is Missing
"To provide you with accurate information, could you tell me which type of business structure you're considering?"
"Which aspect of business registration are you most interested in? (procedures, requirements, benefits, etc.)"

## For Email Summaries
"I can send you a comprehensive summary of this information to your email address."
"Would you like me to email you the step-by-step registration guide?"

## For Complex Inquiries
"For detailed legal advice on complex business structures, I recommend consulting with a legal professional."
"I can provide general guidance, but specific legal interpretations should come from qualified experts."

## Conversation Closure
When all necessary information has been collected:
1. Confirm the collected information with the user
2. Ask about their preference for receiving follow-up information
3. Use sendSummaryToEmail to send comprehensive documentation
4. Use handleConversationClosure to save their preferences

# User Message Format

Always include your final response to the user.

When providing factual information from retrieved context, always include citations immediately after the relevant statement(s). Use the format:

For a single source: [TOPIC]
For multiple sources: [TOPIC1, TOPIC2]

Only provide information about Iraq business registration based on the official knowledge base. Do not answer questions outside this scope.

# Out-of-Scope Questions Policy

CRITICAL: You must STRICTLY limit your responses to information contained in the ILO business registration knowledge base (iraqBusinessRegistrationKnowledge). If a user asks a question that falls outside the documented knowledge base — including but not limited to specific legal interpretations, court rulings, sector-specific regulations not covered in the guide, foreign investment laws, banking regulations, labor disputes, or any topic not explicitly addressed in the knowledge base — you MUST:

1. Clearly state: "I do not have sufficient information in my knowledge base to provide an accurate answer to this question."
2. Advise the user: "For detailed and reliable guidance on this matter, I strongly recommend consulting a qualified legal advisor or lawyer who specializes in Iraqi business law."
3. Do NOT attempt to guess, speculate, or provide general information from outside the knowledge base. Given the legal sensitivity of company registration and financial regulations, providing incorrect information may mislead users and result in serious legal or financial consequences.
4. You may offer to help with any related topic that IS covered in the knowledge base.

This policy applies even if you have general knowledge about the topic. You must only rely on the verified ILO guide content retrieved through the getIraqBusinessRegistrationInfo tool.

# Important Notes

## Email Offer After Steps
After providing any step-by-step registration procedure or detailed requirements list, ALWAYS end your response with:
"يمكنني إرسال هذه الخطوات إلى بريدك الإلكتروني — هل تريد ذلك؟"
If the user agrees, call sendSummaryToEmail immediately. If no email collected yet, ask the junior agent to request it first.

- Always verify that email is collected before sending any information
- Guide users through the step-by-step registration process
- Highlight benefits specific to their business type
- Provide realistic timelines and cost estimates
- Emphasize the importance of proper documentation`;

export const supervisorAgentTools = [
  {
    type: "function",
    name: "getIraqBusinessRegistrationInfo",
    description: "Tool to get comprehensive information about registering businesses in Iraq, including procedures, requirements, benefits, and compliance.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The specific topic about business registration in Iraq. Can be: 'benefits', 'procedures', 'requirements', 'business_structures', 'business_activities', 'commercial_names', 'environmental', 'intellectual_property', 'tax', 'social_security', 'resources' or leave empty for all information.",
          enum: ["benefits", "procedures", "requirements", "business_structures", "business_activities", "commercial_names", "environmental", "intellectual_property", "tax", "social_security", "resources", ""]
        },
        subtopic: {
          type: "string",
          description: "More specific area within the main topic, if applicable."
        }
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "sendSummaryToEmail",
    description: "Send a comprehensive business registration summary to the user's email address",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email address to send the summary to"
        },
        clientName: {
          type: "string",
          description: "Full name of the client for personalization"
        },
        businessType: {
          type: "string",
          description: "Type of business for customized information"
        },
        businessStructure: {
          type: "string",
          description: "Business structure for procedure details"
        },
        summaryType: {
          type: "string",
          enum: ["full_guide", "step_by_step", "requirements_only", "custom"],
          description: "Type of summary to send"
        },
        customTopics: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Specific topics to include in custom summary"
        },
        includeAttachments: {
          type: "boolean",
          description: "Whether to include PDF attachments"
        }
      },
      required: ["email", "clientName", "summaryType"],
      additionalProperties: false
    },
  },
  {
    type: "function",
    name: "handleConversationClosure",
    description: "Handle conversation closure by confirming collected information with the user and setting email preferences for business registration follow-up",
    parameters: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "Full name of the client"
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
        currentRegistrationStep: {
          type: "string",
          description: "Where the client is in the registration process"
        },
        registrationAssistanceRequested: {
          type: "string",
          description: "What help the client wants (documents, steps, fees, timeline...)"
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
        websiteOrSocialMedia: {
          type: "string",
          description: "Website or Social Media (if applicable)"
        },
        specificQuestions: {
          type: "string",
          description: "The user s exact question(s) about business registration in Iraq"
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
      required: ["clientName", "businessType", "businessName", "confirmationStatus"],
      additionalProperties: false
    },
  }
];

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

function buildStepsSummaryHtml(args: any): string {
  const clientName = args.clientName || 'العميل الكريم';
  const businessType = args.businessType || '';
  const businessStructure = args.businessStructure || '';
  return `
  <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <div style="background: #f97316; padding: 24px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 22px;">خطوات تسجيل مشروعك في العراق</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">دليل ILO للمشاريع الصغيرة والمتوسطة</p>
    </div>
    <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
      <p>مرحباً <strong>${clientName}</strong>،</p>
      <p>فيما يلي ملخص خطوات تسجيل مشروعك${businessType ? ` (${businessType})` : ''}${businessStructure ? ` — ${businessStructure}` : ''} في العراق:</p>
      <ol style="padding-right: 20px; line-height: 2;">
        <li>التسجيل في وزارة التجارة أو الجهة المختصة</li>
        <li>الحصول على الرقم الضريبي من هيئة الضرائب</li>
        <li>التسجيل في الضمان الاجتماعي للعمال</li>
        <li>استخراج ترخيص النشاط التجاري من البلدية</li>
        <li>فتح حساب مصرفي تجاري رسمي</li>
      </ol>
      <p style="margin-top: 24px; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px;">
        هذا الملخص مستند إلى دليل ILO لتسجيل المشاريع الصغيرة والمتوسطة في العراق.
        للاستفسار، تواصل مع المساعد الذكي أو زر البوابة الرسمية.
      </p>
    </div>
  </div>`;
}

async function getToolResponse(fName: string, args: any) {
  switch (fName) {
    case "getIraqBusinessRegistrationInfo":
      // If a specific topic is requested, filter the knowledge base
      if (args.topic) {
        // Normalize the topic by replacing underscores with spaces for flexible matching
        const normalizedTopic = args.topic.toLowerCase().replace(/_/g, ' ');
        const filteredKnowledge = iraqBusinessRegistrationKnowledgeArray.filter(item => {
          const itemTopic = item.topic.toLowerCase();
          const itemName = item.name.toLowerCase();
          // Match by topic key (both directions for partial matches)
          if (itemTopic.includes(normalizedTopic) || normalizedTopic.includes(itemTopic)) {
            return true;
          }
          // Match by name
          if (itemName.includes(normalizedTopic) || normalizedTopic.includes(itemName)) {
            return true;
          }
          // Match by content
          if (item.content.toLowerCase().includes(normalizedTopic)) {
            return true;
          }
          return false;
        });
        
        // If no specific matches found, return an out-of-scope response
        if (filteredKnowledge.length === 0) {
          console.log(`No specific matches found for topic: ${args.topic}. Topic is out of scope.`);
          return {
            outOfScope: true,
            message: `No information found for topic "${args.topic}" in the ILO business registration knowledge base. This question falls outside the scope of the documented guide. You must inform the user that you do not have sufficient information to provide an accurate answer and strongly recommend they consult a qualified legal advisor or lawyer specializing in Iraqi business law. Do NOT attempt to answer from general knowledge.`
          };
        }
        
        return filteredKnowledge;
      }
      // If no specific topic, return all knowledge
      return iraqBusinessRegistrationKnowledgeArray;
      
    case "sendSummaryToEmail": {
      const emailHtml = buildStepsSummaryHtml(args);
      try {
        const resp = await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: args.email,
            subject: "خطوات تسجيل مشروعك في العراق — دليل ILO",
            html: emailHtml,
          }),
        });
        const data = await resp.json();
        if (data.success) {
          return { success: true, message: `تم إرسال الخطوات بنجاح إلى ${args.email}` };
        }
        return { success: false, error: data.error || "فشل إرسال البريد الإلكتروني" };
      } catch (e) {
        return { success: false, error: "حدث خطأ أثناء إرسال البريد الإلكتروني" };
      }
    }
      
    case "handleConversationClosure":
      // In a real implementation, this would call the actual handleConversationClosure tool
      // For now, return a success response
      return { 
        success: true, 
        message: "Conversation closure handled successfully",
        data: {
          clientName: args.clientName,
          businessType: args.businessType,
          businessName: args.businessName,
          deliveryPreference: args.deliveryPreference,
          timestamp: new Date().toISOString()
        }
      };
    default:
      return { result: "Tool not implemented" };
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
  let citationMarker: string | null = null; // collected from knowledge tool calls

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

      // Store citation in module-level var for useHandleSessionHistory to consume
      if (citationMarker) {
        _pendingCitation = citationMarker;
      }
      return finalText; // clean text — no marker in what the junior agent speaks
    }

    for (const toolCall of functionCalls) {
      const fName = toolCall.name;
      const args = JSON.parse(toolCall.arguments || '{}');
      const toolRes = await getToolResponse(fName, args);

      // Extract citation from the knowledge tool result (first matching item)
      if (fName === 'getIraqBusinessRegistrationInfo' && !citationMarker) {
        const items: any[] = Array.isArray(toolRes) ? toolRes : [];
        if (items.length > 0 && (items[0] as any).pageRef) {
          const item = items[0] as any;
          citationMarker = `[REF:${item.pageRef}|${item.sectionTitle || item.name}]`;
        }
      }

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
  description: 'Determines the next response for Iraq Business Registration customer service',
  parameters: {
    type: 'object',
    properties: {
      relevantContextFromLastUserMessage: {
        type: 'string',
        description: 'Key information from the user\'s most recent message, especially regarding business registration inquiries',
      },
      conversationStage: {
        type: 'string',
        enum: ['initial_contact', 'information_collection', 'specific_questions', 'confirmation', 'closure'],
        description: 'Current stage of the conversation to provide appropriate guidance'
      },
      collectedInformation: {
        type: 'object',
        description: 'Business registration information collected so far from the user',
        properties: {
          hasPersonalInfo: { type: 'boolean' },
          hasBusinessInfo: { type: 'boolean' },
          hasContactInfo: { type: 'boolean' },
          hasEmail: { type: 'boolean' },
          specificTopicsRequested: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    required: ['relevantContextFromLastUserMessage'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { relevantContextFromLastUserMessage, conversationStage, collectedInformation } = input as {
      relevantContextFromLastUserMessage: string;
      conversationStage?: string;
      collectedInformation?: any;
    };

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    const history: any[] = (details?.context as any)?.history ?? [];
    const filteredLogs = history.filter((log) => log.type === 'message');

    // Build context-aware instructions
    let contextAwareInstructions = supervisorAgentInstructions;
    
    if (conversationStage === 'information_collection') {
      contextAwareInstructions += `\n\nCURRENT STAGE: INFORMATION COLLECTION\nFocus on gathering complete business registration details from the user. Ensure all required fields are collected naturally.`;
    } else if (conversationStage === 'specific_questions') {
      contextAwareInstructions += `\n\nCURRENT STAGE: SPECIFIC QUESTIONS\nProvide detailed, accurate information about business registration procedures using the knowledge base tools.`;
    } else if (conversationStage === 'confirmation') {
      contextAwareInstructions += `\n\nCURRENT STAGE: CONFIRMATION\nVerify all collected information with the user and prepare for conversation closure. Consider using sendSummaryToEmail if the user has provided an email address.`;
    } else if (conversationStage === 'closure') {
      contextAwareInstructions += `\n\nCURRENT STAGE: CLOSURE\nUse sendSummaryToEmail to send comprehensive business registration information and handleConversationClosure to finalize the conversation.`;
    }

    const body: any = {
      model: 'gpt-4.1',
      input: [
        {
          type: 'message',
          role: 'system',
          content: contextAwareInstructions,
        },
        {
          type: 'message',
          role: 'user',
          content: `Conversation History:
          ${JSON.stringify(filteredLogs, null, 2)}
          
          Recent Context:
          ${relevantContextFromLastUserMessage}
          
          Conversation Stage: ${conversationStage || 'not specified'}
          Collected Information: ${collectedInformation ? JSON.stringify(collectedInformation) : 'none'}
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