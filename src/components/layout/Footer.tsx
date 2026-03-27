import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-surface-dark border-t border-border py-12 px-6 sm:px-12 lg:ml-[280px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
            PixelCraft Studio
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            The ultimate all-in-one design platform for wedding cards, image editing, video creation, and more. Free, fast, and professional.
          </p>
          <div className="pt-2">
            <p className="text-sm font-medium text-text-primary">
              Developed by <span className="text-primary-light font-bold">Er Praveeen Kumar</span>
            </p>
          </div>
        </div>

        {/* Design Tools */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary">Design Tools</h4>
          <ul className="space-y-2">
            <li><Link href="/wedding-cards" className="text-sm text-text-muted hover:text-primary-light transition-colors">Wedding Invitation Maker</Link></li>
            <li><Link href="/invitation-maker" className="text-sm text-text-muted hover:text-primary-light transition-colors">General Invitation Maker</Link></li>
            <li><Link href="/social-media" className="text-sm text-text-muted hover:text-primary-light transition-colors">Social Media Post Creator</Link></li>
            <li><Link href="/quote-poster" className="text-sm text-text-muted hover:text-primary-light transition-colors">Quote Poster Designer</Link></li>
          </ul>
        </div>

        {/* Editing Tools */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary">Editing Tools</h4>
          <ul className="space-y-2">
            <li><Link href="/image-editor" className="text-sm text-text-muted hover:text-primary-light transition-colors">Online Photo Editor</Link></li>
            <li><Link href="/video-editor" className="text-sm text-text-muted hover:text-primary-light transition-colors">Online Video Editor</Link></li>
            <li><Link href="/background-remover" className="text-sm text-text-muted hover:text-primary-light transition-colors">AI Background Remover</Link></li>
            <li><Link href="/resume-enhancer" className="text-sm text-text-muted hover:text-primary-light transition-colors">Resume Photo Enhancer</Link></li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary">Connect</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            For support or business inquiries, feel free to reach out. We are constantly improving our tools to serve you better.
          </p>
          <div className="flex gap-4 pt-2">
             <div className="text-xs px-3 py-1 bg-surface-lighter rounded-full text-text-secondary border border-border">
               Hindi & English Support
             </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
        <p>© {new Date().getFullYear()} PixelCraft Studio. All rights reserved.</p>
        <p>Made with ❤️ in India by Er Praveeen Kumar</p>
      </div>
    </footer>
  );
};

export default Footer;
