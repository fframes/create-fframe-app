# create-fframe-app

This is an interactive CLI to start a [farcaster frames](https://docs.farcaster.xyz/learn/what-is-farcaster/frames) server application using Next.js and TypeScript.

Load this example frame using [warpcast's frame validator](https://warpcast.com/~/developers/frames):
`https://create-fframe-app.vercel.app/api/example`

## getting started

make sure you have Node.js and npx installed, then run:
```bash
npx create-fframe-app
# or
npx create-fframe-app@latest
```

to add a new frame applet, run this from your project root:
```bash
npm run generate-applet my-applet
# or
yarn generate-applet my-applet
```

## local testing
start the development server locally:
```bash
npm run dev
# or
yarn dev
```

then:
* [click here](http://127.0.0.1:3000/api/example/images?frameId=1) to test image generation
* [click here](http://127.0.0.1:3000/api/example?frameId=0) to test the API response

## server testing

to test a live server deployment:
* deploy your _fframe_ app on [vercel](https://vercel.com)
* add `NEXT_PUBLIC_FFRAME_BASE_URL=https://{your-project-name}.vercel.app` as an environment variable and redeploy the project
* test using [warpcast's frame validator](https://warpcast.com/~/developers/frames) (paste `https://{your-project-name}.vercel.app/api/{your_applet_id}`)
