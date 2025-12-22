
import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowRight, BrainCircuit, Check, ChefHat, Clock, Sparkles, ChevronDown, Leaf, Coins, Gauge, Star, Crown, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialProof } from '../types';

interface LandingPageProps {
  onStartTest: () => void;
  onLogin: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
    onStartTest, 
    onLogin, 
    onTermsClick, 
    onPrivacyClick
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleFaq = (idx: number) => setActiveFaq(activeFaq === idx ? null : idx);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
        const offset = 120; // Compensate for fixed header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  const socialProofs: SocialProof[] = [
    {
        img: "https://static.ndmais.com.br/2024/12/istock-1036815628-800x533.jpg",
        title: "Assados no Forno",
        user: "Ana Silva",
        avatar: "https://ui-avatars.com/api/?name=Ana+Silva&background=random"
    },
    {
        img: "https://static.ndmais.com.br/2024/12/istock-1472680285-800x533.jpg",
        title: "Saudável",
        user: "Marcos Oliveira",
        avatar: "https://ui-avatars.com/api/?name=Marcos+Oliveira&background=random"
    },
    {
        img: "https://cdn.aquelareceita.com.br/recipes/Salada-de-Macarrao.00_03_07_11.Still001-1641924703900.png",
        title: "Ceia de Natal",
        user: "Julia Costa",
        avatar: "https://ui-avatars.com/api/?name=Julia+Costa&background=random"
    },
    {
        img: "https://institucional.vapza.com.br/wp-content/uploads/2021/12/pratos-edited.jpg",
        title: "Salada de Lentilha",
        user: "Ricardo Santos",
        avatar: "https://ui-avatars.com/api/?name=Ricardo+Santos&background=random"
    },
    {
        img: "https://blog.vapza.com.br/wp-content/uploads/2020/10/Bruschetta-Vegetariana.jpg",
        title: "Bruschetta Vegetariana",
        user: "Bia Ferreira",
        avatar: "https://ui-avatars.com/api/?name=Bia+Ferreira&background=random"
    },
    {
        img: "https://blog.vapza.com.br/wp-content/uploads/2020/10/lasanha-de-carne-seca-e-molho-de-abobora.jpg",
        title: "Lasanha de Carne-Seca",
        user: "Carlos Mendes",
        avatar: "https://ui-avatars.com/api/?name=Carlos+Mendes&background=random"
    }
  ];

  const menuItems = [
      { label: 'Funcionalidades', id: 'features' },
      { label: 'Avaliações', id: 'social' },
      { label: 'Planos', id: 'pricing' },
      { label: 'FAQ', id: 'faq' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-900 font-['Sora'] selection:bg-green-200 selection:text-green-900 overflow-x-hidden">
      
      {/* --- HEADER FLUTUANTE --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-6 flex justify-center">
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-xl shadow-stone-200/20 rounded-[2.5rem] pl-4 pr-3 py-3 flex items-center justify-between transition-all">
          
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="group-hover:rotate-12 transition-transform duration-300">
                <Logo size={32} />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900 whitespace-nowrap">Pensa Prato</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 bg-stone-100/50 px-8 py-2.5 rounded-full border border-stone-100">
              {menuItems.map((item) => (
                  <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm font-bold text-stone-500 hover:text-green-600 transition-colors"
                  >
                      {item.label}
                  </button>
              ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={onLogin} 
              className="text-sm font-bold text-stone-600 hover:text-green-700 px-5 py-2.5 rounded-full hover:bg-stone-50 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={onStartTest}
              className="bg-stone-900 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-black transition-all active:scale-95 shadow-lg shadow-stone-900/10"
            >
              Começar Grátis
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
             <button
                onClick={onStartTest}
                className="bg-stone-900 text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-black transition-all active:scale-95"
             >
                Começar
             </button>
             <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
             >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-24 left-4 right-4 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-6 flex flex-col gap-2 md:hidden"
                >
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="w-full text-left p-4 rounded-2xl hover:bg-stone-50 font-bold text-stone-600 hover:text-green-600 transition-colors flex justify-between items-center group"
                        >
                            {item.label}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                    ))}
                    <div className="h-px bg-stone-100 my-2"></div>
                    <button 
                        onClick={onLogin}
                        className="w-full py-4 text-center font-bold text-stone-600 hover:bg-stone-50 rounded-2xl transition-colors"
                    >
                        Já tenho conta
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-48 pb-20 px-6 relative">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-green-100/30 to-stone-100/40 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-orange-100/30 to-yellow-100/30 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="text-center lg:text-left space-y-8 lg:pr-10">
            <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-3.5 h-3.5 text-green-600 fill-current" />
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-widest">O Chef IA nº 1 do Brasil</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tighter text-stone-900 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Transforme o <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10 text-green-800">caos</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-green-200/50 -rotate-2 -z-0 rounded-full"></span>
              </span> em jantar.
            </h1>
            
            <p className="text-xl text-stone-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Não sabe o que cozinhar? Aponte a câmera para a geladeira e deixe nossa IA criar receitas deliciosas em segundos.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <button 
                onClick={onStartTest}
                className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg shadow-xl shadow-green-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Testar Grátis <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-white/50 transition-colors cursor-default">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-stone-200 overflow-hidden ring-1 ring-stone-100">
                            <img src={`https://ui-avatars.com/api/?background=random&color=fff&name=Chef+${i}`} alt="user" />
                        </div>
                    ))}
                </div>
                <div className="text-xs text-stone-500 text-left leading-tight">
                    <span className="font-bold text-stone-900 block text-sm">4.9/5</span>
                    de aprovação
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-in zoom-in duration-1000 delay-200 lg:h-[600px] flex items-center justify-center">
            <div className="relative z-20 w-[280px] md:w-[320px] bg-stone-900 rounded-[3rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[6px] border-stone-800 aspect-[9/19] rotate-[-6deg] hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-800 rounded-b-2xl z-20"></div>
                <div className="bg-white w-full h-full rounded-[2.5rem] overflow-hidden relative flex flex-col">
                    <div className="h-3/5 relative">
                        <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Salad" />
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <div className="inline-block bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2">98% Match</div>
                            <p className="font-bold text-2xl font-['Sora']">Salada Caesar</p>
                            <p className="text-sm opacity-80">Pronto em 15 min</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><ChefHat className="w-5 h-5" /></div>
                            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-orange-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-stone-100 rounded-full"></div>
                            <div className="h-2 w-5/6 bg-stone-100 rounded-full"></div>
                        </div>
                        <button className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold text-xs mt-2">Ver Receita</button>
                    </div>
                </div>
            </div>

            <div className="absolute top-20 right-10 md:right-20 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 animate-bounce delay-700 z-30 hidden md:block">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600"><Check className="w-4 h-4" /></div>
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase">Ingrediente</p>
                        <p className="font-bold text-stone-800">2 Ovos</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-40 left-0 md:left-10 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 animate-bounce delay-1000 z-30 hidden md:block">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Clock className="w-4 h-4" /></div>
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase">Tempo</p>
                        <p className="font-bold text-stone-800">15 min</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INGREDIENTS MARQUEE --- */}
      <div className="py-16 bg-white border-y border-stone-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Reconhece +2.000 ingredientes
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            </p>
        </div>
        
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
                {["Tomate", "Cebola", "Alho", "Frango", "Arroz", "Batata", "Cenoura", "Ovos", "Leite", "Queijo", "Macarrão", "Manteiga", "Farinha", "Azeite", "Pimenta"].map((item, i) => (
                    <li key={i} className="flex items-center">
                        <span className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-stone-200 to-stone-300 hover:from-green-500 hover:to-green-600 transition-all duration-300 cursor-pointer font-['Sora'] leading-[1.4] pb-4 pt-2 select-none inline-block hover:scale-110">
                            {item}
                        </span>
                    </li>
                ))}
            </ul>

            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll" aria-hidden="true">
                {["Tomate", "Cebola", "Alho", "Frango", "Arroz", "Batata", "Cenoura", "Ovos", "Leite", "Queijo", "Macarrão", "Manteiga", "Farinha", "Azeite", "Pimenta"].map((item, i) => (
                    <li key={i} className="flex items-center">
                        <span className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-stone-200 to-stone-300 hover:from-green-500 hover:to-green-600 transition-all duration-300 cursor-pointer font-['Sora'] leading-[1.4] pb-4 pt-2 select-none inline-block hover:scale-110">
                            {item}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-stone-900 tracking-tight">Sua cozinha,<br/><span className="text-green-600">reinventada pela IA.</span></h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
                Chega de desperdício e de comer sempre a mesma coisa. O Pensa Prato é o seu assistente criativo para todas as refeições.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-auto md:auto-rows-[340px]">
            <div className="md:col-span-3 lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 flex flex-col justify-between border border-stone-200">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/circuit.png')] pointer-events-none group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-[100px] pointer-events-none group-hover:bg-green-100/50 transition-colors"></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 border border-green-100 group-hover:border-green-200 transition-colors shadow-sm">
                            <BrainCircuit className="w-8 h-8 text-green-600 group-hover:text-green-500 animate-pulse" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-stone-900 tracking-tight">Cérebro de Chef.</h3>
                        <p className="text-stone-500 text-base md:text-lg max-w-md font-medium leading-relaxed group-hover:text-stone-600 transition-colors">
                            Nossa IA entende combinações de sabores, técnicas e substituições como um chef profissional. Ela "pensa" antes de sugerir.
                        </p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-3 lg:col-span-4 bg-[#FFFAF0] rounded-[2.5rem] p-8 flex flex-col justify-between border border-orange-100 hover:border-orange-200 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-100 rounded-full blur-2xl group-hover:bg-orange-200 transition-colors"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500 group-hover:scale-110 transition-transform duration-300 border border-orange-50">
                        <Gauge className="w-8 h-8" />
                    </div>
                </div>
                <div className="relative z-10 mt-8 md:mt-auto">
                    <span className="block text-5xl md:text-6xl font-extrabold text-orange-500 mb-2 tracking-tighter group-hover:translate-x-1 transition-transform">30s</span>
                    <h3 className="font-bold text-xl text-stone-900 leading-tight">Do "não sei" ao<br/>"huuum" em segundos.</h3>
                </div>
            </div>

            <div className="md:col-span-3 lg:col-span-4 row-span-1 bg-[#F0FDF4] border border-green-100 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-green-300 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-green-200/50 rounded-full blur-3xl group-hover:bg-green-300/60 transition-colors"></div>
                
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-green-600 shadow-sm group-hover:rotate-6 transition-transform">
                        <Leaf className="w-7 h-7 fill-current" />
                    </div>
                    <h3 className="font-bold text-2xl text-green-900 mb-3">Comida de Verdade.</h3>
                    <p className="text-green-800/70 font-medium leading-relaxed">
                        Fuja dos ultraprocessados. Controle o sal e o óleo fazendo sua própria comida com ingredientes frescos.
                    </p>
                </div>
                <div className="relative z-10 mt-6 flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/60 px-2 py-1 rounded text-green-700">Sem Conservantes</span>
                </div>
            </div>

            <div className="md:col-span-3 lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-stone-200 hover:border-green-200 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-stone-50 to-white opacity-50"></div>
                <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold mb-6 border border-yellow-100">
                        <Coins className="w-4 h-4 fill-yellow-400 text-yellow-600" /> Economia Inteligente
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-stone-900">Zero Desperdício.</h3>
                    <p className="text-stone-500 font-medium text-sm md:text-base">
                        Aquele tomate esquecido vira molho. O pão vira pudim. Use tudo o que você comprou e pare de jogar dinheiro no lixo.
                    </p>
                </div>
                
                <div className="relative z-10 bg-stone-900 text-white p-5 md:p-8 rounded-3xl shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500 w-full md:w-auto md:min-w-[220px] text-center border-4 border-stone-100/10">
                    <span className="text-[10px] md:text-xs text-stone-400 font-bold uppercase tracking-widest block mb-1">Economia Média</span>
                    <span className="block text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 mb-1 leading-tight">R$400</span>
                    <span className="text-[10px] md:text-xs text-stone-400 font-medium block">por mês em delivery</span>
                </div>
            </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF (INFINITE SCROLL) --- */}
      <section id="social" className="py-24 bg-stone-50 overflow-hidden border-t border-stone-100 relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4">
                Comida de casa, <span className="text-green-600">com gosto de Brasil.</span>
            </h2>
            <p className="text-stone-500 font-medium">Veja o que nossa comunidade está criando com o que tem na geladeira.</p>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-10">
            {[0, 1].map((arr) => (
                <ul key={arr} className="flex items-center justify-center md:justify-start [&_li]:mx-6 animate-infinite-scroll-slow" aria-hidden={arr === 1}>
                    {socialProofs.map((item, idx) => (
                        <li key={`${arr}-${idx}`} className="flex-shrink-0">
                            <div className="w-[280px] md:w-[320px] bg-white rounded-[2rem] p-3 shadow-lg border border-stone-100 cursor-pointer hover:scale-105 transition-all duration-300">
                                <div className="h-56 rounded-[1.5rem] overflow-hidden mb-4 relative bg-stone-100">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="px-2 pb-2">
                                    <h3 className="font-bold text-lg text-stone-900 mb-2 leading-tight">{item.title}</h3>
                                    <div className="flex items-center gap-3 pt-2 border-t border-stone-50">
                                        <img src={item.avatar || `https://ui-avatars.com/api/?name=${item.user.replace(' ', '+')}&background=random`} alt={item.user} className="w-8 h-8 rounded-full border border-stone-100" />
                                        <div>
                                            <span className="text-xs font-bold text-stone-900 block">{item.user}</span>
                                            <div className="flex text-amber-400">
                                                {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-current" />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ))}
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 px-6 bg-stone-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-40 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute bottom-40 right-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">
                    Escolha como <span className="text-green-600">cozinhar.</span>
                </h2>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                    Comece gratuitamente e descubra o poder da IA na sua cozinha. Evolua para o Pro quando quiser.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-stone-100 relative group hover:-translate-y-2 transition-all duration-300">
                    <div className="mb-8">
                        <span className="inline-block bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            Para começar
                        </span>
                        <h3 className="text-3xl font-bold text-stone-900 mb-2">Gratuito</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold text-stone-900 tracking-tight">R$0</span>
                            <span className="text-stone-500 font-medium">/sempre</span>
                        </div>
                        <p className="text-stone-500 mt-4 text-sm leading-relaxed">
                            Ideal para quem quer testar e fazer algumas refeições na semana.
                        </p>
                    </div>
                    
                    <ul className="space-y-4 mb-10">
                        {[
                            "3 Scans com IA",
                            "Receitas Básicas",
                            "Modo 'O Que Tem na Geladeira'",
                            "Acesso à Comunidade"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-stone-600 font-medium text-sm">
                                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5 text-stone-600" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={onStartTest}
                        className="w-full py-4 bg-white border-2 border-stone-200 hover:border-stone-900 text-stone-900 rounded-2xl font-bold text-sm transition-all hover:shadow-lg flex justify-center items-center gap-2"
                    >
                        Criar Conta Grátis
                    </button>
                </div>

                <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative group hover:-translate-y-2 transition-all duration-300 transform md:scale-105 border border-stone-800">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-green-900/20 uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
                        <Sparkles className="w-3 h-3 fill-current" /> Recomendado
                    </div>

                    <div className="mb-8">
                        <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                            Chef Pro <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold text-white tracking-tight">R$19</span>
                            <span className="text-3xl font-bold text-stone-400">,90</span>
                            <span className="text-stone-500 font-medium">/mês</span>
                        </div>
                        <p className="text-stone-400 mt-4 text-sm leading-relaxed">
                            Para quem cozinha todo dia e quer variedade ilimitada.
                        </p>
                    </div>
                    
                    <ul className="space-y-4 mb-10">
                        {[
                            "Scans Ilimitados",
                            "Todas as Dietas (Fit, Vegano...)",
                            "Pacotes Sazonais (Natal, Páscoa)",
                            "Sem Anúncios",
                            "Suporte Prioritário"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-stone-300 font-medium text-sm">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5 text-green-400" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={onStartTest}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-green-900/20 transition-all flex justify-center items-center gap-2 active:scale-95"
                    >
                        Testar Pro Grátis
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[10px] text-stone-500 mt-4 font-medium opacity-60">Cancele quando quiser.</p>
                </div>
            </div>
            
            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 opacity-70">
                <div className="flex items-center gap-2 text-sm font-bold text-stone-400">
                    <Shield className="w-5 h-5" /> Dados Seguros
                </div>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                <div className="flex items-center gap-2 text-sm font-bold text-stone-400">
                    <Star className="w-5 h-5" /> Satisfação Garantida
                </div>
            </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-20 px-6 max-3-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-stone-900">Perguntas Frequentes</h2>
        <div className="space-y-4">
            {[
              { q: "O app funciona com qualquer ingrediente?", a: "Sim! Nosso modelo de IA reconhece milhares de ingredientes, de vegetais comuns a temperos exóticos e até embalagens." },
              { q: "Tenho filhos pequenos, serve pra mim?", a: "Perfeito para você. Temos um 'Modo Família' que prioriza receitas nutritivas, sem excesso de sal e aceitas por crianças." },
              { q: "É realmente gratuito?", a: "Você começa com um plano gratuito generoso para testar. Se amar, temos planos Pro acessíveis a partir de R$ 19,90." }
            ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all hover:border-green-200">
                    <button 
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex justify-between items-center p-6 text-left font-bold text-stone-800 hover:bg-stone-50 transition-colors"
                    >
                        {item.q}
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-green-600' : ''}`} />
                    </button>
                    <div className={`px-6 text-stone-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {item.a}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-stone-100 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
                <Logo size={32} />
                <span className="font-bold text-xl text-stone-900">Pensa Prato</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-stone-500">
                <button onClick={onTermsClick} className="hover:text-green-600 transition-colors">Termos</button>
                <button onClick={onPrivacyClick} className="hover:text-green-600 transition-colors">Privacidade</button>
                <button className="hover:text-green-600 transition-colors">Instagram</button>
                <button className="hover:text-green-600 transition-colors">Contato</button>
            </div>
        </div>
        <div className="max-w-6xl mx-auto text-center border-t border-stone-100 pt-8">
            <p className="text-xs text-stone-400 font-medium">© 2024 Pensa Prato Tecnologia Ltda. Todos os direitos reservados.</p>
        </div>
      </footer>

      <style>{`
        @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
            animation: infinite-scroll 40s linear infinite;
        }
        .animate-infinite-scroll-slow {
            animation: infinite-scroll 80s linear infinite;
        }
      `}</style>
    </div>
  );
};
