import { 
    Github as GithubIcon, 
    Instagram as InstagramIcon, 
    Twitter as TwitterIcon, 
    Linkedin as LinkedinIcon, 
    Youtube as YoutubeIcon, 
    Divide
  } from 'lucide-react'
  import Link from 'next/link'
  
  interface SocialLink {
    name: string
    href: string
    icon: React.ElementType // Ensures `icon` is a React component
  }
  
  const socialLinks: SocialLink[] = [
    { name: 'Instagram', href: 'https://instagram.com/yourcompany', icon: InstagramIcon },
    { name: 'GitHub', href: 'https://github.com/yourcompany', icon: GithubIcon },
    { name: 'Twitter', href: 'https://twitter.com/yourcompany', icon: TwitterIcon },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/yourcompany', icon: LinkedinIcon },
    { name: 'YouTube', href: 'https://youtube.com/yourcompany', icon: YoutubeIcon },
  ]
  export function SocialLinks() {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
            aria-label={`Visit our ${link.name} page`}
          >
            {/* Rendering the icon as a React component */}
            <link.icon className="w-6 h-6 sm:w-8 sm:h-8" />
          </Link>
        ))}
      </div>
    )
  }
  