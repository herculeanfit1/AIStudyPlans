  // Insert the waitlist entry directly into Supabase
  const { data, error: dbError } = await supabase
    .from('waitlist_users')
    .insert([
      { 
        name: formData.name, 
        email: formData.email,
        source: 'website-direct',
        feedback_campaign_started: false
      }
    ])
    .select();

  // Also log the successful submission
  console.log("Waitlist submission successful");
  
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
  
  // Track the event (optional, if you have client-side tracking) 