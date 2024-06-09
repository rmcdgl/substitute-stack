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
	<title>SubstituteStack - make substack links work everywhere</title>
	<style>
		body {
			font-family: sans-serif;
			padding: 20px;
			max-width: 768px;
			margin: 0 auto;
			text-align: center;
			background-color: #fff;
			color: #000;
		}

		#urlInput {
			width: 100%;
			padding: 10px;
			font-size: 18px;
			margin-top: 20px;
			box-sizing: border-box;
			background-color: #fff;
			color: #000;
		}

		.output {
			margin-top: 20px;
			padding: 10px;
			border: 1px solid #ccc;
			cursor: pointer;
			background-color: #f9f9f9;
			word-wrap: break-word;
			color: #000;
		}

		.hidden {
			display: none;
		}

		.message {
			margin-top: 10px;
			color: green;
			display: none;
		}

		@media (prefers-color-scheme: dark) {
			body {
				background-color: #121212;
				color: #ffffff;
			}

			#urlInput {
				background-color: #333;
				color: #ffffff;
				border: 1px solid #555;
			}

			.output {
				background-color: #333;
				border: 1px solid #555;
				color: #ffffff;
			}

			.message {
				color: #00ff00;
			}
		}
	</style>

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="SubstituteStack - Make Substack Links Work Everywhere">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://substitutestack.com">
	<!-- <meta property="og:image" content="https://substitutestack.com/og.jpeg"> -->
	<meta property="og:description" content="Transform substack links to show rich previews on Twitter/X">
	<meta property="og:site_name" content="SubstituteStack">
</head>

<body>

	<h1>SubstituteStack</h1>
	<p>Make substack links work properly on Twitter/X</p>
	<input type="text" id="urlInput" placeholder="Enter a substack.com link">
	<div id="output" class="output hidden"></div>
	<div id="message" class="message">Copied to clipboard</div>

	<script>
		let timeout;

		document.getElementById('urlInput').addEventListener('input', function () {
			const input = this.value;
			const outputDiv = document.getElementById('output');
			const messageDiv = document.getElementById('message');

			if (input.includes('substack.com')) {
				const transformedUrl = input.replace('substack.com', 'substitutestack.com');
				outputDiv.textContent = transformedUrl;
				outputDiv.classList.remove('hidden');
			} else {
				outputDiv.classList.add('hidden');
			}
			messageDiv.style.display = 'none';
			clearTimeout(timeout);
		});

		document.getElementById('output').addEventListener('click', function () {
			const range = document.createRange();
			range.selectNode(this);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				const messageDiv = document.getElementById('message');
				messageDiv.style.display = 'block';
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					messageDiv.style.display = 'none';
				}, 3000);
			} catch (err) {
				console.error('Failed to copy text: ', err);
			}
		});
	</script>

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
