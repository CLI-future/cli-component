export interface PackageJson {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  [key: string]: unknown
}

export interface ConfigFileStatus {
  isAvailable: boolean;
  path: string;
  config: CliConfig | null
}