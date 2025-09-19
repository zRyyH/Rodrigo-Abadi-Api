const NFES_COLUMN_MAP = {
    A: 'status',
    B: 'sale_or_dispatch',
    C: 'invoice_number',
    D: 'series',
    E: 'customer_name',
    F: 'nfe_key',
    G: 'modality',
    H: 'operation',
    I: 'logistic_type',
    J: 'issue_date',
    K: 'amount',
    L: 'total_amount',
    M: 'freight',
    N: 'notes',
    O: 'reference_invoice_date',
    P: 'reference_danfe_key'
};

const NFES_TRANSFORMS = {
    issue_date: 'date',
    amount: 'currency',
    total_amount: 'currency',
    freight: 'currency',
    reference_invoice_date: 'date'
};

const NFES_CONFIG = {
    collection: 'nfes',
    uniqueField: 'nfe_key',
    sheetName: 'Invoices',
    startRow: 2
};

module.exports = {
    NFES_COLUMN_MAP,
    NFES_TRANSFORMS,
    NFES_CONFIG
};