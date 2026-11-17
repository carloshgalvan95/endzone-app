export class ContractUpdateRequiredError extends Error {
  readonly code = 'contract-update-required' as const;

  constructor(readonly contractVersion: string) {
    super(
      `This app reads site data contract major version 1. The file says ${contractVersion}. Update the app.`,
    );
    this.name = 'ContractUpdateRequiredError';
  }
}

export class ContractValidationError extends Error {
  readonly code = 'contract-validation' as const;

  constructor(message: string) {
    super(message);
    this.name = 'ContractValidationError';
  }
}
