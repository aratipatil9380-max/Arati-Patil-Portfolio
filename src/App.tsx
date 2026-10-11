import { SiteNav } from './components/layout/SiteNav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/sections/Marquee';
import { Work } from './components/sections/Work';
import { Achievements } from './components/sections/Achievements';
import { Leadership } from './components/sections/Leadership';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { BeyondTech } from './components/sections/BeyondTech';
import { Contact } from './components/sections/Contact';
import { Cursor } from './components/ui/Cursor';
import { SceneTransition } from './experience/SceneTransition';
import { CommandPalette } from './experience/CommandPalette';
import { Telemetry } from './experience/Telemetry';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Cursor />

      <Telemetry />

      <SiteNav />

      <main id="main">
        <Hero />
        <Marquee />
        <Work />
        <Achievements />
        <SceneTransition label="Lead" />
        <Leadership />
        <About />
        <Skills />
        <SceneTransition label="Create" />
        <BeyondTech />
        <Contact />
      </main>

      <Footer />
      <CommandPalette />
    </>
  );
}
