/**
 * Customer Portal Page Component
 * ===============================
 * 
 * This page serves as a redirect to the Polar customer portal for
 * subscription and billing management. It validates the user session
 * server-side before triggering the client-side portal redirect.
 * 
 * @module app/(dashboard)/dashboard/customer-portal/page
 * 
 * Flow:
 * 1. Server validates user session via Better Auth
 * 2. If unauthenticated, redirects to sign-in
 * 3. If authenticated, renders CustomerPortalRedirect component
 * 4. Client component calls authClient.customer.portal()
 * 5. User is redirected to Polar's hosted customer portal
 * 
 * The customer portal allows users to:
 * - View subscription details
 * - Manage payment methods
 * - View invoice history
 * - Cancel or modify subscriptions
 * 
 * @see {@link CustomerPortalRedirect} - Client component handling redirect
 * @see {@link https://polar.sh/docs/portal} - Polar customer portal docs
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CustomerPortalRedirect from '~/components/sidebar/CustomerPortalRedirect';
import { auth } from '~/lib/auth';

/**
 * CustomerPortalPage - Server component for portal access.
 * 
 * Validates authentication before allowing access to the customer
 * portal redirect. Unauthenticated users are sent to sign-in.
 * 
 * @returns {Promise<JSX.Element>} The portal redirect component
 */
export default async function Page() {
  // Validate user session server-side
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // Redirect unauthenticated users to sign-in
  if (!session) {
    redirect("/auth/sign-in");
  }
  
  // Render client component that handles the actual redirect
  return <CustomerPortalRedirect />;
}