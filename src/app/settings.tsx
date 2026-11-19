import { useEffect } from 'react';

import { SettingsCard } from '@/components/SettingsCard';
import { restoreTuesdayAlert } from '@/features/notifications/tuesday';

export default function SettingsScreen() {
  useEffect(() => {
    restoreTuesdayAlert().catch(() => undefined);
  }, []);
  return <SettingsCard />;
}
