insert into regional_labor_profiles (
  id,
  profile_name,
  state_code,
  covered_region,
  dominant_industries,
  emerging_industries,
  common_transition_roles,
  limited_local_opportunities,
  nearby_growth_markets,
  remote_friendliness_score,
  industry_weights,
  advisor_notes
)
values
(
  'cir_grand_strand',
  'Grand Strand / Myrtle Beach',
  'SC',
  'Horry County, northern Georgetown County, Myrtle Beach, Conway, North Myrtle Beach, Little River, Surfside Beach, Murrells Inlet',
  '["Hospitality","Tourism","Healthcare","Property Management","Real Estate","Construction","Education","Banking","Insurance","Golf and Recreation","Local Government"]'::jsonb,
  '["Healthcare Administration","Property Management","Logistics","Remote Professional Services","Municipal Services","Senior Care","Skilled Trades"]'::jsonb,
  '[
    {"from":"Restaurant Management","to":["Resort Operations Manager","Healthcare Practice Manager","Property Manager","Bank Branch Manager"]},
    {"from":"Hotel Operations","to":["Property Manager","Hospitality Training Manager","Healthcare Operations Coordinator","Municipal Services Coordinator"]},
    {"from":"Retail Management","to":["Bank Branch Manager","Insurance Office Manager","Customer Success Specialist","Healthcare Front Office Manager"]},
    {"from":"Military Operations","to":["Logistics Supervisor","Facilities Manager","Emergency Management Coordinator","Operations Manager"]},
    {"from":"Administrative Support","to":["Healthcare Coordinator","Real Estate Office Manager","Municipal Administrative Coordinator","Insurance Account Coordinator"]}
  ]'::jsonb,
  '["Corporate Headquarters Roles","Large Enterprise Product Management","Aerospace Engineering","Investment Banking","Big Tech Onsite Roles"]'::jsonb,
  '["Charleston SC","Wilmington NC","Florence SC","Columbia SC","Remote"]'::jsonb,
  0.55,
  '{"hospitality":0.95,"tourism":0.94,"healthcare":0.88,"property_management":0.86,"real_estate":0.82,"construction":0.78,"education":0.68,"banking":0.61,"insurance":0.58,"logistics":0.52,"technology":0.35,"manufacturing":0.25,"aerospace":0.12}'::jsonb,
  'When relocation preference is No, prioritize realistic Grand Strand opportunities before recommending corporate or highly specialized metro roles. Strong local fits often include hospitality leadership, resort operations, property management, healthcare administration, banking branches, insurance offices, local government, construction operations, and education support roles. If relocation is Maybe, include Charleston, Wilmington, Florence, Columbia, and remote options as nearby growth markets.'
),
(
  'cir_charleston_metro',
  'Charleston Metro',
  'SC',
  'Charleston, North Charleston, Mount Pleasant, Summerville, Goose Creek, Berkeley County, Charleston County, Dorchester County',
  '["Healthcare","Tourism","Hospitality","Port Logistics","Aerospace","Manufacturing","Defense","Technology","Education","Real Estate","Construction"]'::jsonb,
  '["Aerospace Manufacturing","Cybersecurity","Port Logistics","Healthcare Administration","Defense Contracting","Software and IT Services","Advanced Manufacturing"]'::jsonb,
  '[
    {"from":"Hospitality Management","to":["Hotel Operations Manager","Healthcare Practice Manager","Port Logistics Coordinator","Customer Success Manager"]},
    {"from":"Military Operations","to":["Defense Program Coordinator","Logistics Manager","Operations Analyst","Facilities Manager"]},
    {"from":"Manufacturing","to":["Production Supervisor","Quality Coordinator","Supply Chain Analyst","Aerospace Operations Coordinator"]},
    {"from":"Retail Management","to":["Branch Manager","Client Services Manager","Healthcare Office Manager","Sales Operations Coordinator"]},
    {"from":"Administrative Support","to":["Healthcare Coordinator","Logistics Coordinator","Project Coordinator","Government Contractor Administrator"]}
  ]'::jsonb,
  '["Investment Banking","Large Corporate HQ Strategy","Entertainment Industry Roles","Oil and Gas Operations"]'::jsonb,
  '["Columbia SC","Savannah GA","Greenville SC","Charlotte NC","Remote"]'::jsonb,
  0.68,
  '{"healthcare":0.9,"tourism":0.82,"hospitality":0.8,"port_logistics":0.9,"aerospace":0.86,"manufacturing":0.82,"defense":0.78,"technology":0.66,"education":0.65,"real_estate":0.72,"construction":0.75,"banking":0.6}'::jsonb,
  'Charleston recommendations should balance hospitality and tourism with stronger metro opportunities in healthcare, port logistics, aerospace, defense, and advanced manufacturing. Military and operations backgrounds may translate especially well into logistics, defense contracting, facilities, and program coordination.'
),
(
  'cir_columbia_midlands',
  'Columbia / Midlands',
  'SC',
  'Columbia, Lexington, Irmo, West Columbia, Cayce, Richland County, Lexington County',
  '["State Government","Healthcare","Education","Insurance","Banking","Logistics","Utilities","Professional Services","Military"]'::jsonb,
  '["Healthcare Administration","Public Administration","Insurance Operations","Logistics","Data and Business Analytics","Education Administration","Cybersecurity"]'::jsonb,
  '[
    {"from":"Administrative Support","to":["Government Program Coordinator","Healthcare Coordinator","Insurance Operations Specialist","University Administrative Coordinator"]},
    {"from":"Military Operations","to":["Government Program Analyst","Logistics Supervisor","Emergency Management Coordinator","Training Coordinator"]},
    {"from":"Retail Management","to":["Bank Branch Manager","Insurance Office Manager","Customer Operations Supervisor","Healthcare Front Office Manager"]},
    {"from":"Healthcare Support","to":["Healthcare Operations Coordinator","Practice Manager","Patient Access Supervisor","Revenue Cycle Specialist"]},
    {"from":"Business Analysis","to":["Government Analyst","Healthcare Analyst","Insurance Operations Analyst","University Reporting Analyst"]}
  ]'::jsonb,
  '["Large Tech HQ Roles","Coastal Tourism Leadership","Aerospace Engineering","Entertainment Industry Roles"]'::jsonb,
  '["Charlotte NC","Greenville SC","Charleston SC","Augusta GA","Remote"]'::jsonb,
  0.64,
  '{"government":0.92,"healthcare":0.89,"education":0.82,"insurance":0.78,"banking":0.72,"logistics":0.68,"utilities":0.66,"professional_services":0.62,"military":0.7,"technology":0.52,"hospitality":0.45}'::jsonb,
  'Columbia/Midlands is strong for government, healthcare, education, insurance, banking, logistics, and administrative operations. For no-relocation users, prioritize public sector, healthcare administration, university operations, insurance operations, and business support roles.'
),
(
  'cir_greenville_spartanburg_upstate',
  'Greenville-Spartanburg / Upstate',
  'SC',
  'Greenville, Spartanburg, Anderson, Greer, Mauldin, Simpsonville, Upstate South Carolina',
  '["Advanced Manufacturing","Automotive","Healthcare","Logistics","Engineering","Education","Banking","Professional Services","Construction"]'::jsonb,
  '["Electric Vehicle Supply Chain","Advanced Manufacturing","Logistics","Healthcare Administration","Industrial Automation","Business Analytics","Engineering Support"]'::jsonb,
  '[
    {"from":"Manufacturing","to":["Production Supervisor","Quality Assurance Coordinator","Supply Chain Analyst","Operations Manager"]},
    {"from":"Military Operations","to":["Logistics Manager","Facilities Manager","Manufacturing Supervisor","Training Coordinator"]},
    {"from":"Retail Management","to":["Branch Manager","Customer Operations Manager","Healthcare Office Manager","Inside Sales Manager"]},
    {"from":"Hospitality Management","to":["Operations Manager","Training Manager","Customer Success Manager","Healthcare Practice Manager"]},
    {"from":"Administrative Support","to":["Supply Chain Coordinator","Healthcare Coordinator","Project Coordinator","HR Coordinator"]}
  ]'::jsonb,
  '["Coastal Tourism Leadership","Port Operations","Entertainment Industry Roles","Investment Banking"]'::jsonb,
  '["Charlotte NC","Columbia SC","Asheville NC","Atlanta GA","Remote"]'::jsonb,
  0.66,
  '{"advanced_manufacturing":0.94,"automotive":0.92,"healthcare":0.84,"logistics":0.86,"engineering":0.78,"education":0.65,"banking":0.62,"professional_services":0.68,"construction":0.74,"technology":0.58,"hospitality":0.48}'::jsonb,
  'The Upstate profile should emphasize manufacturing, automotive, logistics, healthcare, engineering support, and operations leadership. Career pivots from military, manufacturing, retail, and hospitality can often be framed around operations, process improvement, quality, training, and supply chain.'
);



