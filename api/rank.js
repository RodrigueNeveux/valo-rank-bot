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

    if (!data.data || data.status !== 200) {
      return res.status(200).send(`${name}#${tag} introuvable. Vérifie le pseudo et le tag.`);
    }

    const { currenttierpatched, ranking_in_tier, mmr_change_to_last_game } = data.data.current_data;

    const change = mmr_change_to_last_game >= 0
      ? `+${mmr_change_to_last_game}`
      : `${mmr_change_to_last_game}`;

    return res.status(200).send(
      `${name}#${tag} → ${currenttierpatched} | ${ranking_in_tier} RR (${change} dernier match)`
    );

  } catch (err) {
    return res.status(200).send("Erreur: " + err.message);
  }
}
