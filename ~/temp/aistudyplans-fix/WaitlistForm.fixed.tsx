  // Also log the successful submission
  console.log("waitlist_users submission successful");
  
  // Now also call the API route to trigger email notifications
  try {
    console.log("Calling waitlist API to send email notifications");
    const apiResponse = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        source: 'website-direct-api'
      }),
    });
    
    if (apiResponse.ok) {
      console.log("API notification successful, emails should be sent");
    } else {
      console.error("API notification failed, but Supabase entry was created");
      console.error("API error:", await apiResponse.text());
    }
  } catch (apiError) {
    // Don't throw here - we still want to consider the signup successful
    // even if the email notification fails
    console.error("Error calling API for email notifications:", apiError);
  } 