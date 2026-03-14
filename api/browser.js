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

    // Rewrite links so they stay inside Viola
    html = html.replace(/href="\/(.*?)"/g, `href="/api/browser?url=${Buffer.from(base + "/$1").toString("base64")}"`);

    html = html.replace(/href="https?:\/\/(.*?)"/g, (match, p1) => {
      const newUrl = "https://" + p1;
      const encoded = Buffer.from(newUrl).toString("base64");
      return `href="/api/browser?url=${encoded}"`;
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(html);

  } catch (error) {
    res.status(500).send("Proxy error");
  }

}
