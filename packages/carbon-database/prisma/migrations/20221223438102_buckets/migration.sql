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
    and (auth.role() = 'authenticated')
    and storage.filename(name) like concat(auth.uid()::text, '%')
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars'
    and (auth.role() = 'authenticated')
    and storage.filename(name) like concat(auth.uid()::text, '%')
);

CREATE POLICY "Users can insert their own avatars"
ON storage.objects FOR INSERT with check (
    bucket_id = 'avatars'
    and (auth.role() = 'authenticated')
    and storage.filename(name) like concat(auth.uid()::text, '%')
);

