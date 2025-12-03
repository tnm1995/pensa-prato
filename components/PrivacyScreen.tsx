
import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm pt-4 px-6 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Política de Privacidade</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Privacidade de Dados</h2>
          </div>

          <p>
            Sua privacidade é fundamental para o <strong>Pensa Prato</strong>. Esta política descreve como coletamos, usamos e protegemos suas informações.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">1. Dados que Coletamos</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Informações de Cadastro:</strong> Nome, e-mail e CPF (para conformidade fiscal e unicidade de conta).</li>
            <li><strong>Mídia:</strong> Fotos da sua geladeira/despensa que você envia para análise.</li>
            <li><strong>Preferências:</strong> Restrições alimentares, alergias e itens da despensa que você configura no perfil.</li>
            <li><strong>Uso:</strong> Histórico de receitas geradas e salvas.</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 pt-4">2. Como Usamos seus Dados</h3>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Fornecer o serviço de geração de receitas personalizadas.</li>
            <li>Processar as imagens enviadas usando a API do Google Gemini (as imagens são processadas e não usadas para treinar modelos públicos sem consentimento).</li>
            <li>Gerenciar sua conta e assinaturas.</li>
            <li>Melhorar a experiência do usuário e corrigir erros.</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 pt-4">3. Compartilhamento de Dados</h3>
          <p>
            Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Google (Gemini API):</strong> Para processamento das imagens e geração de texto (receitas).</li>
            <li><strong>Firebase (Google):</strong> Para autenticação segura e armazenamento de banco de dados.</li>
            <li><strong>Autoridades Legais:</strong> Se exigido por lei.</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 pt-4">4. Segurança</h3>
          <p>
            Adotamos medidas de segurança robustas para proteger seus dados, incluindo criptografia em trânsito e armazenamento seguro em servidores do Google Cloud.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">5. Seus Direitos (LGPD)</h3>
          <p>
            Você tem direito a acessar, corrigir ou excluir seus dados pessoais a qualquer momento. A exclusão da conta pode ser feita diretamente no app ou solicitada ao suporte, resultando na remoção permanente de seus dados.
          </p>

          <h3 className="text-lg font-bold text-gray-800 pt-4">6. Cookies e Rastreamento</h3>
          <p>
            Utilizamos armazenamento local do navegador para manter sua sessão ativa e salvar preferências básicas.
          </p>

          <div className="pt-8 text-xs text-gray-400 border-t border-gray-100 mt-8">
            Última atualização: {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
