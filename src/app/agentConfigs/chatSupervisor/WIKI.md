# Iraq Business Registration Chat Supervisor Wiki

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Core Components](#core-components)
- [Features](#features)
- [Conversation Flow](#conversation-flow)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Knowledge Base Integration](#knowledge-base-integration)
- [Tools](#tools)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

The **Iraq Business Registration Chat Supervisor** is an intelligent conversational AI system designed to assist entrepreneurs and business owners in Iraq with the process of registering their businesses. The system provides real-time guidance, collects necessary information, and offers comprehensive knowledge about Iraqi business registration procedures.

### Key Features
- **Multi-agent Architecture**: Junior agent (Adam) and Supervisor agent collaboration
- **Iraqi Arabic Support**: Native language support for natural communication
- **Knowledge Base Integration**: Comprehensive information about Iraqi business registration
- **Data Collection**: Systematic gathering of business registration details
- **Email Integration**: Progress updates and final documentation delivery
- **Conversation Closure**: Structured confirmation and preference handling

### Technology Stack
- **Framework**: OpenAI Realtime Agents
- **Language**: TypeScript
- **Database**: Supabase
- **Knowledge Base**: Custom JSON structure
- **Voice**: Cedar (OpenAI voice model)

## Project Structure

```
chatSupervisor/
├── index.ts                    # Main agent configuration and tools
├── supervisorAgent.ts          # Supervisor agent logic and knowledge tools
├── iraqBusinessRegistrationKnowledge.ts  # Knowledge base content
├── sampleData.ts              # Example data and mock information
├── conversationClosure.test.ts # Test suite for conversation closure
├── CONVERSATION_CLOSURE.md    # Detailed documentation for closure behavior
├── README.md                  # Project overview
└── WIKI.md                    # This documentation file
```

## Architecture

### Agent Hierarchy
1. **Junior Agent (Adam)**
   - Handles initial user interaction
   - Collects basic information
   - Defers complex queries to Supervisor
   - Speaks in Iraqi Arabic

2. **Supervisor Agent**
   - Provides expert-level guidance
   - Accesses comprehensive knowledge base
   - Handles complex business registration inquiries
   - Generates detailed responses

### Communication Flow
```
User → Junior Agent → Supervisor Agent → Knowledge Base → Response
```

### Data Flow
```
User Input → Information Collection → Supabase Storage → Email Notification
```

## Core Components

### 1. Junior Agent (index.ts)
**Name**: Adam (ادم)
**Role**: First point of contact for users
**Capabilities**:
- Natural conversation in Iraqi Arabic
- Information collection
- Tool execution (saveClientInformation, sendProgressEmail, handleConversationClosure)
- Supervisor delegation

### 2. Supervisor Agent (supervisorAgent.ts)
**Role**: Expert advisor for business registration
**Capabilities**:
- Access to comprehensive knowledge base
- Complex query resolution
- Email summary generation
- Conversation closure management

### 3. Knowledge Base (iraqBusinessRegistrationKnowledge.ts)
Structured information covering:
- Benefits of formal registration
- Business structures and types
- Registration procedures
- Environmental compliance
- Tax obligations
- Social security registration
- Intellectual property protection
- Useful resources and websites

## Features

### 1. Information Collection
The system collects comprehensive business registration information:
- **Personal Information**: Name, email, phone
- **Business Details**: Type, name, location, structure
- **Operational Data**: Capital, employees, address
- **Specific Requirements**: Timeline, budget, special needs

### 2. Multi-Stage Conversation
1. **Initial Contact**: Greeting and introduction
2. **Information Gathering**: Systematic data collection
3. **Specific Questions**: Detailed inquiry handling
4. **Confirmation**: Information verification
5. **Closure**: Preference setting and documentation delivery

### 3. Email Integration
- **Progress Updates**: Mid-conversation summaries
- **Final Documentation**: Comprehensive registration guides
- **Delivery Preferences**: PDF or step-by-step instructions

### 4. Knowledge Base Access
Real-time access to official Iraqi business registration information through:
- `getIraqBusinessRegistrationInfo` tool
- Topic-based filtering
- Context-aware responses

## Conversation Flow

### Typical User Journey
1. **Greeting**
   ```
   اهلا، هذا ادم من خدمة استشارات تسجيل الشركات، شلون اكدر اساعدك بتسجيل مشروعك؟
   ```

2. **Information Collection**
   - Business type and name
   - Location and structure
   - Capital and employee estimates
   - Timeline and budget

3. **Knowledge Query**
   - User asks specific questions
   - Junior agent consults supervisor
   - Supervisor accesses knowledge base
   - Detailed response provided

4. **Confirmation & Closure**
   - Information summary in Iraqi Arabic
   - User confirmation
   - Delivery preference selection
   - Email documentation sent

### Example Interaction
```
User: أبغى أسجل مشروع تجاري
Agent: أكيد، خل أستفسر من المشرف عن الخطوات المطلوبة.

[Supervisor consultation]

Agent: لتسجيل مشروع تجاري في العراق، تحتاج تجهز وثائق معينة و تتبع خطوات محددة. 
مثلاً، تقدر تبدأ بتسجيل اسمك التجاري و تحصل على ترخيص من البلدية.
تحب أشرحلك الخطوات بالتفصيل؟
```

## API Endpoints

### 1. Email Service (`/api/email`)
**Method**: POST
**Purpose**: Send progress updates and final documentation
**Parameters**:
```json
{
  "email": "user@example.com",
  "subject": "Business Registration Progress",
  "html": "<p>Progress summary...</p>"
}
```

### 2. Responses API (`/api/responses`)
**Method**: POST
**Purpose**: Handle supervisor agent tool calls
**Parameters**: OpenAI function calling format

## Data Models

### Client Information Model
```typescript
{
  clientName: string;
  email: string;
  businessType: string;  // Commercial, Industrial, Agricultural, Service
  businessName: string;
  businessLocation: string;
  businessStructure: string;  // Individual, Partnership, Company
  numberOfPartners?: number;
  initialCapital: number;
  expectedEmployees: number;
  businessAddress: string;
  websiteOrSocialMedia?: string;
  specificQuestions: string;
  registrationTimeline: string;
  budgetForFees: number;
  specialRequirements: string;
}
```

### Knowledge Base Structure
```typescript
{
  id: string;
  name: string;
  topic: string;
  content: string;
}
```

## Knowledge Base Integration

### Topics Covered
1. **Benefits of Registration**
   - Legal protection
   - Financial advantages
   - Market credibility

2. **Business Structures**
   - Individual Establishment
   - Partnership Companies
   - Limited Liability Companies
   - Joint Stock Companies

3. **Registration Procedures**
   - Office/Store registration
   - Industrial project registration
   - Company incorporation
   - One-window system at Ministry of Commerce

4. **Compliance Requirements**
   - Environmental approvals
   - Tax obligations
   - Social security registration
   - Intellectual property protection

### Access Methods
- **getIraqBusinessRegistrationInfo** tool
- Topic filtering (benefits, procedures, requirements, etc.)
- Full knowledge base retrieval

## Tools

### Junior Agent Tools
1. **getNextResponseFromSupervisor**
   - Delegates complex queries to supervisor
   - Provides context and conversation history

2. **saveClientInformation**
   - Stores collected data in Supabase
   - Saves to JSON file for backup
   - Field mapping (camelCase → snake_case)

3. **sendProgressEmail**
   - Sends mid-conversation updates
   - Progress summaries to user's email

4. **handleConversationClosure**
   - Manages conversation end
   - Confirms information accuracy
   - Sets delivery preferences

### Supervisor Agent Tools
1. **getIraqBusinessRegistrationInfo**
   - Accesses knowledge base
   - Topic-based filtering
   - Context-aware responses

2. **sendSummaryToEmail**
   - Generates comprehensive documentation
   - Customizable content types
   - PDF or step-by-step delivery

3. **handleConversationClosure**
   - Final confirmation handling
   - Preference storage
   - Closure management

## Testing

### Test File: conversationClosure.test.ts
**Purpose**: Validate conversation closure functionality
**Tests Included**:
- Email API integration
- PDF generation utility
- Mock data validation
- Error handling scenarios

### Running Tests
```bash
# Run conversation closure tests
npm run test:conversation

# Or execute test file directly
node conversationClosure.test.ts
```

### Sample Test Data
Located in `sampleData.ts`:
- Example client information
- Mock business registration data
- Policy documents examples
- Location information samples

## Deployment

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Supabase Setup
1. Create `business_registration_inquiries` table
2. Configure appropriate fields matching client information model
3. Set up RLS (Row Level Security) policies

### Database Schema
```sql
CREATE TABLE business_registration_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT,
  email TEXT,
  business_type TEXT,
  business_name TEXT,
  business_location TEXT,
  business_structure TEXT,
  number_of_partners INTEGER,
  initial_capital NUMERIC,
  expected_employees INTEGER,
  business_address TEXT,
  website_or_social_media TEXT,
  specific_questions TEXT,
  registration_timeline TEXT,
  budget_for_fees NUMERIC,
  special_requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Errors
**Symptoms**: Data not saving to database
**Solutions**:
- Verify environment variables
- Check Supabase project URL and key
- Ensure table exists with correct schema
- Validate RLS policies

#### 2. Email Sending Failures
**Symptoms**: No emails received
**Solutions**:
- Check `/api/email` endpoint implementation
- Verify email format validation
- Test with mock email service
- Implement proper error handling

#### 3. Knowledge Base Access Issues
**Symptoms**: Incorrect or no information returned
**Solutions**:
- Verify `getIraqBusinessRegistrationInfo` tool implementation
- Check topic filtering logic
- Ensure knowledge base file is properly imported
- Validate content structure

#### 4. Conversation Flow Problems
**Symptoms**: Incorrect agent responses or flow
**Solutions**:
- Review agent instructions in `index.ts`
- Check supervisor agent instructions
- Validate tool calling logic
- Test with sample conversations

### Debugging Tips
1. **Enable Logging**: Use `console.log` for debugging tool calls
2. **Check Tool Responses**: Verify tool execution results
3. **Monitor API Calls**: Use browser dev tools to inspect requests
4. **Validate Data**: Ensure proper data mapping between agents

### Error Handling
- **Supabase Errors**: Implement retry logic and error notifications
- **Email Failures**: Provide fallback mechanisms
- **Knowledge Base Issues**: Graceful degradation with default responses
- **Network Problems**: Offline mode or cached responses

## Future Enhancements

### Planned Features
1. **Multi-language Support**: English and Modern Standard Arabic
2. **Advanced Analytics**: Conversation metrics and user behavior
3. **Integration APIs**: Connect with government registration systems
4. **Mobile App**: Dedicated mobile interface
5. **Voice Recognition**: Enhanced voice interaction capabilities

### Technical Improvements
1. **Database Optimization**: Indexing and query performance
2. **Caching Layer**: Reduce knowledge base access latency
3. **Error Recovery**: Automated failure handling
4. **Scalability**: Load balancing and horizontal scaling
5. **Security**: Enhanced authentication and data protection

## Contributing

### Development Guidelines
1. **Code Style**: Follow TypeScript best practices
2. **Documentation**: Update wiki with new features
3. **Testing**: Add tests for new functionality
4. **Version Control**: Use descriptive commit messages
5. **Review Process**: Peer review for all changes

### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New feature branches
- `hotfix/*`: Urgent fixes

## Support

For issues, questions, or feature requests:
- **Documentation**: Refer to this wiki
- **Code Issues**: Check existing problems and logs
- **Feature Requests**: Submit through issue tracker
- **Knowledge Base Updates**: Contact subject matter experts

---
*Last Updated: January 2026*
*Version: 1.0.0*