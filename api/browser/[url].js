export default async function handler(req, res) {

  const { url } = req.query;

  if (!url) {
    res.status(400).send("Missing URL");
    return;
  }

  try {

    const decoded = Buffer.from(url, "base64").toString("utf8");

    const response = await fetch(decoded);

    let html = await response.text();

    const base = new URL(decoded).origin;

    // Fix absolute links
    html = html.replace(/href="https?:\/\/(.*?)"/g, (match, p1) => {
      const target = "https://" + p1;
      const encoded = Buffer.from(target).toString("base64");
      return `href="/api/browser/${encoded}"`;
    });

    // Fix root-relative links
    html = html.replace(/href="\/(.*?)"/g, (match, p1) => {
      const target = base + "/" + p1;
      const encoded = Buffer.from(target).toString("base64");
      return `href="/api/browser/${encoded}"`;
    });

    // Fix form submissions (Google search)
    html = html.replace(/action="\/(.*?)"/g, (match, p1) => {
      const target = base + "/" + p1;
      const encoded = Buffer.from(target).toString("base64");
      return `action="/api/browser/${encoded}"`;
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(html);

  } catch (error) {

    res.status(500).send("Proxy error");

  }

}
