module.exports = {
    detailsWithProducts: {
        sql: `
        SELECT 
            s.sale_id as numero_da_venda,
            DATE_FORMAT(s.sale_date, '%Y-%m-%d %H:%i:%s') as data,
            s.buyer_name as apelido_comprador,
            s.delivery_method as dados_de_envio_metodo,
            s.delivery_tracking_number as dados_de_envio_rastreio,
            n.invoice_number as numero_da_nota_fiscal,
            
            s.sku,
            s.listing_title as nome_do_produto,
            p.name as nome_produto_cadastro,
            pf.directus_files_id as imagem_id,
            s.unit_price as valor,
            s.units as quantidade,
            
            (s.units * COALESCE(p.purchase_cost, 0)) as preco_total_dos_produtos,
            s.sales_fee_and_taxes as tarifas_de_venda,
            s.shipping_fees as custo_envio,
            s.sales_fee_and_taxes as impostos,
            s.total_amount as total,
            (s.total_amount - (s.units * COALESCE(p.purchase_cost, 0))) as lucro
            
        FROM sales s
        LEFT JOIN products p ON s.sku = p.sku
        LEFT JOIN products_files pf ON p.id = pf.products_id
        LEFT JOIN nfes n ON s.sale_id = n.invoice_number OR s.buyer_name = n.customer_name
        WHERE s.id = ?
        LIMIT 1
        `,
        params: ['id']
    }
};