insert into location_regions (
  city,
  state_code,
  state_name,
  county,
  metro_area,
  search_region,
  fallback_region,
  country,
  source,
  batch_name,
  regional_labor_profile_id
)
values
('Myrtle Beach','SC','South Carolina','Horry','Grand Strand','Myrtle Beach, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_grand_strand'),
('North Myrtle Beach','SC','South Carolina','Horry','Grand Strand','Myrtle Beach, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_grand_strand'),
('Conway','SC','South Carolina','Horry','Grand Strand','Myrtle Beach, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_grand_strand'),
('Little River','SC','South Carolina','Horry','Grand Strand','Myrtle Beach, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_grand_strand'),
('Surfside Beach','SC','South Carolina','Horry','Grand Strand','Myrtle Beach, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_grand_strand'),
('Murrells Inlet','SC','South Carolina','Georgetown','Grand Strand','Myrtle Beach, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_grand_strand'),

('Charleston','SC','South Carolina','Charleston','Charleston Metro','Charleston, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_charleston_metro'),
('North Charleston','SC','South Carolina','Charleston','Charleston Metro','Charleston, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_charleston_metro'),
('Mount Pleasant','SC','South Carolina','Charleston','Charleston Metro','Charleston, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_charleston_metro'),
('Summerville','SC','South Carolina','Dorchester','Charleston Metro','Charleston, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_charleston_metro'),

