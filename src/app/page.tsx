"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, ExternalLink, Code2, Monitor, Zap } from 'lucide-react';
import Image from "next/image"
import Link from "next/link";
import { GITHUB_URL, LINKEDIN_URL, MY_EMAIL, projectData } from '@/lib/constants';
import TopNav from '@/components/main/topnav';
import Footer from '@/components/main/footer';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/skyline_hero.jpg?height=1080&width=1920"
            alt="portfolio hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 transition-all duration-300 bg-hero-overlay" />
        </div>

        <div className="relative z-10 text-center text-white px-0 md:px-4 max-w-4xl mx-[5%] md:mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-[3px_3px_6px] text-shadow-black">
            Greetings, I&apos;m JV
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 text-shadow-[3px_3px_6px] text-shadow-black">
            I&apos;m a frontend applications developer who builds robust, maintainable, and scalable web applications with cutting-edge technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outlineLight">
              <Link href="#projects" className="flex items-center gap-2 text-shadow-[3px_3px_6px] text-shadow-black">
                Explore My Work
                <Code2 className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outlineLight">
              <Link href="#contact" className="flex items-center gap-2 text-shadow-[3px_3px_6px] text-shadow-black">
                Let&apos;s Connect
                <Mail className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frontend Applications Developer</h2>
          <div className="grid px-0 mx-[5%] md:mx-auto md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <Image
                src="/linkedin_profile_pic.jpg"
                alt="Joseph Victor Estolas - Frontend Developer"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                I&apos;m a dedicated frontend developer with over nine years of experience transforming designs and ideas into interactive and user-friendly web experiences. With a passion for writing clean, testable, and maintainable code, I strive to deliver robust software that is easy to understand while adhering to a higher standard of code quality.
              </p>
              <p className="text-lg text-muted-foreground">
                I enjoy learning about the latest frontend trends and updating my skillsets based on the current best practices. When I&apos;m not coding, you&apos;ll find me designing and tinkering with 3D models to be 3D printed or experimenting with new JavaScript tools and  frameworks.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  <Link href={GITHUB_URL} className="inline-flex items-center" target="_blank">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link href={LINKEDIN_URL} className="inline-flex items-center" target="_blank">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Technical Skills</h2>
          <div className="grid px-0 mx-[5%] md:mx-auto md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code2 className="w-8 h-8 text-custom-blue mb-2" />
                <CardTitle>Core Technologies</CardTitle>
                <CardDescription>Modern JavaScript frameworks and libraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>Redux</Badge>
                  <Badge>Next.js</Badge>
                  <Badge>Shadcn</Badge>
                  <Badge>RadixUI</Badge>
                  <Badge>JavaScript ES6+</Badge>
                  <Badge>NodeJS</Badge>
                  <Badge>Ruby on Rails</Badge>
                  <Badge>TypeScript</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Monitor className="w-8 h-8 text-custom-blue mb-2" />
                <CardTitle>Styling & Design</CardTitle>
                <CardDescription>Creating beautiful and responsive interfaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>CSS3</Badge>
                  <Badge>Sass/SCSS</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>Styled Components</Badge>
                  <Badge>Bootstrap</Badge>
                  <Badge>Responsive Design</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-custom-dark mb-2" />
                <CardTitle>Tools & Optimization</CardTitle>
                <CardDescription>Development tools and performance optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Webpack</Badge>
                  <Badge>Git</Badge>
                  <Badge>npm/yarn</Badge>
                  <Badge>ESLint</Badge>
                  <Badge>Cypress</Badge>
                  <Badge>Jest</Badge>
                  <Badge>Netlify</Badge>
                  <Badge>AWS</Badge>
                  <Badge>Heroku</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-0 mx-[5%] md:mx-auto">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectData.map(({
              image,
              title,
              description,
              tech,
              path,
            }, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <Link href={path || '#'} className="relative overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tech.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-muted/50">
        <div className="px-0 mx-[5%] md:mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to build something amazing?</h2>
          <p className="text-lg text-muted-foreground mb-12">
            I&apos;m currently available for full-time opportunities, contracts, and freelance projects. Let&apos;s connect and discuss how I can help bring your software ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline">
              <Link href={`mailto:${MY_EMAIL}`} className="inline-flex items-center" target="_blank">
                <Mail className="w-4 h-4 mr-2" />
                Email me
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href={LINKEDIN_URL} className="inline-flex items-center" target="_blank">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
