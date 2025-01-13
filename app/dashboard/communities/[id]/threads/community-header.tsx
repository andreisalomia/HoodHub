import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CommunityHeaderProps {
    title: string
    description: string
    icon: string
}

export function CommunityHeader({ title, description, icon }: CommunityHeaderProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl flex items-center">
                    <span className="mr-2 text-3xl">{icon}</span> {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    )
}

