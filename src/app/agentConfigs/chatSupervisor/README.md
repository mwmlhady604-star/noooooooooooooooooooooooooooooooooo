# Iraq Business Registration Knowledge Base Integration

This directory contains the integration of the "Guide to Registering Small and Medium Enterprises in Iraq" into the chat supervisor agent.

## Files

1. **iraqBusinessRegistrationKnowledge.ts** - Contains the structured knowledge base extracted from the guide
2. **supervisorAgent.ts** - Updated to include a new tool for accessing the Iraq business registration information
3. **index.ts** - Updated to include special instructions for handling business registration inquiries
4. **testKnowledgeIntegration.ts** - Simple test file to verify the knowledge base integration

## Features

The integration provides comprehensive information about:

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

## Usage

When a user asks about business registration in Iraq, the junior agent will consult the supervisor, who can access this knowledge base through the `getIraqBusinessRegistrationInfo` tool. The tool can either return all information or filter by specific topics.