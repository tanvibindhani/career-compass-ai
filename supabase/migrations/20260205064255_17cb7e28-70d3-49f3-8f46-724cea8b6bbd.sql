-- Create certificates storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Allow users to view all certificate images (public)
CREATE POLICY "Certificate images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Allow users to upload their own certificates
CREATE POLICY "Users can upload their own certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own certificates
CREATE POLICY "Users can delete their own certificates"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);