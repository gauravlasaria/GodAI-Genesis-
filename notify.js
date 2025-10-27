const axios = require('axios');
const BOT_TOKEN = '8431086051:AAEHyU8oAHdfmm39edjJBdq0JqnYAjJ4odc';
const CHAT_ID = '7601991589';
async function notify(msg) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: msg
  }).catch(e => console.error('Notification failed', e));
}
notify('✅ GodAI Genesis Dashboard Started on Termux! 🌿');
