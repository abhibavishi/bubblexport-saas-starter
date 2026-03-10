"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export function FormsTab() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">Sample Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fname">First name</Label>
              <Input id="fname" placeholder="John" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lname">Last name</Label>
              <Input id="lname" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Select>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} placeholder="Tell us about yourself…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dob">Date</Label>
            <Input id="dob" type="date" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Save changes</Button>
            <Button type="button" variant="outline" className="flex-1">Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
