export const config = {
  runtime: 'edge',
};

export default async function (request) {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
  const AIRTABLE_TABLE_AVALIACOES = 'Avaliacoes';
  
  try {
    let allRecords = [];
    let offset = null;
    
    // Loop para buscar TODOS os registros (Airtable pagina a cada 100)
    do {
      let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_AVALIACOES}`;
      
      if (offset) {
        url += `?offset=${offset}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset; // Se houver mais páginas, offset será definido
      
    } while (offset); // Continua até não haver mais páginas
    
    return new Response(JSON.stringify({ records: allRecords }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate' // Cache de 5 minutos
      }
    });
  } catch (error) {
    console.error('Erro na API avaliacoes-todas:', error);
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
