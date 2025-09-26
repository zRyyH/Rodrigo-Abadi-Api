module.exports = {
    metrics: {
        sql: `
        SELECT 
            COALESCE(
                (SUM(recent_sales.total_amount - (p.purchase_cost * recent_sales.units)) / NULLIF(SUM(recent_sales.total_amount), 0)) * 100, 
                0
            ) as profit_percentage,
            
            COUNT(DISTINCT CASE WHEN recent_sales.sale_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN recent_sales.id END) as sales_last_year
            
        FROM products p
        LEFT JOIN (
            SELECT *
            FROM sales
            WHERE sku = (SELECT sku FROM products WHERE id = ?)
            ORDER BY sale_date DESC
            LIMIT 100
        ) as recent_sales ON p.sku = recent_sales.sku
        
        WHERE p.id = ?
        GROUP BY p.id
        `,
        params: ['id', 'id']
    }
};