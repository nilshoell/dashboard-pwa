BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "kpis" (
	"id"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"shortname"	TEXT,
	"aggregate"	TEXT,
	"parent"	TEXT NOT NULL,
	"unit"	TEXT,
	"direction"	TEXT DEFAULT '+',
	"help"	TEXT,
	"formula"	TEXT DEFAULT 'Direct Measurement',
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "partners" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"shortname"	TEXT NOT NULL,
	"region"	TEXT NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "products" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"shortname"	TEXT NOT NULL,
	"parent"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "measures" (
	"id"	INTEGER NOT NULL,
	"timestamp"	TEXT NOT NULL,
	"kpi"	TEXT NOT NULL,
	"value"	REAL NOT NULL,
	"partner"	INTEGER,
	"product"	INTEGER,
	"scenario"	TEXT DEFAULT 'AC',
	PRIMARY KEY("id"),
	FOREIGN KEY("kpi") REFERENCES "kpis"("id"),
	FOREIGN KEY("product") REFERENCES "products"("id"),
	FOREIGN KEY("partner") REFERENCES "partners"("id")
);
COMMIT;