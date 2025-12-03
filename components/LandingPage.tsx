


import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowRight, BrainCircuit, CheckCircle2, Clock, DollarSign, ChevronDown, ChevronUp, Utensils, Users, ShoppingCart, Smile } from 'lucide-react';

interface LandingPageProps {
  onStartTest: () => void;
  onLogin: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartTest, onLogin, onTermsClick, onPrivacyClick }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToOffer = () => {
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-bold text-xl tracking-tight">Pensa <span className="text-[#00C853]">Prato</span></span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onLogin}
              className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={onStartTest}
              className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-200 active:scale-95"
            >
              Começar Teste
            </button>
          </div>
        </div>
      </nav>

      {/* SESSÃO 1: HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BrainCircuit className="w-4 h-4" /> Chega de bloqueio criativo
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-gray-900 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            A cena do jantar, <br className="hidden md:block"/>
            <span className="text-emerald-600">repetida exaustivamente.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Aquele momento, ao final do dia, onde a paz é substituída pela pergunta mais temida: <span className="italic font-medium text-gray-800">"o que vamos comer hoje?"</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={onStartTest}
              className="w-full sm:w-auto bg-[#00C853] hover:bg-[#00b34a] text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
            >
              Começar seu teste <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-400 mt-2 sm:mt-0 font-medium">Teste gratuito. Cancele quando quiser.</p>
          </div>
        </div>
      </section>

      {/* SESSÃO 2: PROBLEMA (Agitação) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold mb-6">O ciclo da exaustão</h2>
            <p className="text-lg text-gray-600 leading-loose">
              É um ritual quase cômico, mas exaustivo. Você e o parceiro se olham, ou os filhos perguntam pela décima vez. O olhar perdido no feed do Instagram ou na pasta do Pinterest, esperando que a inspiração (ou um milagre) apareça. <strong className="text-gray-900">Mas ela não vem.</strong> Vem o cansaço. Vem a pizza. Vem a sensação de que, mais uma vez, a energia da decisão foi maior que a da execução. Não é sobre cozinhar; é sobre o desgaste mental que precede cada refeição.
            </p>
          </div>
        </div>
      </section>

      {/* SESSÃO 3: A NOVA LÓGICA (Solução) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200/30 rounded-3xl blur-3xl transform rotate-6"></div>
                <div className="relative bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl border-8 border-gray-900 aspect-[9/16] max-w-sm mx-auto md:mx-0">
                    <img 
                        src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop" 
                        alt="App Interface" 
                        className="w-full h-full object-cover rounded-[1.5rem] opacity-80" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg max-w-[80%] text-center">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                            <p className="font-bold text-gray-900">Jantar Planejado</p>
                            <p className="text-xs text-gray-500">Ingredientes verificados.</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Quebrar o ciclo é menos sobre esforço e <span className="text-emerald-600">mais sobre inteligência.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A verdade é que a espontaneidade na cozinha tem um preço alto em tempo e estresse. A verdadeira liberdade vem da estrutura.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Quando você tem um sistema que pensa à frente, que já alinhou receitas e ingredientes, a cozinha volta a ser um lugar de prazer, não de pressão. A pergunta "o que vamos comer?" simplesmente deixa de existir, substituída pela certeza de um plano.
              </p>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="font-medium text-emerald-900 italic">
                  "Elimine a decisão diária e recupere sua energia para o que realmente importa, como desfrutar da sua família ou de um bom livro."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSÃO 4: BENEFÍCIOS TANGÍVEIS */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O que você ganha de volta?</h2>
            <p className="text-gray-400">Resultados reais de quem parou de improvisar.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Smile, title: "Paz Mental", desc: "Jantares sem estresse e discussões desnecessárias sobre o cardápio." },
              { icon: Utensils, title: "Variedade Real", desc: "Variedade culinária sem esforço mental ou busca frenética no Google." },
              { icon: ShoppingCart, title: "Economia Inteligente", desc: "Listas de supermercado que fazem sentido, economizando tempo e dinheiro." },
              { icon: Users, title: "Qualidade de Vida", desc: "Mais momentos de qualidade em família, sem a sombra da indecisão." },
              { icon: DollarSign, title: "Fim do Delivery", desc: "Despedida do delivery por pura fadiga, com refeições caseiras deliciosas." },
              { icon: BrainCircuit, title: "Decisões Automáticas", desc: "A IA analisa o que você tem e decide por você em segundos." }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-800 p-8 rounded-3xl hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SESSÃO 5: QUEM É (Autoridade) */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=Criador+PensaPrato&background=00C853&color=fff&size=128" alt="Criador" />
          </div>
          <blockquote className="text-2xl font-medium text-gray-900 mb-6 font-serif italic">
            "Compreendi essa jornada porque a vivi intensamente. A transição de 'perdido no caos da cozinha' para 'mestre do planejamento' foi um divisor de águas na minha própria casa. O Pensa Prato é a materialização dessa virada, desenhado por quem entende a frustração e valoriza a paz doméstica."
          </blockquote>
          <cite className="not-italic font-bold text-gray-500 tracking-widest text-sm uppercase">
            — Criador do Pensa Prato
          </cite>
        </div>
      </section>

      {/* SESSÃO 6: A OFERTA IRRECUSÁVEL */}
      <section id="offer" className="py-24 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Recupere sua sanidade diária.</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            A lógica de experimentar algo que promete transformar sua rotina, devolvendo sua paz e seu tempo, é inegável.
          </p>
          
          <div className="bg-white text-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">Teste Gratuito do Pensa Prato</h3>
            <p className="text-gray-500 mb-8">Sem compromisso. Veja a mágica acontecer.</p>
            
            <ul className="text-left space-y-4 mb-10 max-w-sm mx-auto">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>3 Scans de Geladeira Grátis</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Receitas baseadas no que você tem</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Acesso ao Planejamento Inteligente</span>
              </li>
            </ul>

            <button 
              onClick={onStartTest}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold py-5 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar Teste Agora
            </button>
            <p className="text-xs text-gray-400 mt-4">Não há letras miúdas. A decisão de continuar será puramente sua.</p>
          </div>
        </div>
      </section>

      {/* SESSÃO 7: FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "Minha família é exigente e cheia de restrições, o Pensa Prato funciona?",
                a: "Com certeza. O sistema é desenhado para se adaptar às suas preferências e restrições específicas, sejam elas alergias, dietas ou gostos individuais. A ideia não é impor um cardápio, mas otimizar o seu, garantindo que todos fiquem satisfeitos."
              },
              {
                q: "Não sou bom em cozinhar, isso realmente me ajuda?",
                a: "O Pensa Prato simplifica a etapa mais complexa e intimidadora: a decisão e o planejamento. Com isso resolvido, as receitas se tornam mais claras e acessíveis, transformando a execução em um processo muito mais intuitivo e menos assustador. A confiança vem da organização."
              },
              {
                q: "Preciso pagar para testar?",
                a: "Não. Oferecemos um período de uso gratuito para você sentir na pele a diferença de ter uma cozinha organizada pela Inteligência Artificial."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-800 pr-4">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-emerald-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <Logo size={24} />
            <span className="font-bold text-gray-900">Pensa Prato</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Pensa Prato. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <button onClick={onTermsClick} className="hover:text-emerald-600 transition-colors">Termos</button>
            <button onClick={onPrivacyClick} className="hover:text-emerald-600 transition-colors">Privacidade</button>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};