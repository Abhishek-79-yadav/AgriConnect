-- Seeds well-known, real central-government schemes farmers can directly
-- benefit from and apply to. state is left NULL for all of these since
-- they're central (all-India) schemes, not state-specific — Schemes.jsx's
-- state filter only narrows the list, it never hides schemes with no
-- state set, so these stay visible regardless of which state a farmer
-- picks.

INSERT INTO government_scheme (title, description, state, category, apply_link, active) VALUES
('PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
 'Direct income support of ₹6,000 per year, paid in three equal installments straight to the bank accounts of eligible landholding farmer families.',
 NULL, 'Income Support', 'https://pmkisan.gov.in', TRUE),

('Pradhan Mantri Fasal Bima Yojana (PMFBY)',
 'Crop insurance covering losses from natural calamities, pests, and diseases, at a low farmer premium — 2% for kharif, 1.5% for rabi crops.',
 NULL, 'Insurance', 'https://pmfby.gov.in', TRUE),

('Kisan Credit Card (KCC)',
 'Short-term, low-interest credit for crop production, post-harvest expenses, and farm maintenance, with a simplified application process.',
 NULL, 'Credit', 'https://www.myscheme.gov.in/schemes/kcc', TRUE),

('Soil Health Card Scheme',
 'Free soil testing every two years with crop-wise nutrient and fertilizer recommendations, to help improve yield and reduce input costs.',
 NULL, 'Soil Health', 'https://soilhealth.dac.gov.in', TRUE),

('e-NAM (National Agriculture Market)',
 'An online trading platform connecting existing mandis, letting farmers discover better prices and sell produce beyond their local market.',
 NULL, 'Market Access', 'https://enam.gov.in', TRUE),

('Pradhan Mantri Kisan Maandhan Yojana',
 'A voluntary pension scheme for small and marginal farmers — a guaranteed ₹3,000 monthly pension after age 60, with matching government contribution.',
 NULL, 'Pension', 'https://maandhan.in', TRUE),

('Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
 'Support for irrigation infrastructure and micro-irrigation (drip/sprinkler) to improve water-use efficiency and expand irrigated area.',
 NULL, 'Irrigation', 'https://pmksy.gov.in', TRUE),

('Agriculture Infrastructure Fund',
 'Medium-to-long-term debt financing at subsidized interest for post-harvest management infrastructure — cold storage, warehouses, and processing units.',
 NULL, 'Infrastructure', 'https://agriinfra.dac.gov.in', TRUE);
