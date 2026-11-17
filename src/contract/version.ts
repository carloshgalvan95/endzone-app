export const SUPPORTED_CONTRACT_MAJOR = 1;

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;
const LEADING_MAJOR = /^(\d+)/;

export type ContractVersionGate =
  | { status: 'ok'; assumed: boolean; version: string | null }
  | { status: 'update'; version: string }
  | { status: 'invalid' };

/**
 * A missing contract_version is major 1. ADR-011 leaves the field off files
 * that were already published. Any other major asks for an app update.
 */
export function gateContractVersion(document: unknown): ContractVersionGate {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    return { status: 'invalid' };
  }

  const value = (document as Record<string, unknown>).contract_version;
  if (value == null) {
    return { status: 'ok', assumed: true, version: null };
  }
  if (typeof value !== 'string') {
    return { status: 'invalid' };
  }

  const trimmed = value.trim();
  const match = SEMVER.exec(trimmed);
  const majorText = match?.[1];
  if (match && majorText != null && match[2] != null && match[3] != null) {
    const major = Number(majorText);
    if (major !== SUPPORTED_CONTRACT_MAJOR) {
      return { status: 'update', version: trimmed };
    }
    return { status: 'ok', assumed: false, version: trimmed };
  }

  const looseMajor = LEADING_MAJOR.exec(trimmed)?.[1];
  if (looseMajor != null && Number(looseMajor) !== SUPPORTED_CONTRACT_MAJOR) {
    return { status: 'update', version: trimmed };
  }
  return { status: 'invalid' };
}
