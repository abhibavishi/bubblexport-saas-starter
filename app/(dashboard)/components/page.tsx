import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartsTab } from "@/components/showcase/charts-tab"
import { FormsTab } from "@/components/showcase/forms-tab"
import { DataTab } from "@/components/showcase/data-tab"

export default function ComponentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-sm">shadcn/ui component showcase.</p>
      </div>

      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="mt-4"><ChartsTab /></TabsContent>
        <TabsContent value="forms" className="mt-4"><FormsTab /></TabsContent>
        <TabsContent value="data" className="mt-4"><DataTab /></TabsContent>
      </Tabs>
    </div>
  )
}
