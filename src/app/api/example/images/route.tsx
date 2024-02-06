import { NextRequest } from 'next/server';
import { FRAME_ID } from '@/app/api/example/constants';
import { ImageResponse } from 'next/og';
import { Property } from "csstype";


const defaultStyles = {
  display: 'flex',
  flexDirection: 'column' as Property.FlexDirection,
  backgroundColor: 'black',
  width: '100%',
  height: '100%',
  padding: '20px',
  justifyContent: 'center'
};

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const frameId = request.nextUrl.searchParams.get('frameId') as FRAME_ID;

  if (frameId === FRAME_ID.initial) {
    return new ImageResponse((
      <div style={defaultStyles}>
        <div style={{fontSize: '48px', color: 'white', marginBottom: '10px'}}>Click below!</div>
        <div style={{ fontSize: '24px', color: 'white' }}>Click a button below to succeed</div>
      </div>
    ), { width: 600, height: 400 });
  } else if (frameId === FRAME_ID.success) {
    return new ImageResponse((
      <div style={defaultStyles}>
        <div style={{ fontSize: '48px', color: 'white' }}>Success!</div>
      </div>
    ), { width: 600, height: 400 });
  } else {
    return new ImageResponse((
      <div style={{...defaultStyles}}>
        <div style={{fontSize: '48px', color: 'red', marginBottom: '10px'}}>Error!</div>
        <div style={{fontSize: '24px', color: 'white'}}>Server experienced an error processing your request.</div>
      </div>
    ), {width: 600, height: 400})
  }
}
