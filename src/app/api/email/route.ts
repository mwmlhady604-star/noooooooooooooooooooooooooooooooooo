import { NextResponse } from 'next/server';
import { generateBusinessRegistrationHTML } from '@/app/lib/pdfUtils';

// Mock email sending function - in a real implementation, you would use a service like Nodemailer or SendGrid
async function sendEmail(to: string, subject: string, htmlContent: string, attachment?: Buffer) {
  // This is a mock implementation - replace with actual email sending logic
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${htmlContent}`);
  
  if (attachment) {
    console.log(`Attachment: PDF with ${attachment.length} bytes`);
  }
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success response
  return { success: true, messageId: 'mock-message-id' };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      clientName, 
      phoneNumber, 
      businessType, 
      businessName, 
      email,
      deliveryPreference,
      nationalId,
      businessLocation,
      businessStructure,
      numberOfPartners,
      initialCapital,
      expectedEmployees,
      businessAddress,
      businessPhone,
      businessEmail,
      websiteOrSocialMedia,
      specificQuestions,
      registrationTimeline,
      budgetForFees,
      specialRequirements
    } = body;
    
    // Validate required fields
    if (!clientName || !phoneNumber || !businessType || !businessName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Create HTML content based on delivery preference
    let subject = '';
    let htmlContent = '';
    let pdfBuffer: Buffer | undefined;
    
    if (deliveryPreference === 'pdf') {
      subject = `معلومات تسجيل مشروعك: ${businessName}`;
      
      // Generate complete business registration info for PDF
      const businessInfo = {
        clientName,
        nationalId: nationalId || '',
        phoneNumber,
        email,
        businessType,
        businessName,
        businessLocation: businessLocation || '',
        businessStructure: businessStructure || '',
        numberOfPartners,
        initialCapital,
        expectedEmployees,
        businessAddress: businessAddress || '',
        businessPhone: businessPhone || '',
        businessEmail: businessEmail || '',
        websiteOrSocialMedia,
        specificQuestions,
        registrationTimeline: registrationTimeline || '',
        budgetForFees,
        specialRequirements
      };
      
      // In a real implementation, you would generate an actual PDF here
      // pdfBuffer = await generateBusinessRegistrationPDF(businessInfo);
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>معلومات تسجيل مشروعك</h2>
          <p>أهلاً ${clientName}،</p>
          <p>شكراً لاستخدامك خدمة استشارات تسجيل الشركات. المرفق هو نسخة PDF من معلومات مشروعك.</p>
          
          <h3>ملخص المعلومات:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">الاسم الكامل</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${clientName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">رقم الهاتف</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${phoneNumber}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">نوع النشاط</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${businessType}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">اسم المشروع</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${businessName}</td>
            </tr>
          </table>
          
          <p>في المرفق ستجدون ملف PDF يحتوي على جميع المعلومات المطلوبة لتسجيل مشروعكم.</p>
          <p>نتمنى لكم التوفيق في مشروعكم الجديد!</p>
          <br>
          <p>مع تحيات فريق خدمة استشارات تسجيل الشركات</p>
        </div>
      `;
    } else {
      subject = `خطوات تسجيل مشروعك: ${businessName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>خطوات تسجيل مشروعك</h2>
          <p>أهلاً ${clientName}،</p>
          <p>شكراً لاستخدامك خدمة استشارات تسجيل الشركات. إليك الخطوات المطلوبة لتسجيل مشروعك:</p>
          
          <h3>ملخص المعلومات:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">الاسم الكامل</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${clientName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">رقم الهاتف</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${phoneNumber}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">نوع النشاط</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${businessType}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">اسم المشروع</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${businessName}</td>
            </tr>
          </table>
          
          <h3>الخطوات التالية:</h3>
          <ol>
            <li>التوجه إلى دائرة تسجيل الشركات في المحافظة المختارة</li>
            <li>تقديم الطلب الرسمي مع الوثائق المطلوبة</li>
            <li>دفع الرسوم المطلوبة</li>
            <li>انتظار موافقة الجهة المختصة</li>
            <li>استلام الشهادة والوثائق النهائية</li>
          </ol>
          
          <p>نتمنى لكم التوفيق في مشروعكم الجديد!</p>
          <br>
          <p>مع تحيات فريق خدمة استشارات تسجيل الشركات</p>
        </div>
      `;
    }
    
    // Send the email
    const result = await sendEmail(email, subject, htmlContent, pdfBuffer);
    
    return NextResponse.json({ 
      message: 'Email sent successfully',
      ...result
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}