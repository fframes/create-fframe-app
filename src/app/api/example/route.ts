import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage } from '@coinbase/onchainkit';
import { EXAMPLE_APPLET_BASE_URL, FRAME_ID } from '@/app/api/example/constants';
import { getFrameHtmlResponse } from "@/utils";


export async function GET(request: NextRequest) {
  // return initial frame
  return new NextResponse(
    getFrameHtmlResponse({
      title: 'Example Frame',
      buttons: [
        {
          label: 'Click me!',
        },
        {
          label: 'GitHub repo',
          action: 'post_redirect'
        },
      ],
      image: getImageURL(FRAME_ID.initial),
      post_url: getPostURL(FRAME_ID.initial),
    }),
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const frameId = request.nextUrl.searchParams.get('frameId') as FRAME_ID;
  const body = await request.json();
  const { isValid, message } = await getFrameMessage(body);
  if (!isValid || !message) {
    return new NextResponse('error: unable to validate message', { status: 400 });
  }

  if (frameId === FRAME_ID.initial) {
    // handle button click from initial frame
    if (message.button === 1) {
      // return second frame
      return new NextResponse(getFrameHtmlResponse({
        title: 'Success!',
        buttons: [{
          label: 'by veganbeef <3',
          action: 'post_redirect'
        }],
        image: getImageURL(FRAME_ID.success),
        post_url: getPostURL(FRAME_ID.success),
      }));
    } else {
      // handle post_redirect click
      const headers = new Headers({ 'Location': 'https://github.com/rabbitholegg/create-fframe-app' });
      return new NextResponse(null, { status: 302, statusText: 'OK', headers });
    }
  } else if (frameId === FRAME_ID.success) {
    // handle post_redirect button click from second frame
    const headers = new Headers({ 'Location': 'https://github.com/veganbeef' });
    return new NextResponse(null, { status: 302, statusText: 'OK', headers });
  } else {
    return new NextResponse(null, { status: 400 })
  }
}

function getImageURL(frameId: string) {
  return `${EXAMPLE_APPLET_BASE_URL}/images?frameId=${frameId}`;
}

function getPostURL(frameId: string) {
  return `${EXAMPLE_APPLET_BASE_URL}?frameId=${frameId}`;
}

export const dynamic = 'force-dynamic';
