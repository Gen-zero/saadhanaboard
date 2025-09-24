import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsType } from './SettingsTypes';
import { useTranslation } from 'react-i18next';

interface GeneralSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  const [displayName, setDisplayName] = useState(settings.general?.displayName || '');
  const [email, setEmail] = useState(settings.general?.email || '');
  const { t } = useTranslation();

  // Update local state when settings change
  useEffect(() => {
    setDisplayName(settings.general?.displayName || '');
    setEmail(settings.general?.email || '');
  }, [settings]);

  // Handle display name change
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    updateSettings(['general', 'displayName'], value);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    updateSettings(['general', 'email'], value);
  };

  // Guard against undefined settings or settings still loading
  if (!settings) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <span>{t('general_settings')}</span>
        </CardTitle>
        <CardDescription>{t('manage_preferences')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name">{t('display_name')}</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder={t('enter_display_name')}
            />
          </div>

          <Separator />

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t('enter_email')}
            />
          </div>

          <Separator />

          {/* Language - Limited to English and Hindi */}
          <div className="space-y-2">
            <Label htmlFor="language">{t('language')}</Label>
            <Select 
              value={settings.language || 'english'} 
              onValueChange={(value) => updateSettings(['language'], value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('select_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">{t('english')}</SelectItem>
                <SelectItem value="hindi">{t('hindi')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Start Page */}
          <div className="space-y-2">
            <Label htmlFor="start-page">{t('start_page')}</Label>
            <Select 
              value={settings.startPage || 'dashboard'} 
              onValueChange={(value) => updateSettings(['startPage'], value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('select_start_page')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">{t('dashboard')}</SelectItem>
                <SelectItem value="library">{t('library')}</SelectItem>
                <SelectItem value="sadhanas">{t('sadhanas')}</SelectItem>
                <SelectItem value="community">{t('community')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;