('Columbia','SC','South Carolina','Richland','Columbia Midlands','Columbia, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_columbia_midlands'),
('Lexington','SC','South Carolina','Lexington','Columbia Midlands','Columbia, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_columbia_midlands'),

('Greenville','SC','South Carolina','Greenville','Greenville-Spartanburg Upstate','Greenville, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_greenville_spartanburg_upstate'),
('Spartanburg','SC','South Carolina','Spartanburg','Greenville-Spartanburg Upstate','Greenville, SC','South Carolina','US','manual_seed','sc_cir_phase_1','cir_greenville_spartanburg_upstate');




update location_regions
set regional_labor_profile_id = 'cir_grand_strand'
where state_code = 'SC'
  and (
    county ilike '%Horry%'
    or city ilike any (array[
      'Myrtle Beach',
      'North Myrtle Beach',
      'Conway',
      'Little River',
      'Surfside Beach',
      'Aynor',
      'Loris',
      'Socastee',
      'Carolina Forest',
      'Murrells Inlet',
      'Garden City'
    ])
  );





  create table if not exists career_intelligence_region_neighbors (
  id uuid primary key default gen_random_uuid(),
  region_id text not null references career_intelligence_regions(id) on delete cascade,
  neighbor_region_id text not null references career_intelligence_regions(id) on delete cascade,
  relationship_type text not null default 'nearby_growth_market',
  relevance_weight numeric not null default 0.50,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(region_id, neighbor_region_id)
);


insert into career_intelligence_region_neighbors (
  region_id,
  neighbor_region_id,
  relationship_type,
  relevance_weight,
  notes
)
values
('cir_grand_strand','cir_charleston_metro','nearby_growth_market',0.90,'Strong nearby market for healthcare, logistics, port-related roles, hospitality leadership, aerospace support, and defense-adjacent opportunities.'),
('cir_grand_strand','cir_columbia_midlands','nearby_growth_market',0.72,'Useful nearby expansion market for government, healthcare administration, insurance, education, and public sector roles.'),
('cir_grand_strand','cir_greenville_spartanburg_upstate','relocation_growth_market',0.58,'Stronger fit for manufacturing, automotive, logistics, and operations roles if the user is open to relocation.'),

