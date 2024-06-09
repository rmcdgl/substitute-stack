# SubstituteStack - Share Substack links on Twitter/X

In April 2023, Twitter (now X) which had recently been acquired by Elon Musk [started fighting](https://www.theverge.com/2023/4/6/23673043/twitter-substack-embeds-bots-tools-api). Most of this has been walked back, but a direct link to a substack no longer provides a rich opengraph/card preview and is likely deboosted by the For You algorithm.

This repository contains the backend code for [SubstituteStack.com](substitutestack.com)

**SubstituteStack fixes this**

replace any substack.com url with substitutestack.com

```diff
- my-cool-newsletter.substack.com/p/my-cool-post
+ my-cool-newsletter.substitutestack.com/p/my-cool-post
```

This works with every substack link, whether to a specific post, an about page or to the homepage.

This behaves as a redirect to all services, except the `Twitterbot` user-agent, in which case it serves an HTML page with the `<head>` section pulled from substack, which Twitter/X dutifully turns into a rich twitter card.

## Avoids writing `substack` anywhere in the URL

X has in its short history had [issues with string replacement](https://arstechnica.com/tech-policy/2024/04/elon-musks-x-botched-an-attempt-to-replace-twitter-com-links-with-x-com/), so I've avoided 'substack' appearing in the URL at all, in case it has any effect on the algorithm juice.

## Linking best practice

X deboosts tweets containing links heavily, even when using SubstituteStack. The best way to get around this is by posting a screenshot or a tweet without a link, and then replying to it with a link, which creates a thread without the algorithmic penalty.

## Hosting yourself

SubstituteStack runs on [Cloudflare workers](https://workers.cloudflare.com/) which has a generous free tier. Replacing the `DEPLOYMENT_URL` in `src/index.ts` and it should all work, however you'll need a domain name.

Adding a [custom domain to your substack directly](https://support.substack.com/hc/en-us/articles/360051222571-How-do-I-set-up-my-custom-domain-on-Substack) would be a better path, as it allows for rich previews as well as giving you a home on the web that you control.
