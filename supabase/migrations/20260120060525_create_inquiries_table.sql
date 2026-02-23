/*
  # Create inquiries table for MediVoyage lead capture

  1. New Tables
    - `inquiries`
      - `id` (uuid, primary key) - Unique identifier for each inquiry
      - `name` (text) - Patient/inquirer full name
      - `email` (text) - Contact email address
      - `phone` (text) - Contact phone number
      - `need` (text) - Medical need or procedure interest
      - `created_at` (timestamptz) - Timestamp of inquiry submission
      - `status` (text) - Lead status (new, contacted, qualified, converted)
  
  2. Security
    - Enable RLS on `inquiries` table
    - Add policy for service role to insert inquiries (public form submissions)
    - Add policy for authenticated users to view all inquiries (admin access)
  
  3. Notes
    - Table captures all lead information from the landing page form
    - Status field allows for lead management and follow-up tracking
    - Public insert policy enables form submissions without authentication
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  need text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
  ON inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (true);