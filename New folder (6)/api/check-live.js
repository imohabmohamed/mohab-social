export default async function handler(req, res) {
    try {
        const response = await fetch('https://kick.com/api/v1/channels/imohab', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        
        if (!response.ok) {
            return res.status(200).json({ isLive: false, viewers: 0 });
        }
        
        const data = await response.json();
        const isLive = data.livestream !== null;
        const viewers = isLive ? data.livestream.viewer_count : 0;
        const title = isLive ? data.livestream.session_title : '';

        return res.status(200).json({
            isLive,
            viewers,
            title
        });
    } catch (error) {
        return res.status(200).json({ isLive: false, viewers: 0 });
    }
}