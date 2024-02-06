import { getBaseUrl } from '@/utils';


export const EXAMPLE_APPLET_ID = 'example';
export const EXAMPLE_APPLET_BASE_URL = `${getBaseUrl()}/api/${EXAMPLE_APPLET_ID}`;
export enum FRAME_ID {
  'initial' = '0',
  'success' = '1',
}
