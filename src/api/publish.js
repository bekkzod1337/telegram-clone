// /api/publish.js
import Ably from 'ably';

const ably = new Ably.Rest(process.env.ABLY_SERVER_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { channel, message } = req.body;

  try {
    await ably.channels.get(channel).publish('message', message);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