('cir_charleston_metro','cir_grand_strand','nearby_related_market',0.70,'Relevant for tourism, hospitality, property management, and coastal service economy roles.'),
('cir_charleston_metro','cir_columbia_midlands','nearby_growth_market',0.75,'Useful expansion market for government, healthcare, education, insurance, and administrative operations.'),
('cir_charleston_metro','cir_greenville_spartanburg_upstate','relocation_growth_market',0.66,'Relevant for advanced manufacturing, automotive, logistics, and operations leadership.'),

('cir_columbia_midlands','cir_charleston_metro','nearby_growth_market',0.78,'Strong nearby market for port logistics, healthcare, aerospace support, defense-adjacent roles, and hospitality leadership.'),
('cir_columbia_midlands','cir_greenville_spartanburg_upstate','nearby_growth_market',0.74,'Strong nearby market for manufacturing, automotive, logistics, operations, and business services.'),
('cir_columbia_midlands','cir_grand_strand','nearby_related_market',0.60,'Relevant for tourism, hospitality, property management, and coastal service economy roles.'),

('cir_greenville_spartanburg_upstate','cir_columbia_midlands','nearby_growth_market',0.70,'Useful market for government, healthcare, education, insurance, and administrative operations.'),
('cir_greenville_spartanburg_upstate','cir_charleston_metro','relocation_growth_market',0.68,'Relevant for port logistics, aerospace, defense-adjacent roles, healthcare, and coastal hospitality leadership.'),
('cir_greenville_spartanburg_upstate','cir_grand_strand','relocation_related_market',0.45,'Relevant mainly for hospitality, tourism, property management, and coastal lifestyle-driven relocation.');




create or replace function get_career_intelligence_region_for_city(
  p_city text,
  p_state_code text
)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'location', jsonb_build_object(
      'city', lr.city,
      'state_code', lr.state_code,
      'state_name', lr.state_name,
      'county', lr.county,
      'metro_area', lr.metro_area,
      'search_region', lr.search_region,
      'fallback_region', lr.fallback_region
    ),
    'career_intelligence_region', to_jsonb(cir),
    'neighbor_regions', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'region_id', n.neighbor_region_id,
          'profile_name', neighbor.profile_name,
          'relationship_type', n.relationship_type,
          'relevance_weight', n.relevance_weight,
          'notes', n.notes,
          'dominant_industries', neighbor.dominant_industries,
          'emerging_industries', neighbor.emerging_industries,
          'industry_weights', neighbor.industry_weights
        )
        order by n.relevance_weight desc
      ) filter (where n.neighbor_region_id is not null),
      '[]'::jsonb
    )
  )
  from location_regions lr
  join career_intelligence_regions cir
    on cir.id = lr.career_intelligence_region_id
  left join career_intelligence_region_neighbors n
    on n.region_id = cir.id
  left join career_intelligence_regions neighbor
    on neighbor.id = n.neighbor_region_id
  where lower(lr.city) = lower(p_city)
    and upper(lr.state_code) = upper(p_state_code)
  group by lr.id, cir.id
  limit 1;
$$;



insert into career_intelligence_regions (
  id,
  profile_name,
  state_code,
  covered_region,
  dominant_industries,
  emerging_industries,
  common_transition_roles,
  limited_local_opportunities,
  nearby_growth_markets,
  remote_friendliness_score,
  industry_weights,
  advisor_notes
)
values

(
'cir_rock_hill_charlotte_spillover',
'Rock Hill / Charlotte Spillover',
'SC',
'York County and surrounding communities with strong access to the Charlotte labor market.',
'["Banking","Financial Services","Technology","Healthcare","Professional Services","Manufacturing","Logistics"]'::jsonb,
'["FinTech","Cybersecurity","Data Analytics","Cloud Technology","Healthcare Administration"]'::jsonb,
'[
{"from":"Retail Management","to":["Financial Services Supervisor","Operations Manager","Customer Success Manager"]},
{"from":"Manufacturing","to":["Supply Chain Analyst","Operations Manager","Quality Manager"]},
{"from":"Military Operations","to":["Program Manager","Operations Analyst","Logistics Manager"]},
{"from":"Administrative Support","to":["Project Coordinator","Business Analyst","HR Coordinator"]}
]'::jsonb,
'["Marine Industries","Tourism Leadership","Large Resort Operations"]'::jsonb,
'["Charlotte NC","Greenville SC","Columbia SC"]'::jsonb,
0.83,
'{
"banking":0.95,
"technology":0.91,
"financial_services":0.94,
"healthcare":0.82,
"logistics":0.77,
"manufacturing":0.71,
"hospitality":0.35
}'::jsonb,
'Prioritize financial services, technology, logistics and healthcare. Strong opportunities exist across the Charlotte metro for users open to commuting or relocation.'
),

