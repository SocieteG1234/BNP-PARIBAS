import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const ChangePasswordPage = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    onlyNumbers: false,
    match: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Accepter uniquement des chiffres
    const onlyNumbers = value.replace(/\D/g, '');
    
    setFormData(prev => ({ ...prev, [name]: onlyNumbers }));
    setError('');
    setSuccess(false);

    // Validation en temps réel pour le nouveau mot de passe
    if (name === 'newPassword') {
      setValidations({
        minLength: onlyNumbers.length >= 6,
        onlyNumbers: true,
        match: onlyNumbers === formData.confirmPassword && onlyNumbers !== ''
      });
    }

    // Validation de la correspondance
    if (name === 'confirmPassword' || name === 'newPassword') {
      const newPass = name === 'newPassword' ? onlyNumbers : formData.newPassword;
      const confirmPass = name === 'confirmPassword' ? onlyNumbers : formData.confirmPassword;
      setValidations(prev => ({
        ...prev,
        match: newPass === confirmPass && newPass !== ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    // Vérifier que l'utilisateur est connecté
    if (!user || !user.id) {
      setError('Vous devez être connecté pour changer votre mot de passe');
      return;
    }

    // Validations
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 chiffres');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setLoading(true);

    try {
      await UserService.changePassword(user.id, formData.oldPassword, formData.newPassword);
      setSuccess(true);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setValidations({ minLength: false, onlyNumbers: false, match: false });
      
      // Redirection après 2 secondes
      setTimeout(() => {
        logout(); // Déconnecter l'utilisateur
        alert('Mot de passe modifié avec succès ! Reconnectez-vous avec votre nouveau mot de passe.');
        navigate('login'); // Rediriger vers la page de connexion
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && !success && validations.minLength && validations.onlyNumbers && validations.match) {
      handleSubmit();
    }
  };

  // Si pas d'utilisateur connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <button
            onClick={() => navigate('login')}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-emerald-600">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Changer le mot de passe
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Sécurisez votre compte {user.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-700">Mot de passe modifié !</p>
                <p className="text-xs text-green-600 mt-1">Vous allez être déconnecté...</p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Ancien mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancien mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  inputMode="numeric"
                  pattern="\d*"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="••••••"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  inputMode="numeric"
                  pattern="\d*"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="••••••"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  inputMode="numeric"
                  pattern="\d*"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="••••••"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Validations */}
            {formData.newPassword && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-gray-700 mb-2">Critères requis :</p>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 text-xs ${validations.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validations.minLength ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {validations.minLength && <CheckCircle className="w-3 h-3" />}
                    </div>
                    Au moins 6 caractères
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${validations.onlyNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validations.onlyNumbers ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {validations.onlyNumbers && <CheckCircle className="w-3 h-3" />}
                    </div>
                    Uniquement des chiffres
                  </div>
                  {formData.confirmPassword && (
                    <div className={`flex items-center gap-2 text-xs ${validations.match ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validations.match ? 'bg-green-100' : 'bg-gray-200'}`}>
                        {validations.match && <CheckCircle className="w-3 h-3" />}
                      </div>
                      Les mots de passe correspondent
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bouton */}
            <button
              onClick={handleSubmit}
              disabled={loading || success || !validations.minLength || !validations.onlyNumbers || !validations.match}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Modification en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Modifier le mot de passe
                </>
              )}
            </button>
          </div>

          {/* Info de sécurité */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>🔒 Sécurité :</strong> Après la modification, vous serez déconnecté et devrez vous reconnecter avec votre nouveau mot de passe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;