import { FrameMetadataType } from "@coinbase/onchainkit/dist/types/core/types";


export interface FrameMetadata extends FrameMetadataType {
  title: string;
}

/**
 * custom implementation of @coinbase/onchainkit's getFrameHtmlResponse function to add og properties
 */
export function getFrameHtmlResponse({ buttons, image, post_url, title }: FrameMetadata): string {
  let buttonHtml = '';
  if (buttons) {
    for (let i = 0; i < buttons.length; i++) {
      buttonHtml += `<meta name="fc:frame:button:${i + 1}" content="${buttons[i].label}">`;
      if (buttons[i].action === 'post_redirect') {
        buttonHtml += `<meta name="fc:frame:button:${i + 1}:action" content="post_redirect">`;
      }
    }
  }
  return `<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta property="og:title" content="${title}">
        <meta property="og:image" content="${image}">
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="${image}">
        <meta name="fc:frame:post_url" content="${post_url}">
        ${buttonHtml}
      </head>
    </html>`;
}

export function getBaseUrl() {
  if (!process.env.NEXT_PUBLIC_FFRAME_BASE_URL) return '';

  const rawBaseUrl = process.env.NEXT_PUBLIC_FFRAME_BASE_URL;
  if (rawBaseUrl[rawBaseUrl.length - 1] === '/') {
    return rawBaseUrl.slice(0, rawBaseUrl.length - 1);
  } else {
    return rawBaseUrl;
  }
}
