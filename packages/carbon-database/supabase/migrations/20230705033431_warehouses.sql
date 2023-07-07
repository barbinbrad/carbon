


-- inbound warehouse request
-- is created automatically when a source document is released
-- is automatically deleted when the inventory put away gets everything handled
-- has a type
-- has a source document number


-- warehouse item journal


-- purchase receipt
-- return receipt
-- transfer receipt

-- part ledger entry pur
-- records the quantity change

-- value entry
-- records the value change
-- has a posting date
-- has an item ledger entry type (e.g. purchase, return, transfer, etc)
-- has an entry type (e.g. direct cost, indirect cost, etc)
-- has an adjustment checkbox
-- has a document type (e.g. purchase receipt, purchase invoice, sales invoice, etc)
-- has a document number
-- has an entry number (serial)
-- has a cost amount actual
-- has a cost amount expected
-- has an actual cost posted to gl
-- has an expected cost posted to gl

-- value entry - gl entry relation
-- has a value entry
-- has a gl entry

-- gl entry


-- warehouse entry
-- has an entry type (positive or negative)
-- has a part number
-- has a shelf
-- has a qty


-- inventory put away
-- has a warehouse
-- has a source document (assembly order, purchase order, purchase return order, inbound transfer, outbound transfer, sales order return, etc)
-- has a posting date


-- inventory put away lines
-- has a part number
-- has a description
-- has a shelf
-- has an order quantity
-- has a qty to handle
-- has a qty handled
-- has a calculated qty outstanding
-- has a uom and due date


