import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircleQuestionIcon as QuestionMarkCircle, Book, MessageCircle, Bell } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
      
      {/* Quick Help Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-blue-600 text-white">
          <div className="flex items-center gap-4">
            <QuestionMarkCircle className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">FAQs</h2>
              <p className="text-blue-100">Most common questions</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gray-100">
          <div className="flex items-center gap-4">
            <Book className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Guides</h2>
              <p className="text-gray-500">Step-by-step tutorials</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gray-900 text-white">
          <div className="flex items-center gap-4">
            <MessageCircle className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-semibold">Support</h2>
              <p className="text-gray-300">Contact our team</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Popular Topics */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
        <div className="space-y-4">
          <TopicItem
            icon={<Bell className="h-5 w-5" />}
            title="Getting Started"
            description="Learn the basics of using our platform"
          />
          <TopicItem
            icon={<MessageCircle className="h-5 w-5" />}
            title="Community Guidelines"
            description="Understanding our community rules and etiquette"
          />
          <TopicItem
            icon={<Book className="h-5 w-5" />}
            title="Event Creation"
            description="How to create and manage community events"
          />
        </div>
      </Card>

      {/* Quick Links */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            <QuickLink title="How to join a community" />
            <QuickLink title="Managing your profile" />
            <QuickLink title="Privacy settings" />
            <QuickLink title="Notification preferences" />
            <QuickLink title="Account security" />
            <QuickLink title="Reporting issues" />
            <QuickLink title="Mobile app guide" />
            <QuickLink title="Billing and subscriptions" />
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

function TopicItem({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="text-gray-500">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

function QuickLink({ title }: { title: string }) {
  return (
    <a
      href="#"
      className="block p-2 rounded hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900"
    >
      {title}
    </a>
  )
}

