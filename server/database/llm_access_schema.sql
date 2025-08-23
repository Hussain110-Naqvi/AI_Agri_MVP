-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Create the schema first
CREATE SCHEMA IF NOT EXISTS llm_access;

-- Set search path
SET search_path TO llm_access, public;

CREATE TABLE llm_access.baltic_dry_index (
  date date,
  avg_price numeric,
  highest_price numeric,
  lowest_price numeric
);

CREATE TABLE llm_access.boc_agri_commodity_index (
  date date,
  agriculture_commodity_index double precision
);

CREATE TABLE llm_access.corn_futures (
  date date,
  avg_price double precision,
  highest_price double precision,
  lowest_price double precision
);

CREATE TABLE llm_access.planting_intentions (
  date date,
  grain_type text,
  unit text,
  location_vector text,
  amount bigint
);

CREATE TABLE llm_access.soybeans_futures (
  date date,
  avg_price double precision,
  highest_price double precision,
  lowest_price double precision,
  volume text
);

CREATE TABLE llm_access.usda_corn (
  Program text,
  Year bigint,
  Period text,
  "Week Ending" text,
  "Geo Level" text,
  State text,
  "State ANSI" text,
  "Ag District" text,
  "Ag District Code" text,
  County text,
  "County ANSI" text,
  "Zip Code" text,
  Region text,
  watershed_code text,
  Watershed text,
  Commodity text,
  "Data Item" text,
  Domain text,
  "Domain Category" text,
  Value text,
  "CV _%_" text
);

CREATE TABLE llm_access.usda_fertilizer (
  Program text,
  Year bigint,
  Period text,
  "Week Ending" text,
  "Geo Level" text,
  State text,
  "State ANSI" bigint,
  "Ag District" text,
  "Ag District Code" text,
  County text,
  "County ANSI" text,
  "Zip Code" text,
  Region text,
  watershed_code text,
  Watershed text,
  Commodity text,
  "Data Item" text,
  Domain text,
  "Domain Category" text,
  Value text,
  "CV _%_" text
);

CREATE TABLE llm_access.usda_phosphate_potash (
  Program text,
  Year bigint,
  Period text,
  "Week Ending" text,
  "Geo Level" text,
  State text,
  "State ANSI" text,
  "Ag District" text,
  "Ag District Code" text,
  County text,
  "County ANSI" text,
  "Zip Code" text,
  Region text,
  watershed_code text,
  Watershed text,
  Commodity text,
  "Data Item" text,
  Domain text,
  "Domain Category" text,
  Value double precision,
  "CV _%_" text
);

CREATE TABLE llm_access.usda_weather (
  ingested_at_utc timestamp with time zone,
  precipitation_sum_mm text,
  min_temp_celsius double precision,
  max_temp_celsius double precision,
  station_name text,
  longitude double precision,
  weather_code bigint,
  latitude double precision,
  mean_temp_celsius double precision,
  date text
);

-- Grant permissions
GRANT USAGE ON SCHEMA llm_access TO hussainalinaqvi;
GRANT ALL ON ALL TABLES IN SCHEMA llm_access TO hussainalinaqvi;
GRANT ALL ON ALL SEQUENCES IN SCHEMA llm_access TO hussainalinaqvi;