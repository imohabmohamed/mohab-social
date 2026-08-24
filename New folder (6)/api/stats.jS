/**
 * NEXUS — SERVERLESS BACKEND API WITH YOUTUBE API INTEGRATION
 * /api/stats.js
 */

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    let youtubeSubs = "14.2K SUBSCRIBERS"; // قيمة افتراضية في حال الخطأ

    try {
        const API_KEY = process.env.YOUTUBE_API_KEY; 
        const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID; 

        if (API_KEY && CHANNEL_ID) {
            const ytResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
            const ytData = await ytResponse.json();
            
            if (ytData.items && ytData.items.length > 0) {
                const subsCount = parseInt(ytData.items[0].statistics.subscriberCount);
                youtubeSubs = formatNumber(subsCount) + " SUBSCRIBERS";
            }
        }
    } catch (error) {
        console.log("Error fetching YouTube stats:", error);
    }

    const realStats = {
        discord: "1,450 MEMBERS",
        youtube: youtubeSubs, // يتم جلبه أوتوماتيكياً من قناتك الحقيقية
        tiktok: "45.8K FOLLOWERS",
        instagram: "8.9K FOLLOWERS",
        kick: "2.1K FOLLOWERS"
    };

    return res.status(200).json(realStats);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}