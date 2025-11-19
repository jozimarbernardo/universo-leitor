const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Indicacoes'; // Sem acento!

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { recordId, newLikeCount } = req.body;
    
    if (!recordId || newLikeCount === undefined) {
        return res.status(400).json({ error: 'recordId e newLikeCount são obrigatórios' });
    }

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        console.error('Variáveis de ambiente não configuradas');
        return res.status(500).json({ error: 'Configuração do servidor incompleta' });
    }

    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}/${recordId}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: {
                    'Curtidas': newLikeCount
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro do Airtable:', errorData);
            return res.status(response.status).json({ 
                error: 'Erro ao atualizar curtidas no Airtable',
                details: errorData 
            });
        }

        const data = await response.json();
        return res.status(200).json({ 
            success: true, 
            record: data 
        });

    } catch (error) {
        console.error('Erro ao processar curtida:', error);
        return res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message 
        });
    }
};
