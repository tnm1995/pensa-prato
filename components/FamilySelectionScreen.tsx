
import React, { useState } from 'react';
import { FamilyMember } from '../types';
import { Plus, ArrowLeft, Pencil, CheckCircle2, CheckSquare, Square, ChevronRight, Users } from 'lucide-react';

interface FamilySelectionScreenProps {
  members: FamilyMember[];
  selectedMembers: FamilyMember[];
  onToggleMember: (member: FamilyMember) => void;
  onSelectAll: () => void;
  onContinue: () => void;
  onEditMember: (member: FamilyMember) => void;
  onAddNew: () => void;
  onBack: () => void;
}

export const FamilySelectionScreen: React.FC<FamilySelectionScreenProps> = ({ 
    members, 
    selectedMembers, 
    onToggleMember, 
    onSelectAll, 
    onContinue,
    onEditMember, 
    onAddNew, 
    onBack 
}) => {
  
  const isSelected = (id: string) => selectedMembers.some(m => m.id === id);
  const isAllSelected = members.length > 0 && selectedMembers.length === members.length;

  // Helper to determine if avatar is an image URL/Base64 or an Emoji
  const renderAvatar = (avatar: string | undefined, name: string, size: 'large' | 'small', isSelectedContext: boolean = false) => {
    const isImage = avatar && (avatar.startsWith('http') || avatar.startsWith('data:'));
    const bgFallback = isSelectedContext ? '10b981' : 'random';
    
    if (isImage && avatar) {
      return <img src={avatar} alt={name} className="w-full h-full object-cover" />;
    }
    
    if (avatar) {
      // It's an emoji
      return (
        <div className={`w-full h-full flex items-center justify-center bg-white ${size === 'large' ? 'text-4xl' : 'text-lg'}`}>
          {avatar}
        </div>
      );
    }

    // Fallback to UI Avatars
    return (
      <img 
        src={`https://ui-avatars.com/api/?name=${name}&background=${bgFallback}&color=fff`} 
        alt={name} 
        className="w-full h-full object-cover" 
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-40">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
            <div className="flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors mr-2 shadow-sm bg-white/50">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Para quem é a comida?</h1>
            </div>
            
            <button 
                onClick={onSelectAll}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors uppercase tracking-wide"
            >
                {isAllSelected ? 'Desmarcar' : 'Todos'}
            </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((member) => {
            const selected = isSelected(member.id);
            return (
                <div key={member.id} className="relative group">
                    <button
                        onClick={() => onToggleMember(member)}
                        className={`w-full p-4 rounded-3xl shadow-sm border-2 transition-all flex flex-col items-center text-center overflow-hidden h-full relative aspect-[4/5] justify-center ${
                            selected 
                            ? 'bg-emerald-50 border-emerald-500 shadow-emerald-100' 
                            : 'bg-white border-transparent hover:border-gray-200'
                        }`}
                    >
                        {selected && (
                            <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1 animate-in zoom-in duration-200 shadow-sm">
                                <CheckCircle2 className="w-3 h-3" />
                            </div>
                        )}

                        <div className={`w-20 h-20 rounded-full mb-4 overflow-hidden border-4 transition-all duration-300 flex items-center justify-center ${selected ? 'border-emerald-500 scale-105' : 'border-gray-50 bg-gray-50'}`}>
                            {renderAvatar(member.avatar, member.name, 'large', selected)}
                        </div>
                        <h3 className={`font-bold text-base mb-1 truncate w-full px-2 ${selected ? 'text-emerald-900' : 'text-gray-800'}`}>{member.name}</h3>
                        
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {member.restrictions.length > 0 ? (
                                <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold border border-red-100">
                                    {member.restrictions.length} restrições
                                </span>
                            ) : (
                                <span className="text-[9px] text-gray-400 font-medium">
                                    Livre
                                </span>
                            )}
                        </div>
                    </button>
                    
                    {/* Edit Button */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditMember(member);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-white shadow-sm border border-gray-100 rounded-full text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors z-10"
                    >
                        <Pencil className="w-3 h-3" />
                    </button>
                </div>
            );
          })}

          {/* Add New Button */}
          <button
            onClick={onAddNew}
            className="bg-white p-4 rounded-3xl border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center aspect-[4/5] group"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-emerald-600" />
            </div>
            <span className="font-bold text-gray-400 group-hover:text-emerald-600 text-sm">Novo Perfil</span>
          </button>
        </div>
      </div>

      {/* Floating Action Bar - Positioned above Bottom Menu */}
      <div className="fixed bottom-24 left-0 right-0 z-30 px-6 pointer-events-none">
          <div className={`max-w-md mx-auto bg-gray-900/90 backdrop-blur-md text-white p-2 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between pl-4 pr-2 transition-all duration-300 pointer-events-auto ${selectedMembers.length === 0 ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
              
              <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 pl-1">
                      {selectedMembers.slice(0,3).map(m => (
                          <div key={m.id} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700 overflow-hidden flex items-center justify-center">
                              {renderAvatar(m.avatar, m.name, 'small')}
                          </div>
                      ))}
                  </div>
                  <div className="flex flex-col">
                      <span className="text-sm font-bold leading-none">
                          {selectedMembers.length} {selectedMembers.length === 1 ? 'pessoa' : 'pessoas'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">selecionada(s)</span>
                  </div>
              </div>

              <button 
                onClick={onContinue}
                disabled={selectedMembers.length === 0}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2"
              >
                  Avançar <ChevronRight className="w-4 h-4" />
              </button>
          </div>
      </div>
    </div>
  );
};
