export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await fetch('https://kick.com/api/v1/channels/imohab', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://kick.com/imohab'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ isLive: false, status: response.status });
    }

    const data = await response.json();
    
    // التحقق المباشر من وجود البث
    const isLive = Boolean(data && data.livestream);

    return res.status(200).json({ isLive: isLive, title: data?.livestream?.session_title || null });
  } catch (error) {
    return res.status(200).json({ isLive: false, error: error.message });
  }
}