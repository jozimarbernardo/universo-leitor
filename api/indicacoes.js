export default async function (request) {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
  const AIRTABLE_TABLE_INDICACOES = 'Indicacoes';
  
  // Adiciona ordenação por Data para pegar as mais recentes
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_INDICACOES}?sort%5B0%5D%5Bfield%5D=Data&sort%5B0%5D%5Bdirection%5D=desc`;
  
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data.records), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

}
