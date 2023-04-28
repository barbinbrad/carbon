INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('public', 'public', true), 
  ('avatars', 'avatars', true),
  ('private', 'private', false);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT USING (
    bucket_id = 'avatars'
);

CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars'
    AND (auth.role() = 'authenticated')
    AND storage.filename(name) LIKE concat(auth.uid()::text, '%')
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (auth.role() = 'authenticated')
    AND storage.filename(name) LIKE concat(auth.uid()::text, '%')
);

CREATE POLICY "Users can insert their own avatars"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (auth.role() = 'authenticated')
    AND storage.filename(name) LIKE concat(auth.uid()::text, '%')
);

CREATE POLICY "Users with documents_view can view documents in their private bucket"
ON storage.objects FOR SELECT USING (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_view')::boolean, false) = true
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users with documents_create can upload to their own private buckets"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_create')::boolean, false) = true
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users with documents_update can update their own private buckets"
ON storage.objects FOR UPDATE USING (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_update')::boolean, false) = true
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users with documents_delete can delete from their own private buckets"
ON storage.objects FOR DELETE USING (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_delete')::boolean, false) = true
    AND (storage.foldername(name))[1] = auth.uid()::text
);

