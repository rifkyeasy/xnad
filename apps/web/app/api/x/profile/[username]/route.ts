import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cleanUsername = username.replace('@', '').toLowerCase();

  try {
    const res = await fetch(`https://tweethunter.io/api/convert2?inputString=${cleanUsername}`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        Referer: 'https://tweethunter.io/twitter-id-converter',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const data = await res.json();

    return NextResponse.json({
      name: data.name || username,
      username: data.username || cleanUsername,
      userId: data.userId || '',
      avatar: data.avatar || '',
      createdAt: data.createdAt || '',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
