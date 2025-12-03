
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsScreenProps {
  onBack: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm pt-4 px-6 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Termos de Uso</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Termos e Condições</h2>
          </div>

          <p>
            Bem-vindo ao <strong>Pensa Prato</strong>. Ao acessar ou usar nosso aplicativo, você concorda com estes Termos de Uso. Se você não concordar, por favor, não utilize o serviço.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">1. Descrição do Serviço</h3>
          <p>
            O Pensa Prato é um assistente culinário baseado em Inteligência Artificial que analisa fotos de ingredientes e sugere receitas. O serviço é fornecido "como está" e tem caráter meramente informativo e recreativo.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">2. Uso da Inteligência Artificial</h3>
          <p>
            Nossas sugestões são geradas por modelos de IA (Google Gemini). Embora nos esforcemos pela precisão:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Não garantimos que todas as identificações de ingredientes sejam 100% corretas.</li>
            <li>O usuário deve sempre verificar se a receita gerada é segura e adequada para consumo.</li>
            <li>Não nos responsabilizamos por alergias, intolerâncias ou resultados culinários insatisfatórios baseados nas sugestões da IA.</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 pt-4">3. Responsabilidades do Usuário</h3>
          <p>
            Você é responsável por:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manter a confidencialidade da sua senha e conta.</li>
            <li>Verificar a comestibilidade e validade dos ingredientes reais que você utiliza.</li>
            <li>Não utilizar o serviço para fins ilegais ou não autorizados.</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 pt-4">4. Planos e Pagamentos</h3>
          <p>
            Oferecemos uma versão gratuita limitada e versões pagas (Pro/Pacotes). Os pagamentos são processados por plataformas terceiras (Hotmart/Kiwify). Não armazenamos dados de cartão de crédito. O cancelamento e reembolso seguem as políticas da plataforma de pagamento utilizada.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">5. Propriedade Intelectual</h3>
          <p>
            Todo o design, logotipos, código e conteúdo do aplicativo são propriedade do Pensa Prato. As receitas geradas, por sua natureza genérica, são de uso livre pelo usuário.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">6. Alterações nos Termos</h3>
          <p>
            Podemos modificar estes termos a qualquer momento. O uso contínuo do serviço após as alterações constitui aceitação dos novos termos.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">7. Contato</h3>
          <p>
            Para dúvidas sobre estes termos, entre em contato através do nosso suporte no aplicativo.
          </p>

          <div className="pt-8 text-xs text-gray-400 border-t border-gray-100 mt-8">
            Última atualização: {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
