export const config = {
  runtime: 'edge',
};

export default async function (request) {
  // Esta função só aceita o método POST
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, statusText: 'Method Not Allowed' });
  }
  
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
  const AIRTABLE_TABLE_AVALIACOES = 'Avaliacoes';
  
  // Pega os dados que o site enviou (o ID do post e a nova contagem)
  const { recordId, newLikeCount } = await request.json();
  
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_AVALIACOES}/${recordId}`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH', // PATCH é o método para ATUALIZAR um registro
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          'Curtidas': newLikeCount // Atualiza o campo 'Curtidas'
        }
      })
    });
    
    if (!response.ok) throw new Error('Falha ao salvar no Airtable');
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}