
import React, { useRef, useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Avatar, 
  AvatarGroup, 
  Paper,
  Alert,
  Fade
} from '@mui/material';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  ScanLine, 
  Wind, 
  Flame, 
  ChefHat, 
  UtensilsCrossed, 
  ChevronDown, 
  AlertCircle, 
  ArrowLeft, 
  Compass, 
  Zap, 
  Trash2
} from 'lucide-react';
import { FamilyMember, CookingMethod } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
  onProfileClick: () => void;
  activeProfiles: FamilyMember[];
  cookingMethod: CookingMethod;
  onChangeContext: () => void;
  error?: string | null;
  onBack: () => void;
  onExploreClick: () => void;
  freeUsageCount: number;
  maxFreeUses: number;
  isPro: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ 
    onFileSelected, 
    onProfileClick, 
    activeProfiles = [], 
    cookingMethod, 
    onChangeContext,
    error,
    onBack,
    onExploreClick,
    freeUsageCount = 0,
    maxFreeUses = 3,
    isPro
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [persistedImage, setPersistedImage] = useState<string | null>(null);

  useEffect(() => {
    try {
        const saved = sessionStorage.getItem('gc_last_upload');
        if (saved) setPersistedImage(saved);
    } catch (e) {
        console.warn("SessionStorage blocked or full");
    }
  }, []);

  const allRestrictions = [...new Set(activeProfiles.flatMap(p => p.restrictions || []))];

  const getMethodIcon = () => {
    switch(cookingMethod) {
        case CookingMethod.AIRFRYER: return <Wind size={16} className="text-emerald-600" />;
        case CookingMethod.STOVE: return <Flame size={16} className="text-orange-500" />;
        case CookingMethod.OVEN: return <ChefHat size={16} className="text-amber-600" />;
        default: return <UtensilsCrossed size={16} className="text-stone-400" />;
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPersistedImage(result);
      try {
          sessionStorage.setItem('gc_last_upload', result);
      } catch(e) {}
      onFileSelected(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPersistedImage(null);
    try {
        sessionStorage.removeItem('gc_last_upload');
    } catch(e) {}
  };

  const remaining = Math.max(0, maxFreeUses - freeUsageCount);

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#FDFCF8', pb: 10,
      fontFamily: '"Sora", sans-serif'
    }}>
      
      <Box sx={{ px: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 }}>
        <IconButton 
            onClick={onBack} 
            sx={{ bgcolor: 'white', boxShadow: 1, border: '1px solid #f1f5f9', '&:hover': { bgcolor: '#f8fafc', color: '#059669' } }}
        >
            <ArrowLeft size={20} />
        </IconButton>
        
        {isPro ? (
            <Box sx={{ 
                display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#171717', color: 'white', 
                pl: 1.5, pr: 2, py: 1, borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 
            }}>
                <Zap size={14} fill="#fbbf24" color="#fbbf24" /> PRO ATIVO
            </Box>
        ) : (
            <Box sx={{ 
                display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white', border: '1px solid #e2e8f0', 
                color: '#4b5563', pl: 1.5, pr: 2, py: 1, borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 
            }}>
                <Box component="span" sx={{ width: 8, height: 8, bgcolor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                {String(remaining)} restantes
            </Box>
        )}
      </Box>

      <Box component="main" sx={{ flex: 1, px: 3, mt: 2, maxWidth: 500, mx: 'auto', width: '100%' }}>
        
        <Paper 
            onClick={onChangeContext}
            elevation={0}
            sx={{ 
                p: 2, borderRadius: 6, border: '1px solid #f1f5f9', bgcolor: 'white', mb: 4,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { borderColor: '#10b981', boxShadow: '0 4px 20px -5px rgba(16, 185, 129, 0.1)' }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 40, height: 40, border: '2px solid white' } }}>
                    {activeProfiles.length > 0 ? (
                        activeProfiles.map((p, i) => (
                            <Avatar key={p.id || i} src={p.avatar} alt={p.name}>
                                {!p.avatar && p.name ? p.name.charAt(0) : '?'}
                            </Avatar>
                        ))
                    ) : (
                        <Avatar sx={{ bgcolor: '#f8fafc', color: '#94a3b8' }}><UtensilsCrossed size={20} /></Avatar>
                    )}
                </AvatarGroup>
                
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1f2937', lineHeight: 1.2 }}>
                        {activeProfiles.length === 0 ? "Para quem?" : 
                         activeProfiles.length === 1 ? activeProfiles[0].name : "Família & Amigos"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                            {getMethodIcon()}
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>
                                {cookingMethod === CookingMethod.ANY ? 'Livre' : String(cookingMethod)}
                            </Typography>
                         </Box>
                         {allRestrictions.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 1, bgcolor: '#fef2f2', border: '1px solid #fee2e2' }}>
                                <AlertCircle size={10} className="text-red-500" />
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#ef4444' }}>
                                    {String(allRestrictions.length)}
                                </Typography>
                            </Box>
                         )}
                    </Box>
                </Box>
            </Box>
            <ChevronDown size={20} className="text-stone-300" />
        </Paper>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', mb: 1, letterSpacing: '-0.02em' }}>
                Geladeira Cheia?
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                Aponte a câmera e deixe a IA criar a mágica.
            </Typography>
        </Box>

        <Box
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={triggerFileInput}
            sx={{
                position: 'relative', aspectRatio: '4/5', maxHeight: 380, width: '100%', borderRadius: 10, border: '3px dashed',
                borderColor: dragActive ? '#10b981' : persistedImage ? '#10b981' : '#e2e8f0',
                bgcolor: dragActive ? '#f0fdf4' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', transition: 'all 0.4s ease',
                boxShadow: persistedImage ? '0 10px 40px -10px rgba(16, 185, 129, 0.15)' : '0 10px 20px -5px rgba(0,0,0,0.05)',
                '&:hover': { borderColor: '#10b981', transform: 'translateY(-4px)', boxShadow: '0 20px 50px -15px rgba(16, 185, 129, 0.15)' }
            }}
        >
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            
            <AnimatePresence mode="wait">
                {persistedImage ? (
                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <img src={persistedImage} alt="Scan Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: 5, boxShadow: 10 }}>
                                <ScanLine size={32} className="text-emerald-600 mb-2 mx-auto animate-bounce" />
                                <Typography sx={{ fontWeight: 800, color: '#111827', fontSize: '0.875rem' }}>Imagem pronta!</Typography>
                                <Button size="small" variant="text" color="error" startIcon={<Trash2 size={14} />} onClick={clearImage} sx={{ mt: 1, fontWeight: 700 }}>Trocar</Button>
                             </Box>
                        </Box>
                    </motion.div>
                ) : (
                    <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 80, height: 80, bgcolor: '#f8fafc', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, border: '1px solid #f1f5f9' }}>
                            <Camera size={32} className="text-slate-400" />
                        </Box>
                        <Button variant="contained" startIcon={<ScanLine size={18} />} sx={{ bgcolor: '#171717', color: 'white', px: 4, py: 1.5, borderRadius: 3, fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#000' } }}>Abrir Câmera</Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 4, color: '#94a3b8' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                <ImageIcon size={20} />
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 800 }}>GALERIA</Typography>
                            </Box>
                            <Box sx={{ height: 24, width: 1, bgcolor: '#f1f5f9' }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                <Upload size={20} />
                                <Typography sx={{ fontSize: '0.6rem', fontWeight: 800 }}>ARQUIVO</Typography>
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>

        <Button 
            fullWidth onClick={onExploreClick}
            sx={{ 
                mt: 3, p: 2, bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 4,
                textTransform: 'none', color: '#1f2937', justifyContent: 'space-between',
                '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#fffbeb', borderRadius: 2, color: '#d97706', border: '1px solid #fef3c7' }}>
                    <Compass size={20} />
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Sem ingredientes?</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>Explore por categorias</Typography>
                </Box>
            </Box>
            <ArrowLeft size={18} className="rotate-180 text-stone-300" />
        </Button>

        {error && (
            <Fade in={Boolean(error)}>
                <Alert severity="error" icon={<AlertCircle size={20} />} sx={{ mt: 3, borderRadius: 4, fontWeight: 600 }}>{error}</Alert>
            </Fade>
        )}

      </Box>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </Box>
  );
};
