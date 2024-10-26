import { useEffect, useState } from 'react';

const apiKey =
  '_A9QaZDJewc0TKL8sEUsNFoqOCbKT-a6zopzW2Dy30XZ1YnE1MwtmTPYQloPIyvH';

const useSendSMS = () => {
  // const [content, setContent] = useState('');
  // const [to, setTo] = useState('');

  const sendSMS = async ({
    content = '',
    to = '',
  }: {
    content: string;
    to: string;
  }) => {
    console.log('Sending SMS with content:', content, 'to:', to);

    // Validate content and recipient
    if (!content || !to) {
      console.error('Content or recipient number is not set.');
      return;
    }

    try {
      const response = await fetch('https://api.httpsms.com/v1/messages/send', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          from: '+639097134971',
          to: `+${to}`,
        }),
      });

      // Check for a successful response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending SMS:', errorData);
        return;
      }

      const data = await response.json();
      console.log('SMS sent successfully:', data);
    } catch (err) {
      console.error('Failed to send SMS:', err);
    }
  };

  return { sendSMS };
};

export default useSendSMS;
