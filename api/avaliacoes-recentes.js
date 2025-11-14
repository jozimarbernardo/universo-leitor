export const config = {
  runtime: 'edge',
};

export default async function (request) {
  // Pega as chaves seguras que estarão na Vercel
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
  const AIRTABLE_TABLE_AVALIACOES = 'Avaliacoes';
  const PAGE_SIZE_RECENT = 6;
  
  // Usando maxRecords em vez de pageSize para compatibilidade
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_AVALIACOES}?maxRecords=${PAGE_SIZE_RECENT}&sort%5B0%5D%5Bfield%5D=Data&sort%5B0%5D%5Bdirection%5D=desc`;
  
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Retorna os dados no formato esperado
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      }
    });
  } catch (error) {
    console.error('Erro na API avaliacoes-recentes:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        records: [] 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}