const Footer = () => (
	<footer className="py-8 px-4 border-t">
    <div className="container mx-auto text-center">
      <p className="text-muted-foreground">
        © {new Date().getFullYear()} Joseph Victor Estolas
      </p>
      <p>Built with Next.js, Tailwind CSS, and RadixUI</p>
    </div>
  </footer>
);

export default Footer;