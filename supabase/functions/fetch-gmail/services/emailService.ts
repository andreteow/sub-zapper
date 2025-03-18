
// Email-related services
interface EmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
    body: {
      data?: string;
    };
    parts?: {
      mimeType: string;
      body: {
        data?: string;
      };
    }[];
  };
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}

// Helper function to decode base64 encoded email content
export function decodeBase64(encodedString: string): string {
  // Replace non-standard chars that Gmail uses
  const sanitized = encodedString.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(
      atob(sanitized)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (error) {
    console.error("Error decoding base64:", error);
    return "Error decoding email content";
  }
}

// Extract the email body from the payload
export function extractEmailBody(payload: any): string {
  // Start with an empty body
  let body = '';
  
  // Check for simple body
  if (payload.body && payload.body.data) {
    body = decodeBase64(payload.body.data);
  }
  
  // Check for multipart messages
  if (payload.parts) {
    for (const part of payload.parts) {
      // For text parts, add to body
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        if (part.body && part.body.data) {
          body += decodeBase64(part.body.data);
        }
      }
      
      // Handle nested parts (recursively)
      if (part.parts) {
        for (const nestedPart of part.parts) {
          if (nestedPart.mimeType === 'text/plain' || nestedPart.mimeType === 'text/html') {
            if (nestedPart.body && nestedPart.body.data) {
              body += decodeBase64(nestedPart.body.data);
            }
          }
        }
      }
    }
  }
  
  return body;
}

// Extract List-Unsubscribe header if present
export function extractUnsubscribeUrl(headers: any[]): string | null {
  const unsubscribeHeader = headers.find(h => 
    h.name.toLowerCase() === 'list-unsubscribe' || 
    h.name.toLowerCase() === 'list-unsubscribe-post'
  );
  
  if (unsubscribeHeader) {
    // Extract URL from header format like: <https://example.com/unsubscribe>
    const matches = unsubscribeHeader.value.match(/<(https?:\/\/[^>]+)>/);
    if (matches && matches[1]) {
      return matches[1];
    }
    
    // If not in angle brackets, check if it's a direct URL
    if (unsubscribeHeader.value.trim().startsWith('http')) {
      return unsubscribeHeader.value.trim();
    }
    
    // Return the raw value as fallback
    return unsubscribeHeader.value;
  }
  
  return null;
}

export async function fetchEmailDetails(accessToken: string, messageId: string) {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch email details for ID ${messageId}:`, response.status, errorText);
      throw new Error(`Failed to fetch email details: ${response.status} ${errorText}`);
    }

    const data: EmailMessage = await response.json();
    
    // Extract relevant email information
    const headers = data.payload.headers;
    const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
    const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
    const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';
    const to = headers.find(h => h.name.toLowerCase() === 'to')?.value || '';
    
    // Extract the email body
    const fullBody = extractEmailBody(data.payload);
    
    // Extract unsubscribe URL from header (if available)
    const unsubscribeUrl = extractUnsubscribeUrl(headers);
    
    return {
      id: data.id,
      threadId: data.threadId,
      snippet: data.snippet,
      subject,
      from,
      to,
      date,
      labelIds: data.labelIds,
      sizeEstimate: data.sizeEstimate,
      internalDate: data.internalDate,
      fullBody, // Include full body for better unsubscribe link detection
      unsubscribeUrl, // Add the extracted unsubscribe URL if found in headers
    };
  } catch (error) {
    console.error(`Error fetching details for email ${messageId}:`, error);
    throw error;
  }
}

export async function fetchEmails(accessToken: string, maxResults = 100) {
  try {
    console.log(`Fetching up to ${maxResults} emails with access token`);
    
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch emails:', response.status, errorText);
      throw new Error(`Failed to fetch email list: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const emails = [];

    // Fetch details for each email
    for (const message of data.messages || []) {
      try {
        const messageDetails = await fetchEmailDetails(accessToken, message.id);
        emails.push(messageDetails);
      } catch (error) {
        console.error(`Error fetching details for email ${message.id}:`, error);
        // Continue with other emails even if one fails
      }
    }

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}
