export default async function handler(req, res) {

  try {

    const encoded = req.url.split("/api/browser/")[1];

    if (!encoded) {
      res.status(400).send("Missing URL");
      return;
    }

    const decoded = Buffer.from(encoded, "base64").toString("utf8");

    const response = await fetch(decoded);

    let html = await response.text();

    const base = new URL(decoded).origin;

    html = html.replace(/href="https?:\/\/(.*?)"/g, (match, p1) => {
      const newUrl = "https://" + p1;
      const enc = Buffer.from(newUrl).toString("base64");
      return `href="/api/browser/${enc}"`;
    });

    html = html.replace(/href="\/(.*?)"/g, (match, p1) => {
      const newUrl = base + "/" + p1;
      const enc = Buffer.from(newUrl).toString("base64");
      return `href="/api/browser/${enc}"`;
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(html);

  } catch (error) {

    res.status(500).send("Proxy error");

  }

}
