#!/bin/bash
pg_dump -d postgresql://postgres:postgres@localhost:54322/postgres --no-comments --data-only --column-inserts  -n public > packages/database/supabase/seed.sql