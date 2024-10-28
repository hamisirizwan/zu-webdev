'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Member = {
  id: number
  name: string
  admNo: string
  category: string
}

type MembersListProps = {
  members: Member[]
}

export default function MembersList({ members }: MembersListProps) {
  const [activeTab, setActiveTab] = useState("beginner")

  const filteredMembers = members.filter(member => member.category === activeTab)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <TabsTrigger value="beginner" className="px-3">Beginners</TabsTrigger>
        <TabsTrigger value="intermediate" className="px-3">Intermediates</TabsTrigger>
        <TabsTrigger value="advanced" className="px-3">Advanced</TabsTrigger>
      </TabsList>
      {["beginner", "intermediate", "advanced"].map((category) => (
        <TabsContent key={category} value={category}>
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {category} Members
          </h2>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Admission No: {member.admNo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  )
}