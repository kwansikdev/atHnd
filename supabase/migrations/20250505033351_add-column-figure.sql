ALTER TABLE figure
ADD COLUMN status TEXT CHECK (status IN ('upcoming', 'released', 'delayed')) DEFAULT 'upcoming';
