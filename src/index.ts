export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleRequest(request);
	},
};

const DEPLOYMENT_URL = 'substitutestack.com';

async function handleRequest(request: Request): Promise<Response> {
	const url = new URL(request.url);

	if (url.pathname === '/' && url.hostname === DEPLOYMENT_URL) {
		return new Response(htmlTemplate(), {
			headers: { 'Content-Type': 'text/html' },
		});
	} else {
		// replace substitutestack.com with substack.com
		const targetUrl = request.url.replace(DEPLOYMENT_URL, 'substack.com');

		const userAgent = request.headers.get('User-Agent') || '';
		const isTwitterBot = userAgent.includes('Twitterbot');

		if (!isTwitterBot) {
			return Response.redirect(targetUrl, 307);
		}

		try {
			const targetResponse = await fetch(targetUrl);
			const targetText = await targetResponse.text();

			const headContent = extractHead(targetText);
			const responseHtml = htmlTemplateWithHead(headContent);

			return new Response(responseHtml, {
				headers: { 'Content-Type': 'text/html' },
			});
		} catch (error) {
			return new Response('Error fetching the origin page', { status: 500 });
		}
	}
}

function htmlTemplate(): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Substitute Stack</title>
</head>
<body>
  <h1>Hello from Substitute stack</h1>
</body>
</html>
  `;
}

function htmlTemplateWithHead(headContent: string): string {
	return `
<!DOCTYPE html>
<html lang="en">
${headContent}
<body>
  <h1>Twitter Bot Content</h1>
</body>
</html>
  `;
}

function extractHead(html: string): string {
	const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
	return headMatch ? headMatch[0] : '<head></head>';
}
