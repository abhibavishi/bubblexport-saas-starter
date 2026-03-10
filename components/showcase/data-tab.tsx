"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"

interface Person {
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  status: "active" | "inactive"
  joined: string
}

const sampleData: Person[] = [
  { name: "Alice Johnson",  email: "alice@example.com",  role: "admin",  status: "active",   joined: "2024-01-15" },
  { name: "Bob Smith",      email: "bob@example.com",    role: "member", status: "active",   joined: "2024-02-20" },
  { name: "Carol Williams", email: "carol@example.com",  role: "viewer", status: "inactive", joined: "2024-03-10" },
  { name: "David Brown",    email: "david@example.com",  role: "member", status: "active",   joined: "2024-04-05" },
  { name: "Eva Davis",      email: "eva@example.com",    role: "admin",  status: "active",   joined: "2024-04-18" },
  { name: "Frank Wilson",   email: "frank@example.com",  role: "member", status: "inactive", joined: "2024-05-01" },
  { name: "Grace Lee",      email: "grace@example.com",  role: "viewer", status: "active",   joined: "2024-05-22" },
  { name: "Henry Chen",     email: "henry@example.com",  role: "member", status: "active",   joined: "2024-06-14" },
]

const statusClass: Record<Person["status"], string> = {
  active:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  inactive: "bg-muted text-muted-foreground",
}

export function DataTab() {
  const [filter, setFilter] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const rows = useMemo(() => {
    const filtered = sampleData.filter(
      (p) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.email.toLowerCase().includes(filter.toLowerCase())
    )
    return [...filtered].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    )
  }, [filter, sortAsc])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Users</CardTitle>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or email…"
          className="w-48 h-8 text-sm"
        />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-foreground text-inherit"
                  onClick={() => setSortAsc((v) => !v)}
                >
                  Name <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.email}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{p.role}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusClass[p.status]}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(p.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
