'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MessageCircle, User, Shield } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { addThreadReplyAction } from '@/app/actions'
import { set } from 'react-hook-form'

interface Sender {
  id: string
  username: string
}

interface Message {
  id: string
  sender: Sender
  content: string
  timestamp: string
}

interface Thread {
  id: number
  title: string
  content: string
  created_at: string
  messages: Message[],
  creator: number
}

export default function ThreadPage({ params }: { params: { id: string, threadId: string } }) {
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creator, setCreator] = useState<string | null>(null)
  const [currentSender, setCurrentSender] = useState<Sender | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [communityId, setCommunityId] = useState<string | undefined>()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchThread = async () => {
      try {
        //current user id
        const { data: { user } } = await supabase.auth.getUser()

        const { id: comId, threadId } = await params
        setCommunityId(comId)

        const { data, error } = await supabase
          .from('threads_communities')
          .select('*')
          .eq('id', threadId)
          .single()

        if (error) throw error

        setThread(data)

        const { data: creatorData, error: creatorError } = await supabase
          .from('users')
          .select('username')
          .eq('id', data.creator)
          .single()

        if (creatorError) throw creatorError

        setCreator(creatorData.username)

        const { data: senderData, error: senderError } = await supabase
          .from('users')
          .select('id, username')
          .eq('id', user?.id)
          .single()

        console.log("senderData", senderData)

        if (senderError) throw senderError

        setCurrentSender(senderData)
      } catch (error) {
        console.error('Error fetching thread:', error)
        setError('Failed to load thread. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchThread()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newMessage = {
      id: Date.now().toString(),
      sender: currentSender,
      content: replyContent,
      timestamp: new Date().toISOString()
    };

    try {
      const formDataToSend = new FormData();
      Object.entries(newMessage).forEach(([key, value]) => {
        formDataToSend.append(key, value ? value.toString() : '');
      });

      await addThreadReplyAction(formDataToSend, Number(communityId), thread?.id);

      router.refresh();
    } catch (error) {
      console.error("Error adding thread reply:", error);
    } finally {
      setReplyContent('');
    }
  }

  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 bg-gradient-to-b from-gray-50 to-white px-6 py-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6 py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6 py-8">
        <p className="text-gray-500 mb-4">Thread not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 bg-gradient-to-b from-gray-50 to-white px-6 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Threads
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xxl font-bold text-gray-800">
            {thread.title}
            <span className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <User className="h-4 w-4" />
              by {creator}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{thread.content}</p>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Posted on {new Date(thread.created_at).toLocaleDateString()} at {new Date(thread.created_at).toLocaleTimeString()}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Replies</h2>
        {thread.messages && thread.messages.length > 0 ? (
          thread.messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{message.sender.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    by {message.sender.username}
                    {/* {message.isAdmin && <Shield className="h-4 w-4 text-blue-500" />} */}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{message.content}</p>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No replies yet.</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Reply to Thread</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              id="replyContent"
              className="bg-white border-[#EAEDED] focus:ring-2 focus:ring-[#0264FA] focus:border-[#0264FA] transition"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-[#0264FA] hover:bg-[#0248C5] transition"
          >
            Submit Reply
          </Button>
        </form>
      </div>

      {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MessageCircle className="w-4 w-4" />
                    <span>{thread.messages ? thread.messages.length : 0} replies</span>
                </div>
            </div> */}
    </div>
  )
}

