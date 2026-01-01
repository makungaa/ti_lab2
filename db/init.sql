PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
                          Id INTEGER PRIMARY KEY AUTOINCREMENT,
                          Name TEXT NOT NULL,
                          Price REAL NOT NULL CHECK (Price >= 0)
);

CREATE TABLE Orders (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        CreatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE OrderItems (
                            Id INTEGER PRIMARY KEY AUTOINCREMENT,
                            OrderId INTEGER NOT NULL,
                            ProductId INTEGER NOT NULL,
                            Qty INTEGER NOT NULL CHECK (Qty > 0),
                            Price REAL NOT NULL,
                            FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
                            FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

CREATE INDEX IX_OrderItems_Order ON OrderItems(OrderId);

-- Seed products
INSERT INTO Products(Name, Price) VALUES
                                      ('Klawiatura', 129.99),
                                      ('Mysz', 79.90),
                                      ('Monitor', 899.00);
