import { AboutCard } from '@/components/AboutCard';
import { useSlate, useTeams } from '@/data/queries';

export default function AboutScreen() {
  const slate = useSlate({ kind: 'latest' });
  const teams = useTeams();
  return (
    <AboutCard
      modelName={slate.data?.model_name}
      modelVersion={slate.data?.model_version}
      modelAlias={slate.data?.model_alias}
      featureSet={slate.data?.feature_set}
      generatedAt={slate.data?.generated_at}
      teamsSource={teams.data?.source}
      teamsSourceUrl={teams.data?.source_url}
    />
  );
}
