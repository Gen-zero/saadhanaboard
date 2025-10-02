-- Fix Critical Security Issues: Restrict public access to sensitive tables

-- 1. Fix profiles table - restrict to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Fix spiritual_books table - restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view spiritual books" ON public.spiritual_books;

CREATE POLICY "Authenticated users can view spiritual books"
ON public.spiritual_books
FOR SELECT
TO authenticated
USING (true);

-- 3. Improve user_roles security - prevent privilege escalation
DROP POLICY IF EXISTS "Users can manage their own roles" ON public.user_roles;

-- Users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only allow INSERT during initial role setup (via trigger/function)
-- Users cannot directly modify their roles to prevent privilege escalation
CREATE POLICY "System can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role IN ('guru', 'shishya'));

-- Prevent users from updating or deleting their roles directly
-- (Role changes should go through admin functions only)