(
'cir_hilton_head_beaufort',
'Hilton Head / Beaufort Lowcountry',
'SC',
'Beaufort County, Hilton Head Island, Bluffton and surrounding Lowcountry.',
'["Tourism","Hospitality","Healthcare","Military","Real Estate","Construction","Marine Services"]'::jsonb,
'["Healthcare","Marine Services","Remote Professional Services","Property Management"]'::jsonb,
'[
{"from":"Hospitality","to":["Property Manager","Healthcare Practice Manager","Community Association Manager"]},
{"from":"Military","to":["Operations Manager","Facilities Manager","Emergency Management Coordinator"]},
{"from":"Retail","to":["Branch Manager","Insurance Office Manager"]}
]'::jsonb,
'["Large Corporate Headquarters","Advanced Manufacturing","Investment Banking"]'::jsonb,
'["Savannah GA","Charleston SC"]'::jsonb,
0.63,
'{
"hospitality":0.95,
"tourism":0.94,
"healthcare":0.84,
"military":0.79,
"real_estate":0.82,
"construction":0.73,
"marine_services":0.81
}'::jsonb,
'Balance tourism recommendations with healthcare, military support, marine services and property management.'
),

(
'cir_florence_pee_dee',
'Florence / Pee Dee',
'SC',
'Florence, Darlington, Marion, Dillon and surrounding Pee Dee counties.',
'["Healthcare","Manufacturing","Logistics","Education","Government","Retail"]'::jsonb,
'["Healthcare Administration","Distribution","Industrial Operations"]'::jsonb,
'[
{"from":"Retail","to":["Healthcare Coordinator","Distribution Supervisor"]},
{"from":"Manufacturing","to":["Operations Manager","Production Supervisor"]},
{"from":"Administrative","to":["Government Coordinator","Healthcare Office Manager"]}
]'::jsonb,
'["Large Tech","Investment Banking","Entertainment"]'::jsonb,
'["Columbia SC","Grand Strand","Charlotte NC"]'::jsonb,
0.54,
'{
"healthcare":0.91,
"manufacturing":0.86,
"logistics":0.82,
"government":0.71,
"education":0.66,
"retail":0.61
}'::jsonb,
'Strong region for healthcare, manufacturing and logistics. Recommend nearby metro opportunities when relocation is acceptable.'
),

(
'cir_aiken_augusta_spillover',
'Aiken / Augusta Spillover',
'SC',
'Aiken County with strong employment connections into Augusta, Georgia.',
'["Healthcare","Government","Nuclear Energy","Manufacturing","Construction","Professional Services"]'::jsonb,
'["Energy","Cybersecurity","Healthcare Administration"]'::jsonb,
'[
{"from":"Military","to":["Project Manager","Facilities Manager","Operations Manager"]},
{"from":"Manufacturing","to":["Quality Manager","Supply Chain Manager"]},
{"from":"Administrative","to":["Healthcare Coordinator","Government Analyst"]}
]'::jsonb,
'["Tourism Leadership","Marine Industries"]'::jsonb,
'["Columbia SC","Augusta GA","Charlotte NC"]'::jsonb,
0.67,
'{
"healthcare":0.88,
"government":0.81,
"energy":0.91,
"manufacturing":0.79,
"construction":0.72,
"professional_services":0.64
}'::jsonb,
'Emphasize healthcare, government, nuclear energy, manufacturing and operations careers while recognizing the Augusta metro as part of the practical labor market.'
)

on conflict (id) do nothing;