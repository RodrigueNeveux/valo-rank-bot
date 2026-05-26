export default async function handler(req, res) {
  const { name, tag } = req.query;

  if (!name || !tag) {
    return res.status(400).send("Usage: ?name=Pseudo&tag=Tag");
  }

  try {
    const url = `https://api.henrikdev.xyz/valorant/v2/mmr/eu/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    const response = await fetch(url, {
      headers: {
        "Authorization": process.env.HENRIK_API_KEY
      }
    });

    const data = await response.json();

    // Debug : affiche toute la structure
    return res.status(200).json(data);

  } catch (err) {
    return res.status(200).send("Erreur: " + err.message);
  }
}
