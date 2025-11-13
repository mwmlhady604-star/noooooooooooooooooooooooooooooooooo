/**
 * Simple PDF generation utility for business registration information
 * This is a placeholder implementation - in a real application, you would use a library like pdfkit or jsPDF
 */

export interface BusinessRegistrationInfo {
  clientName: string;
  nationalId: string;
  phoneNumber: string;
  email: string;
  businessType: string;
  businessName: string;
  businessLocation: string;
  businessStructure: string;
  numberOfPartners?: number;
  initialCapital?: number;
  expectedEmployees?: number;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  websiteOrSocialMedia?: string;
  specificQuestions?: string;
  registrationTimeline: string;
  budgetForFees?: number;
  specialRequirements?: string;
}

/**
 * Generate a PDF buffer from business registration information
 * @param info Business registration information
 * @returns PDF buffer (in a real implementation, this would be an actual PDF buffer)
 */
export async function generateBusinessRegistrationPDF(info: BusinessRegistrationInfo): Promise<Buffer> {
  // This is a mock implementation - in a real application, you would use a PDF generation library
  // For example, with pdfkit:
  /*
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  
  doc.fontSize(16).text('Business Registration Information', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(12).text(`Client Name: ${info.clientName}`);
  doc.text(`National ID: ${info.nationalId}`);
  doc.text(`Phone Number: ${info.phoneNumber}`);
  doc.text(`Email: ${info.email}`);
  // ... add all other fields
  
  doc.end();
  
  // Convert to buffer
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
  */
  
  // Mock implementation - return a simple text buffer
  const content = `
Business Registration Information
=================================

Client Name: ${info.clientName}
National ID: ${info.nationalId}
Phone Number: ${info.phoneNumber}
Email: ${info.email}

Business Information:
---------------------
Type: ${info.businessType}
Name: ${info.businessName}
Location: ${info.businessLocation}
Structure: ${info.businessStructure}
Number of Partners: ${info.numberOfPartners || 'N/A'}
Initial Capital: ${info.initialCapital || 'N/A'}
Expected Employees: ${info.expectedEmployees || 'N/A'}

Business Contact:
-----------------
Address: ${info.businessAddress}
Phone: ${info.businessPhone}
Email: ${info.businessEmail}
Website/Social Media: ${info.websiteOrSocialMedia || 'N/A'}

Additional Information:
----------------------
Specific Questions: ${info.specificQuestions || 'N/A'}
Registration Timeline: ${info.registrationTimeline}
Budget for Fees: ${info.budgetForFees || 'N/A'}
Special Requirements: ${info.specialRequirements || 'N/A'}
  `.trim();
  
  return Buffer.from(content, 'utf-8');
}

/**
 * Generate HTML content for business registration information
 * @param info Business registration information
 * @returns HTML string
 */
export function generateBusinessRegistrationHTML(info: BusinessRegistrationInfo): string {
  return `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h2 style="color: #2c5aa0; text-align: center;">معلومات تسجيل المشروع</h2>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px;">معلومات العميل</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; width: 30%;">الاسم الكامل</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.clientName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">الرقم الوطني</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.nationalId}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">رقم الهاتف</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.phoneNumber}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">البريد الإلكتروني</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.email}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px;">معلومات المشروع</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; width: 30%;">نوع النشاط</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessType}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">اسم المشروع</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">موقع المشروع</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessLocation}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">الهيكل القانوني</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessStructure}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">عدد الشركاء</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.numberOfPartners || 'غير محدد'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">رأس المال المبدئي</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.initialCapital ? info.initialCapital.toLocaleString() + ' دينار عراقي' : 'غير محدد'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">عدد الموظفين المتوقع</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.expectedEmployees || 'غير محدد'}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px;">معلومات الاتصال بالمشروع</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; width: 30%;">العنوان</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessAddress}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">هاتف المشروع</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessPhone}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">بريد المشروع</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.businessEmail}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">الموقع أو وسائل التواصل</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.websiteOrSocialMedia || 'غير محدد'}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px;">معلومات إضافية</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; width: 30%;">أسئلة محددة</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.specificQuestions || 'لا توجد'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">الجدول الزمني للتسجيل</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.registrationTimeline}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">الميزانية المتوقعة للرسوم</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.budgetForFees ? info.budgetForFees.toLocaleString() + ' دينار عراقي' : 'غير محدد'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">متطلبات خاصة</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${info.specialRequirements || 'لا توجد'}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px;">
        <p style="font-size: 16px; color: #2c5aa0; font-weight: bold;">
          شكراً لاستخدامك خدمة استشارات تسجيل الشركات
        </p>
        <p style="font-size: 14px; color: #555;">
          نتمنى لكم التوفيق في مشروعكم الجديد!
        </p>
      </div>
    </div>
  `;
}