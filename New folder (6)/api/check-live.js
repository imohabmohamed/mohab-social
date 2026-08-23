export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await fetch('https://kick.com/api/v1/channels/imohab', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ isLive: false });
    }

    const data = await response.json();
    const isLive = data && data.livestream !== null;

    return res.status(200).json({ isLive: isLive });
  } catch (error) {
    return res.status(200).json({ isLive: false, error: error.message });
  }
}