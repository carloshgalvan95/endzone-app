import { ContractUpdateRequiredError, ContractValidationError } from '@/contract/errors';
import { TrackRecordView } from '@/components/TrackRecord';
import { ErrorState, LoadingState, UpdateRequiredState } from '@/components/ScreenState';
import { useTrackRecord } from '@/data/queries';
import { presentTrackRecord } from '@/features/track-record/present';
import { useTheme } from '@/theme/ThemeProvider';
import { View } from 'react-native';

export default function RecordScreen() {
  const query = useTrackRecord();
  const theme = useTheme();
  const shell = { flex: 1, backgroundColor: theme.color.bg } as const;

  if (query.error instanceof ContractUpdateRequiredError) {
    return (
      <View style={shell}>
        <UpdateRequiredState onRetry={() => query.refetch()} />
      </View>
    );
  }
  if (!query.data) {
    if (query.isPending) {
      return (
        <View style={shell}>
          <LoadingState />
        </View>
      );
    }
    const message =
      query.error instanceof ContractValidationError
        ? 'This file does not match the data contract this app knows.'
        : 'The record could not be loaded. Check the connection and try again.';
    return (
      <View style={shell}>
        <ErrorState message={message} onRetry={() => query.refetch()} />
      </View>
    );
  }

  return <TrackRecordView model={presentTrackRecord(query.data)} />;
}
