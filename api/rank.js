export default async function handler(req, res) {
  const { name, tag } = req.query;

  if (!name || !tag) {
    return res.status(400).send("Usage: ?name=Pseudo&tag=Tag");
  }

  try {
    // Nouvelle URL v2 avec /pc/
    const response = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/mmr/eu/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
    );

    const data = await response.json();

    if (!data.data || data.status !== 200) {
      // Essai avec l'ancienne URL v1 en fallback
      const fallback = await fetch(
        `https://api.henrikdev.xyz/valorant/v1/mmr/eu/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
      );
      const fallbackData = await fallback.json();

      if (!fallbackData.data) {
        return res.status(200).send(`${name}#${tag} introuvable. Vérifie le pseudo et le tag.`);
      }

      const { currenttierpatched, ranking_in_tier } = fallbackData.data;
      return res.status(200).send(
        `${name}#${tag} → ${currenttierpatched} | ${ranking_in_tier} RR`
      );
    }

    const { current_data } = data.data;
    const { currenttierpatched, ranking_in_tier, mmr_change_to_last_game } = current_data;

    const change = mmr_change_to_last_game >= 0
      ? `+${mmr_change_to_last_game}`
      : `${mmr_change_to_last_game}`;

    return res.status(200).send(
      `${name}#${tag} → ${currenttierpatched} | ${ranking_in_tier} RR (${change} dernier match)`
    );

  } catch (err) {
    return res.status(200).send("Erreur lors de la récupération du rang.");
  }
}
