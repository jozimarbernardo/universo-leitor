export default async function (request) {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
  const AIRTABLE_TABLE_AVALIACOES = 'Avaliacoes';
  const PAGE_SIZE_MORE = 9;
  
  // Pega o "offset" (marcador) da URL
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get('offset');
  
  let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_AVALIACOES}?pageSize=${PAGE_SIZE_MORE}&sort%5B0%5D%5Bfield%5D=Data&sort%5B0%5D%5Bdirection%5D=desc`;
  if (offset) {
    url += `&offset=${offset}`;
  }
  
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

}
