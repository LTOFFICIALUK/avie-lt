export interface Plugin {
  id: string;
  title: string;
  description: string;
  price: string;
  settingsUrl: string;
  isActive?: boolean;
  isLoading?: boolean;
  isRedeploying?: boolean;
  comingSoon?: boolean;
}
