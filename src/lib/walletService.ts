import api from './api';

/**
 * Service to handle wallet-related API calls
 */
export const walletService = {
  /**
   * Connect a wallet address to the user's profile
   * @param walletAddress The wallet address to connect
   * @param walletType The type of wallet (ethereum, solana)
   * @returns Promise with the response data
   */
  connectWallet: async (walletAddress: string, walletType: 'ethereum' | 'solana') => {
    try {
      const response = await api.post(
        `/api/user/wallet/connect`,
        { walletAddress, walletType }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to connect wallet');
      }
      throw error;
    }
  },

  /**
   * Disconnect the wallet from the user's profile
   * @returns Promise with the response data
   */
  disconnectWallet: async (walletAddress: string, walletType: 'ethereum' | 'solana') => {
    try {
      const response = await api.post(`/api/user/wallet/disconnect`, {
        walletAddress,
        walletType
      });
      return response.data;
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to disconnect wallet');
      }
      throw error;
    }
  },

  /**
   * Get all wallets for the current user
   * @returns Promise with the list of wallets
   */
  getWalletStatus: async () => {
    try {
      const response = await api.get(`/api/user/wallets`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting wallet status:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to get wallet status');
      }
      throw error;
    }
  },

  /**
   * Set a wallet as primary for its blockchain type
   * @param walletId The ID of the wallet to set as primary
   * @returns Promise with the updated wallet
   */
  setPrimaryWallet: async (walletId: string) => {
    try {
      const response = await api.post(`/api/user/wallet/set-primary`, { walletId });
      return response.data;
    } catch (error: any) {
      console.error('Error setting primary wallet:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to set primary wallet');
      }
      throw error;
    }
  }
}; 