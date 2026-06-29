import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // For Hackathon purposes (to avoid ImgBB IP blocking and Firebase billing),
    // we will simply return the base64 string to act as the "URL".
    // This allows the image to be stored directly in Firestore!
    
    // Ensure it has the data URI prefix so the HTML <img src="..."> can render it
    const imageUrl = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    return NextResponse.json({ success: true, imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
