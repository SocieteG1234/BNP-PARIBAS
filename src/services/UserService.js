// services/UserService.js - AVEC SYSTÈME DE VERSION
// ⚡ Changez DATA_VERSION chaque fois que vous modifiez getDefaultUsers()

const DEV_MODE = true;
const STORAGE_KEY = 'bnp_users_data';
const DATA_VERSION = 4
 ; // ⚡ INCRÉMENTER CE NUMÉRO À CHAQUE MODIFICATION

class UserService {
  constructor() {
    if (DEV_MODE) console.log('🔧 UserService initialisé - Version', DATA_VERSION);
    this.loadFromStorage();
    this.managers = [
      'Charles Fortunato',
      'Sophie Martin', 
      'Pierre Dubois',
      'Marie Lefebvre',
      'Thomas Bernard',
      'Claire Rousseau',
      'Lucien Vollet',
      'Luc Vollet'
    ];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedVersion = localStorage.getItem(STORAGE_KEY + '_version');
      
      // ⚡ Vérifier la version - Si différente, réinitialiser automatiquement
      if (stored && storedVersion === String(DATA_VERSION)) {
        this.users = JSON.parse(stored);
        if (DEV_MODE) console.log('📦 Chargé depuis localStorage:', this.users.length, 'utilisateurs');
      } else {
        if (storedVersion && storedVersion !== String(DATA_VERSION)) {
          if (DEV_MODE) console.log('🔄 Nouvelle version détectée (' + storedVersion + ' → ' + DATA_VERSION + '), réinitialisation...');
        } else {
          if (DEV_MODE) console.log('🆕 Première initialisation');
        }
        this.users = this.getDefaultUsers();
        this.saveToStorage();
      }
    } catch (error) {
      if (DEV_MODE) console.error('❌ Erreur chargement:', error);
      this.users = this.getDefaultUsers();
      this.saveToStorage();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY + '_version', String(DATA_VERSION));
      if (DEV_MODE) console.log('💾 Sauvegardé (version ' + DATA_VERSION + ')');
    } catch (error) {
      if (DEV_MODE) console.error('❌ Erreur sauvegarde:', error);
    }
  }

  resetToDefault() {
    if (DEV_MODE) console.log('🔄 Réinitialisation manuelle des données');
    this.users = this.getDefaultUsers();
    this.saveToStorage();
  }

  getDefaultUsers() {
    return [
      { 
        id: 11, 
        username: '07014860458',
        password: '260823', 
        name: 'Laeticia Guillon', 
        email: 'laeticia.guillon@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 2368000.00,
        isBlocked: true,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee:10000.00,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Laeticia Guillon'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 180000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      { 
        id: 21, 
        username: '07014860457',
        password: '260823', 
        name: 'Sergio Nicolas', 
        email: 'sergionicolas@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Toulon',
        location: 'Toulon, France',
        manager: 'Lucien Vollet',
        balance: 500300000.20,
        isBlocked: false,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee:500300000.26,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Sergio Nicolas'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 500300000.20, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      { 
        id: 21, 
        username: '07014860457',
        password: '260823', 
        name: 'Sergio Nicolas', 
        email: 'sergionicolas@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Toulon',
        location: 'Toulon, France',
        manager: 'Lucien Vollet',
        balance: 2368000.00,
        isBlocked: false,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee:500300000.26,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Sergio Nicolas'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 180000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      { 
        id: 21, 
        username: '07014860457',
        password: '260823', 
        name: 'Sergio Nicolas', 
        email: 'sergionicolas@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Toulon',
        location: 'Toulon, France',
        manager: 'Lucien Vollet',
        balance: 2368000.00,
        isBlocked: false,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee:500300000.26,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Sergio Nicolas'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 800000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '17 août 2026', reference: 'NL16 *** 578', amount: 300000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      { 
        id: 12, 
        username: '07014860441',
        password: '260823', 
        name: 'Cécile Françoise Creussot', 
        email: 'cécilecreussot@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 800000.00,
        isBlocked: false,
        canTransfer: true,
        canTransferWhenBlocked: true,
        unlockFee: null,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Cécile Françoise Creussot'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 800000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      { 
        id: 14, 
        username: '07014860491',
        password: '260824', 
        name: 'Patrick Levoisier', 
        email: 'jeanvangelder@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 2600000.00,
        isBlocked: false,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee: null,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Jan Vangelder'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 180000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      { 
        id: 13, 
        username: '07014860450',
        password: '260823', 
        name: 'Dominique Rougie', 
        email: 'jeanvangelder@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 600000.00,
        isBlocked: true,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee: 60000,
        blockReason: 'Blocage pour suspicion de fraude',
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'blocked',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Dominique Rougie'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 600000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      // ==================== SUITE DES UTILISATEURS ====================

      {
        id: 15,
        username: '07014860452',
        password: '260823',
        name: 'Marie Van',
        email: 'marie.van@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000003',
        country: 'France',
        city: 'Paris',
        location: 'Paris, France',
        manager: 'Lucien Vollet',
        balance: 1250000.00,
        isBlocked: false,
        canTransfer: false,
        canTransferWhenBlocked: false,
        unlockFee: null,
        blockReason: null,

        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 881',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456790',
          key: '81'
        },

        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2346',
            maskedNumber: '4532 **** **** 2346',
            cvv: '124',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Marie Van'
          }
        ],

        accounts: [
          {
            id: 1,
            type: 'Compte Courant',
            number: 'N°*******2285',
            balance: 1250000.00,
            icon: 'wallet'
          },
          {
            id: 2,
            type: 'Livret A',
            number: 'N°*******5463',
            balance: 30000.40,
            icon: 'piggybank'
          },
          {
            id: 3,
            type: 'Plan Épargne',
            number: 'N°*******8892',
            balance: 50000.17,
            icon: 'trending'
          }
        ],

        transactions: [
          {
            id: 1,
            type: 'Virement entrant',
            date: '02 Déc 2025',
            reference: 'IE28 *** 513',
            amount: 40000.00,
            isCredit: true
          },
          {
            id: 2,
            type: 'Achat carte',
            date: '04 Déc 2025',
            reference: 'CARREFOUR PARIS',
            amount: 85.50,
            isCredit: false
          }
        ],

        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },

        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },

      {
        id: 16,
        username: '07014860453',
        password: '260823',
        name: 'Jean Martin',
        email: 'jean.martin@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000004',
        country: 'France',
        city: 'Lyon',
        location: 'Lyon, France',
        manager: 'Lucien Vollet',
        balance: 950000.00,
        isBlocked: false,

        // IMPORTANT :
        // Le compte n'est PAS bloqué mais les virements sont interdits.
        canTransfer: false,

        canTransferWhenBlocked: false,
        unlockFee: null,
        blockReason: null,

        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 882',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456791',
          key: '82'
        },

        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2347',
            maskedNumber: '4532 **** **** 2347',
            cvv: '125',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Jean Martin'
          }
        ],

        accounts: [
          {
            id: 1,
            type: 'Compte Courant',
            number: 'N°*******2286',
            balance: 950000.00,
            icon: 'wallet'
          },
          {
            id: 2,
            type: 'Livret A',
            number: 'N°*******5464',
            balance: 30000.40,
            icon: 'piggybank'
          },
          {
            id: 3,
            type: 'Plan Épargne',
            number: 'N°*******8893',
            balance: 50000.17,
            icon: 'trending'
          }
        ],

        transactions: [
          {
            id: 1,
            type: 'Virement entrant',
            date: '02 Déc 2025',
            reference: 'IE28 *** 513',
            amount: 40000.00,
            isCredit: true
          }
        ],

        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },

        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      }

      // Ajoute ici les autres utilisateurs de ton fichier original
      // en leur mettant :
      //
      // isBlocked: false,
      // canTransfer: false,
      // canTransferWhenBlocked: false,
    ];
  }

  // ==================== LOGIN ====================

  loginUser(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(
          u => u.username === username && u.password === password
        );

        if (!user) {
          reject(new Error('Identifiant ou mot de passe incorrect'));
          return;
        }

        if (DEV_MODE) {
          console.log('✅ Connexion réussie:', user.name);
        }

        resolve({
          success: true,
          user
        });
      }, 500);
    });
  }

  // ==================== GET USER ====================

  getUserById(userId) {
    return this.users.find(u => u.id === userId);
  }

  getUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  // ==================== VIREMENT ====================

  createTransfer(userId, transferData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {

        if (DEV_MODE) {
          console.log('💸 Virement:', userId, transferData);
        }

        const user = this.users.find(u => u.id === userId);

        if (!user) {
          reject(new Error('Utilisateur non trouvé'));
          return;
        }

        // ==================================================
        // ⚡ NOUVEAU CONTRÔLE
        // ==================================================
        // Le compte peut être parfaitement actif
        // mais les virements peuvent être désactivés.
        if (user.canTransfer === false) {
          reject(
            new Error(
              'Les virements sont actuellement désactivés pour ce compte.'
            )
          );
          return;
        }

        // ==================================================
        // ⚡ CONTRÔLE DU COMPTE BLOQUÉ
        // ==================================================

        if (
          user.isBlocked &&
          !user.canTransferWhenBlocked
        ) {
          reject(
            new Error(
              'Compte bloqué, virement impossible'
            )
          );
          return;
        }

        // ==================================================
        // ⚡ CONTRÔLE DU SOLDE
        // ==================================================

        if (user.balance < transferData.amount) {
          reject(
            new Error('Solde insuffisant')
          );
          return;
        }

        // ==================================================
        // ⚡ DÉBIT DU COMPTE
        // ==================================================

        user.balance -= transferData.amount;

        const compteCourant = user.accounts?.find(
          acc => acc.type === 'Compte Courant'
        );

        if (compteCourant) {
          compteCourant.balance -= transferData.amount;
        }

        // ==================================================
        // ⚡ CRÉATION DE LA TRANSACTION
        // ==================================================

        const newTransaction = {
          id: Date.now(),
          type: 'Virement sortant',

          date: new Date().toLocaleDateString(
            'fr-FR',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }
          ),

          reference: transferData.iban
            ? `${transferData.iban.substring(0, 4)} *** ${transferData.iban.slice(-3)}`
            : 'Virement',

          amount: transferData.amount,

          isCredit: false
        };

        if (!user.transactions) {
          user.transactions = [];
        }

        user.transactions.unshift(
          newTransaction
        );

        // ==================================================
        // ⚡ SAUVEGARDE
        // ==================================================

        this.saveToStorage();

        if (DEV_MODE) {
          console.log(
            '✅ Virement effectué'
          );

          console.log(
            '💰 Nouveau solde:',
            user.balance
          );
        }

        resolve({
          success: true,
          newBalance: user.balance,
          transaction: newTransaction
        });

      }, 1000);
    });
  }

  // ==================== MODIFICATION UTILISATEUR ====================

  updateUser(userId, updates) {
    const user = this.users.find(
      u => u.id === userId
    );

    if (!user) {
      return false;
    }

    Object.assign(user, updates);

    this.saveToStorage();

    return true;
  }

  // ==================== AUTORISATION VIREMENT ====================

  canUserTransfer(userId) {
    const user = this.users.find(
      u => u.id === userId
    );

    if (!user) {
      return false;
    }

    // Le compte doit avoir explicitement
    // l'autorisation de faire des virements.
    if (user.canTransfer === false) {
      return false;
    }

    // Compte bloqué
    if (
      user.isBlocked &&
      !user.canTransferWhenBlocked
    ) {
      return false;
    }

    return true;
  }

  // ==================== ACTIVATION VIREMENT ====================

  enableTransfers(userId) {
    const user = this.users.find(
      u => u.id === userId
    );

    if (!user) {
      return false;
    }

    user.canTransfer = true;

    this.saveToStorage();

    if (DEV_MODE) {
      console.log(
        '✅ Virements activés pour:',
        user.name
      );
    }

    return true;
  }

  // ==================== DÉSACTIVATION VIREMENT ====================

  disableTransfers(userId) {
    const user = this.users.find(
      u => u.id === userId
    );

    if (!user) {
      return false;
    }

    user.canTransfer = false;

    this.saveToStorage();

    if (DEV_MODE) {
      console.log(
        '🚫 Virements désactivés pour:',
        user.name
      );
    }

    return true;
  }

  // ==================== CRÉATION UTILISATEUR ====================

  createUser(userData) {
    return new Promise((resolve, reject) => {
      try {

        const newId =
          Math.max(
            ...this.users.map(u => u.id),
            0
          ) + 1;

        const newUser = {
          id: newId,

          username:
            userData.username || '',

          password:
            userData.password || '',

          name:
            userData.name || '',

          email:
            userData.email || '',

          phone:
            userData.phone || '',

          accountNumber:
            userData.accountNumber ||
            String(
              Date.now()
            ),

          country:
            userData.country ||
            'France',

          city:
            userData.city ||
            '',

          location:
            userData.location ||
            '',

          manager:
            userData.manager ||
            'Lucien Vollet',

          balance:
            userData.balance || 0,

          // ==================================================
          // IMPORTANT
          // ==================================================
          // Nouveau compte :
          // pas de blocage,
          // MAIS aucun virement autorisé par défaut.
          isBlocked: false,

          canTransfer: false,

          canTransferWhenBlocked: false,

          unlockFee: null,

          blockReason: null,

          rib:
            userData.rib || {
              iban: '',
              bankCode: '',
              branchCode: '',
              accountNumber: '',
              key: ''
            },

          cards:
            userData.cards || [],

          accounts:
            userData.accounts || [
              {
                id: 1,
                type: 'Compte Courant',
                number: 'N°*******0000',
                balance:
                  userData.balance || 0,
                icon: 'wallet'
              }
            ],

          transactions:
            userData.transactions || [],

          expenses:
            userData.expenses || {
              month: 'Décembre 2024',
              categories: []
            },

          chequier: 0,

          virementRapide: 0,

          virementProgramme: 0
        };

        this.users.push(newUser);

        this.saveToStorage();

        if (DEV_MODE) {
          console.log(
            '✅ Utilisateur créé:',
            newUser.name
          );
        }

        resolve({
          success: true,
          user: newUser
        });

      } catch (error) {

        if (DEV_MODE) {
          console.error(
            '❌ Erreur création utilisateur:',
            error
          );
        }

        reject(error);
      }
    });
  }
}

// ==========================================================
// INSTANCE UNIQUE
// ==========================================================

const userService = new UserService();

export default userService;