CREATE TABLE bills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  full_text TEXT,
  status TEXT,
  ministry TEXT,
  introduced_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE impact_analyses (
  id SERIAL PRIMARY KEY,
  bill_id TEXT REFERENCES bills(id),
  pincode TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  pincode TEXT NOT NULL,
  topics JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_impact_pincode ON impact_analyses(pincode);
