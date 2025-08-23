-- Complete Database Setup Script
-- This script sets up all schemas including the new llm_access schema

-- Run the main schema first
\i schema.sql

-- Run the LLM access schema
\i llm_access_schema.sql

-- Additional setup commands can go here
-- For example, initial data seeding, additional indexes, etc.

-- Verify all schemas are created
SELECT schema_name, schema_owner 
FROM information_schema.schemata 
WHERE schema_name IN ('public', 'llm_access')
ORDER BY schema_name;

-- Show all tables across schemas
SELECT 
    schemaname as schema_name,
    tablename as table_name,
    tableowner as owner
FROM pg_tables 
WHERE schemaname IN ('public', 'llm_access')
ORDER BY schemaname, tablename;
