# Deployment Guide for Render

This document provides instructions for deploying the OpenAI Realtime Agents application to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. A GitHub account with permissions to fork repositories
3. An OpenAI API key
4. Supabase credentials (URL and anon key)
5. Resend API key (for email functionality)

## Deployment Steps

### 1. Fork the Repository
First, fork this repository to your GitHub account:
1. Click the "Fork" button at the top right of this repository page
2. Select your GitHub account as the destination

### 2. Create a New Web Service on Render
1. Log in to your Render account
2. Click "New" and select "Web Service"
3. Connect your GitHub account when prompted
4. Select the forked repository

### 3. Configure the Web Service
Render should automatically detect the configuration from the [render.yaml](file:///C:/Users/HP/Videos/regerstation/openai-realtime-agents/render.yaml) file:
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: Node
- Plan: Starter (can be upgraded as needed)

### 4. Add Environment Variables
In the "Environment Variables" section, add the following variables:

| Key | Value Source | Description |
|-----|--------------|-------------|
| OPENAI_API_KEY | Your OpenAI API key | Required for OpenAI services |
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase URL | For Supabase integration |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anon key | For Supabase integration |
| RESEND_API_KEY | Your Resend API key | For email functionality |

### 5. Deploy
Click "Create Web Service" to begin the deployment process. Render will:
1. Clone your repository
2. Run the build command
3. Run the start command
4. Make your application available at a render.com subdomain

## Monitoring and Management

After deployment, you can:
- View logs in the Render dashboard
- Set up custom domains
- Configure auto-deploys from GitHub
- Scale your service as needed

## Troubleshooting

If you encounter issues:
1. Check the build logs for errors
2. Verify all environment variables are correctly set
3. Ensure your OpenAI API key has the necessary permissions
4. Check that your Supabase and Resend keys are valid

For more information, refer to the [Render documentation](https://render.com/docs).