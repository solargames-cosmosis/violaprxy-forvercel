export default async function handler(req, res) {

  const { url } = req.query;

  if (!url) {
    res.status(400).send("Missing URL");
    return;
  }

  try {

    const decoded = Buffer.from(url, "base64").toString("utf8");

    const response = await fetch(decoded);

    const html = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(html);

  } catch (error) {
    res.status(500).send("Proxy error");
  }

}
