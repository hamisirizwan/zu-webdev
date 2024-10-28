import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Rocket } from 'lucide-react'
import MembersList from "./components/MembersList"
import dbConnect from "@/db/connect"
import MembersModel from "@/db/model"


// This would typically come from your database
// const members = [
//   { id: 1, name: "John Doe", admNo: "ZT001", category: "beginner" },
//   { id: 2, name: "Jane Smith", admNo: "ZT002", category: "intermediate" },
//   { id: 3, name: "Bob Johnson", admNo: "ZT003", category: "advanced" },
//   { id: 4, name: "Alice Brown", admNo: "ZT004", category: "beginner" },
//   { id: 5, name: "Charlie Davis", admNo: "ZT005", category: "intermediate" },
//   { id: 6, name: "Eva White", admNo: "ZT006", category: "advanced" },
//   // Add more data as needed
// ]

const categoryIcons = {
  beginner: Users,
  intermediate: BookOpen,
  advanced: Rocket,
}

export default async function DashboardPage() {

    await dbConnect()

    const dbMembers = await MembersModel.find()
    const members = dbMembers.map((member) => ({
        id: member.id,
        name: member.name,
        category:member.category,
        admNo:member.admissionNumber
    }));

  const categoryCounts = members.reduce((acc, member) => {
    acc[member.category] = (acc[member.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Zetech Web Development Club Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {["beginner", "intermediate", "advanced"].map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <Card key={category} className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium capitalize">
                  {category}s
                </CardTitle>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categoryCounts[category] || 0}</div>
                <p className="text-xs text-muted-foreground">Total members</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <MembersList members={members} />
    </div>
  )
}