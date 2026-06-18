import fs from 'fs';

const apikey = 'sb_publishable_oXkSlAh8MRnqgMWR_o1Wug_JxoqmgyU';
const url = 'https://mryhdocmbxnxmokpsxzl.supabase.co/rest/v1/?apikey=' + apikey;

async function fetchSchema() {
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apikey}`
    }
  });
  const data = await res.json();
  
  if (data.definitions) {
    const tables = ['notifications', 'user_notifications', 'notification_batches', 'admin_action_logs'];
    const result = {};
    
    for (const table of tables) {
      if (data.definitions[table]) {
        result[table] = Object.keys(data.definitions[table].properties);
      } else {
        result[table] = 'Not found';
      }
    }
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(data);
  }
}

fetchSchema().catch(console.error);
