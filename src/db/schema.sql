CREATE TABLE IF NOT EXISTS temples (
  number INTEGER PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_jp TEXT NOT NULL,
  location TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  km_from_previous REAL,
  deity TEXT,
  address TEXT,
  image_url TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS temple_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  temple_number INTEGER NOT NULL,
  visited_at TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (temple_number) REFERENCES temples(number)
);

CREATE TABLE IF NOT EXISTS packing_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  packed INTEGER DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS training_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  activity TEXT NOT NULL,
  distance_km REAL,
  duration_mins INTEGER,
  notes TEXT
);