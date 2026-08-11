// components/BlockedAccountModal.jsx

import React, { useState } from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

export default function BlockedAccountModal({ user, onClose, onUnlock }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlock = async () => {
    setIsProcessing(true);
    try {
      await onUnlock();
      onClose();
    } catch (error) {
      console.error('Erreur lors du déblocage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !user.isBlocked) return null;

  const unlockFee = user.unlockFee ?? 0;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
        {/* En-tête */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Compte bloqué</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Bonjour <span className="font-semibold">{user.name}</span>,
            </p>
            <p className="text-gray-600 mb-2">
              Votre compte est actuellement bloqué.
            </p>
          </div>

          {/* Raison du blocage */}
          {user.blockReason && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Info className="text-blue-600  mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Raison du blocage :</p>
                  <p className="text-sm text-blue-800">{user.blockReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Frais de déblocage */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Frais de déblocage :</span>
              <span className="text-2xl font-bold text-gray-800">
                {unlockFee.toLocaleString('fr-FR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}€
              </span>
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            onClick={handleUnlock}
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </>
            ) : (
              'Compris'
            )}
          </button>

          {/* Note informative */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Une fois débloqué, vous pourrez accéder à toutes les fonctionnalités de votre compte.
          </p>
        </div>
      </div>
    </div>
  );
}