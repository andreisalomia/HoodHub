'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageCircle } from 'lucide-react'
import AddThreadButton from '@/components/AddThreadButton'
import { ArrowRight } from 'lucide-react'

interface Message {
  username: string,
  content: string
}

interface Thread {
  id: number
  title: string
  content: string
  created_at: string
  messages: Message[]
}

export default function ThreadsPage({ params }: { params: Promise<{ id: number }> }) {
  const [communityId, setCommunityId] = useState<number>();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { id: comId } = await params;
        setCommunityId(comId);

        const { data, error } = await supabase
          .from('threads_communities')
          .select('*')
          .eq('community_uuid', comId);

        if (error) throw error;

        setThreads(data || []);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleAddThread = (newThread: Thread) => {
    setThreads((prevThreads) => [...prevThreads, newThread]);
    router.refresh();
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 bg-gradient-to-b from-gray-50 to-white px-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Community Discussions</h1>
          <p className="text-gray-600 mt-2">Engage in conversations and share your thoughts</p>
        </div>
        <AddThreadButton onAddThread={handleAddThread} communityId={communityId ?? 0} />
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))
        ) : threads.length > 0 ? (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {thread.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2">{thread.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{thread.messages ? thread.messages.length : 0} replies</span>
                  <span>•</span>
                  <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/dashboard/communities/${communityId}/threads/${thread.id}`)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View Thread
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="p-6 bg-white shadow-sm">
            <p className="text-center text-gray-600">No threads found. Start a new discussion!</p>
          </Card>
        )}
      </div>
    </div>
  )
}

