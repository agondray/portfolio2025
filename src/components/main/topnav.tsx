import Link from "next/link";
import { User } from 'lucide-react';
import ThemeSwitch from '@/components/ui/themeSwitch';

const TopNav = ({ hideAnchors = false, linkToMain = false }: { hideAnchors: boolean, linkToMain: boolean }) => (
	<nav className="fixed top-0 max-h-[60px] w-full bg-background backdrop-blur-md border-b z-50">
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <Link href={linkToMain ? '/' : '#top'} className="flex justify-between text-sm hover:text-primary/80">
        	<User className="w-8 mr-2"/>
          <h1 className="text-xl font-bold">
            Joseph Victor Estolas
          </h1>
        </Link>
        <div className="flex items-center gap-6">
          {
          	!hideAnchors && (
          		<div className="hidden md:flex space-x-6">
		            <Link href="#about" className="text-sm hover:text-primary/80">
		              About 
		            </Link>
		            <Link href="#skills" className="text-sm hover:text-primary/80">
		              Skills
		            </Link>
		            <Link href="#projects" className="text-sm hover:text-primary/80">
		              Projects
		            </Link>
		            <Link href="#contact" className="text-sm hover:text-primary/80">
		              Contact
		            </Link>
		          </div>
          	)
          }
          <ThemeSwitch />
        </div>
      </div>
    </div>
  </nav>
);

export default TopNav