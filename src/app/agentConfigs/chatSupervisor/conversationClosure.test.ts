/**
 * Test file for conversation closure behavior
 * This file demonstrates how the conversation closure feature should work
 */

// Mock data for testing
const mockClientData = {
  clientName: "أحمد محمد",
  nationalId: "12345678901234",
  phoneNumber: "+964 770 123 4567",
  email: "ahmed.mohammed@email.com",
  businessType: "تجاري",
  businessName: "محل أحمد للأجهزة",
  businessLocation: "بغداد",
  businessStructure: "فردي",
  numberOfPartners: undefined,
  initialCapital: 5000000,
  expectedEmployees: 3,
  businessAddress: "شارع الكرادة، بغداد",
  businessPhone: "+964 1 234 5678",
  businessEmail: "info@ahmed-shop.com",
  websiteOrSocialMedia: "@ahmed_shop",
  specificQuestions: "ما هي الوثائق المطلوبة لتسجيل المحل؟",
  registrationTimeline: "خلال شهر",
  budgetForFees: 150000,
  specialRequirements: "تسجيل علامة تجارية",
  confirmationStatus: "confirmed",
  deliveryPreference: "pdf"
};

// Test the handleConversationClosure tool
async function testHandleConversationClosure() {
  console.log("Testing handleConversationClosure tool...");
  
  try {
    // Simulate calling the tool with mock data
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockClientData),
    });
    
    const result = await response.json();
    console.log("Email API response:", result);
    
    if (result.message) {
      console.log("✅ Conversation closure test passed!");
    } else {
      console.log("❌ Conversation closure test failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error testing conversation closure:", error);
  }
}

// Test the PDF generation utility
async function testPDFGeneration() {
  console.log("Testing PDF generation utility...");
  
  try {
    // Import the PDF utility
    const { generateBusinessRegistrationHTML } = await import('@/app/lib/pdfUtils');
    
    // Generate HTML content
    const htmlContent = generateBusinessRegistrationHTML(mockClientData);
    console.log("Generated HTML content length:", htmlContent.length);
    
    if (htmlContent.length > 0) {
      console.log("✅ PDF generation test passed!");
    } else {
      console.log("❌ PDF generation test failed: Empty content");
    }
  } catch (error) {
    console.error("❌ Error testing PDF generation:", error);
  }
}

// Run tests
async function runTests() {
  console.log("Running conversation closure tests...\n");
  
  await testHandleConversationClosure();
  console.log(); // Empty line for spacing
  
  await testPDFGeneration();
  console.log(); // Empty line for spacing
  
  console.log("All tests completed!");
}

// Export for testing
export { runTests, mockClientData };

// Run tests if this file is executed directly
// if (typeof window === 'undefined' && require.main === module) {
//   runTests();
// }