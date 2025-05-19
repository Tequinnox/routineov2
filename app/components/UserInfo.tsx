'use client'

import { useUser } from '@/lib/hooks/useUser'

export function UserInfo() {
  const { user, loading, error, isAuthenticated } = useUser()

  if (loading) {
    return <div className="p-4">Loading user info...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }

  if (!isAuthenticated) {
    return <div className="p-4">Not logged in</div>
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">User Information</h2>
      <div className="space-y-2">
        <p><span className="font-medium">Email:</span> {user?.email}</p>
        <p><span className="font-medium">User ID:</span> {user?.id}</p>
        <p><span className="font-medium">Email Verified:</span> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
        <p><span className="font-medium">Last Sign In:</span> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  )
} 