INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('purchasing-internal', 'purchasing-internal', false),
  ('purchasing-external', 'purchasing-external', false);

-- Internal purchasing documents

CREATE POLICY "Internal purchasing documents view requires purchasing_view" ON storage.objects 
FOR SELECT USING (
    bucket_id = 'purchasing-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_view')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Internal purchasing documents insert requires purchasing_create" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'purchasing-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_create')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Internal purchasing documents update requires purchasing_update" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'purchasing-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_update')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Internal purchasing documents delete requires purchasing_delete" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'purchasing-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_delete')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

-- External purchasing documents

CREATE POLICY "External purchasing documents view requires purchasing_view" ON storage.objects 
FOR SELECT USING (
    bucket_id = 'purchasing-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_view')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"supplier"'::jsonb
      )
    )
);

CREATE POLICY "External purchasing documents insert requires purchasing_view" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'purchasing-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_view')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"supplier"'::jsonb
      )
    )
);

CREATE POLICY "External purchasing documents update requires purchasing_update" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'purchasing-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_update')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"supplier"'::jsonb
      )
    )
);

CREATE POLICY "External purchasing documents delete requires purchasing_delete" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'purchasing-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('purchasing_delete')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"supplier"'::jsonb
      )
    )
);