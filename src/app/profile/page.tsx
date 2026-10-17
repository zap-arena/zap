"use client"
import { AuthGuard } from "@/components/AuthGuard"
import ProfilePage from "@/views/ProfilePage"
export default function Page() {
  return <AuthGuard><ProfilePage /></AuthGuard>
}
