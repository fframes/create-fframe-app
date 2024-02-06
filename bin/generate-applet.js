#! /usr/bin/env node

const path = require("path");
const fs = require("fs");


function generateApplet(name, projectPath = '') {
    // create directories
    const apiRootPath = path.join(projectPath || process.cwd(), 'src/app/api');
    const dirPath = path.join(apiRootPath, name);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`directory ${name} created`);
    } else {
        console.error(`directory ${name} already exists`);
        process.exit(1);
    }
    const imagesDirPath = path.join(apiRootPath, name + '/images');
    if (!fs.existsSync(imagesDirPath)) {
        fs.mkdirSync(imagesDirPath, { recursive: true });
        console.log(`directory ${name}/images created`);
    } else {
        console.error(`directory ${name}/images already exists`);
        process.exit(1);
    }

    // create constants.ts file
    const constantsAppletName = name.toUpperCase().replaceAll('-','_');
    const constantsContent = `
import { getBaseUrl } from '@/utils';


export const ${constantsAppletName}_APPLET_ID = '${name}';
export const ${constantsAppletName}_APPLET_BASE_URL = \`\${getBaseUrl()}/api/\${${constantsAppletName}_APPLET_ID}\`;
export enum FRAME_ID {
  'initial' = '0',
  'success' = '1',
}
`;
    const constantsFilePath = path.join(dirPath, 'constants.ts');
    fs.writeFileSync(constantsFilePath, constantsContent.trim());
    console.log(`constants.ts created in ${dirPath}`);

    // create route.ts file
    const routeContent = `
import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage } from '@coinbase/onchainkit';
import { ${constantsAppletName}_APPLET_BASE_URL, FRAME_ID } from '@/app/api/${name}/constants';
import { getFrameHtmlResponse } from "@/utils";


export async function GET(request: NextRequest) {
  // return initial frame
  return new NextResponse(
    getFrameHtmlResponse({
      title: 'Example Frame',
      buttons: [
        { label: 'Button 1' },
        { label: 'Button 2' },
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
    // handle post from initial frame
    if (message.button === 1) {
      // handle button 1 click
      return new NextResponse(getFrameHtmlResponse({
        title: 'Success 1',
        image: getImageURL(FRAME_ID.success),
      }));
    } else {
      // handle button 2 click
      return new NextResponse(getFrameHtmlResponse({
        title: 'Success 2',
        buttons: [{
          label: 'by veganbeef <3',
          action: 'post_redirect'
        }],
        image: getImageURL(FRAME_ID.success),
        post_url: getPostURL(FRAME_ID.success),
      }));
    }
  } else if (frameId === FRAME_ID.success) {
    // handle post_redirect button click from second frame
    const headers = new Headers({ 'Location': 'https://github.com/veganbeef' });
    return new NextResponse(null, { status: 302, statusText: 'OK', headers });
  }

  return new NextResponse(null, { status: 400 });
}

function getImageURL(frameId: string) {
  return \`\${${constantsAppletName}_APPLET_BASE_URL}/images?frameId=\${frameId}\`;
}

function getPostURL(frameId: string) {
  return \`\${${constantsAppletName}_APPLET_BASE_URL}?frameId=\${frameId}\`;
}

export const dynamic = 'force-dynamic';
`;
    const routeFilePath = path.join(dirPath, 'route.ts');
    fs.writeFileSync(routeFilePath, routeContent.trim());
    console.log(`route.ts created in ${dirPath}`);

    // create images/route.tsx file
    const imagesRouteContent = `
import { NextRequest } from 'next/server';
import { FRAME_ID } from '@/app/api/${name}/constants';
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
        <div style={{ fontSize: '48px', color: 'white', marginBottom: '10px' }}>Click below!</div>
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
`;
    const imagesRoutePath = path.join(imagesDirPath, 'route.tsx');
    fs.writeFileSync(imagesRoutePath, imagesRouteContent.trim());
    console.log(`route.tsx created in ${imagesDirPath}`);

    console.log(`🔲✅ fframe applet ${name} successfully generated ✅🔲\n`);
}

module.exports = { generateApplet };
