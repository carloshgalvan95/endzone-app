import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020';

import slateSchema from '../../contracts/v1/slate.schema.json';
import teamsSchema from '../../contracts/v1/teams.schema.json';
import trackRecordSchema from '../../contracts/v1/track_record.schema.json';
import { ContractUpdateRequiredError, ContractValidationError } from './errors';
import type { Slate, TeamsDocument, TrackRecordDocument } from './types';
import { gateContractVersion } from './version';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  validateSchema: true,
});

const validateSlateSchema: ValidateFunction = ajv.compile(slateSchema);
const validateTeamsSchema: ValidateFunction = ajv.compile(teamsSchema);
const validateTrackRecordSchema: ValidateFunction = ajv.compile(trackRecordSchema);

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return 'The document does not match the v1 schema.';
  }
  return errors
    .slice(0, 8)
    .map((error) => `${error.instancePath || '/'} ${error.message ?? 'is invalid'}`.trim())
    .join('; ');
}

function parseWithSchema<T>(schemaName: string, validate: ValidateFunction, document: unknown): T {
  const gate = gateContractVersion(document);
  if (gate.status === 'invalid') {
    throw new ContractValidationError(`${schemaName} is not a v1 JSON object.`);
  }
  if (gate.status === 'update') {
    throw new ContractUpdateRequiredError(gate.version);
  }
  if (!validate(document)) {
    throw new ContractValidationError(`${schemaName}: ${formatAjvErrors(validate.errors)}`);
  }
  return document as T;
}

export function parseSlate(document: unknown): Slate {
  return parseWithSchema('slate', validateSlateSchema, document);
}

export function parseTeams(document: unknown): TeamsDocument {
  return parseWithSchema('teams', validateTeamsSchema, document);
}

export function parseTrackRecord(document: unknown): TrackRecordDocument {
  return parseWithSchema('track_record', validateTrackRecordSchema, document);
}
