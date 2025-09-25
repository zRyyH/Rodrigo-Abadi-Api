module.exports = {
    productDetails: {
        sql: `
        SELECT 
            p.id,
            p.name,
            p.sku,
            p.ncm,
            p.cest,
            p.quantity as stock_quantity,
            p.purchase_cost,
            p.date_created,
            p.date_updated,
            
            -- Informações do Fornecedor
            s.supplier_name,
            
            -- Informações da Embalagem
            pk.type_of_packaging,
            
            -- Dados Gerais de Vendas
            COUNT(DISTINCT sl.id) as total_sales,
            COALESCE(SUM(sl.units), 0) as units_sold,
            COALESCE(SUM(sl.total_amount), 0) as total_revenue,
            COALESCE(AVG(sl.unit_price), 0) as avg_sale_price,
            COALESCE(SUM(sl.total_amount - (p.purchase_cost * sl.units)), 0) as total_profit,
            MAX(sl.sale_date) as last_sale_date,
            
            -- Vendas da Última Semana
            COUNT(DISTINCT CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN sl.id END) as sales_last_week,
            COALESCE(SUM(CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN sl.units END), 0) as units_last_week,
            COALESCE(SUM(CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN sl.total_amount END), 0) as revenue_last_week,
            
            -- Vendas do Último Mês
            COUNT(DISTINCT CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN sl.id END) as sales_last_month,
            COALESCE(SUM(CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN sl.units END), 0) as units_last_month,
            COALESCE(SUM(CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN sl.total_amount END), 0) as revenue_last_month,
            
            -- Vendas do Último Ano
            COUNT(DISTINCT CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN sl.id END) as sales_last_year,
            COALESCE(SUM(CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN sl.units END), 0) as units_last_year,
            COALESCE(SUM(CASE WHEN sl.sale_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN sl.total_amount END), 0) as revenue_last_year,
            
            -- Imagens do Produto
            GROUP_CONCAT(DISTINCT df.id) as image_ids,
            GROUP_CONCAT(DISTINCT df.filename_download) as image_filenames,
            
            -- Dados de NFe
            COUNT(DISTINCT inv.id) as invoices_count,
            COALESCE(SUM(inv.quantity), 0) as total_invoiced_quantity
            
        FROM products p
        LEFT JOIN supplier s ON p.supplier_id = s.id
        LEFT JOIN packages pk ON p.package_id = pk.id
        LEFT JOIN sales sl ON p.sku = sl.sku
        LEFT JOIN products_files pf ON p.id = pf.products_id
        LEFT JOIN directus_files df ON pf.directus_files_id = df.id
        LEFT JOIN invoice inv ON p.ncm = inv.ncm
        
        WHERE p.id = ?
        GROUP BY p.id
    `,
        params: ['productId']
    },
    saleDetailsWithProducts: {
        sql: `
            SELECT 
                -- Dados da venda
                s.sale_id as numero_da_venda,
                DATE_FORMAT(s.sale_date, '%Y-%m-%d %H:%i:%s') as data,
                s.buyer_name as apelido_comprador,
                s.delivery_method as dados_de_envio_metodo,
                s.delivery_tracking_number as dados_de_envio_rastreio,
                n.invoice_number as numero_da_nota_fiscal,
                
                -- Dados do produto
                s.sku,
                s.listing_title as nome_do_produto,
                p.name as nome_produto_cadastro,
                pf.directus_files_id as imagem_id,
                s.unit_price as valor,
                s.units as quantidade,
                
                -- Cálculos financeiros
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