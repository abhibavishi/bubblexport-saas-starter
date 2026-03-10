"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  const supabase = createClient()
  const { toast } = useToast()

  const [user, setUser] = useState<{ email?: string; id: string } | null>(null)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setUser({ email: user.email, id: user.id })

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name ?? "")
        setAvatarUrl(profile.avatar_url ?? "")
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setProfileLoading(true)

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null, avatar_url: avatarUrl.trim() || null })
      .eq("id", user.id)

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } else {
      toast({ title: "Profile updated", description: "Your profile has been saved." })
    }
    setProfileLoading(false)
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords don't match" })
      return
    }
    if (newPassword.length < 8) {
      toast({ variant: "destructive", title: "Password too short", description: "At least 8 characters required." })
      return
    }
    setPasswordLoading(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } else {
      toast({ title: "Password updated", description: "Your password has been changed." })
      setNewPassword("")
      setConfirmPassword("")
    }
    setPasswordLoading(false)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Settings" userEmail={user?.email} />

      <div className="flex-1 space-y-6 p-6 max-w-2xl">
        {/* Profile section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your name and avatar URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} disabled className="cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>
              <Button type="submit" disabled={profileLoading}>
                {profileLoading ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        {/* Password section */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? "Updating…" : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
