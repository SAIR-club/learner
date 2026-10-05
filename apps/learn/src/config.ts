import { homedir } from 'node:os'
import { join } from 'node:path'

/**
 * Centralized configuration loader for the Learn surface.
 *
 * Reads configuration from runtime flags and environment variables (.env),
 * providing consistent fallbacks without scattered hardcoded paths.
 */

export const DEFAULT_HOST = '127.0.0.1'
export const DEFAULT_PORT = 4321

/**
 * Resolves the path to the cognitive graph storage file (JSONL format).
 * Precedence:
 *   1. Explicit override passed as parameter (e.g. CLI --file flag)
 *   2. EPISTEME_FILE environment variable
 *   3. $EPISTEME_DATA_DIR/learn.jsonl
 *   4. ~/.episteme/learn.jsonl
 */
export function resolveGraphFilePath(override?: string): string {
  if (override !== undefined && override.trim() !== '') {
    return override
  }
  if (process.env.EPISTEME_FILE !== undefined && process.env.EPISTEME_FILE.trim() !== '') {
    return process.env.EPISTEME_FILE
  }
  const dataDir = process.env.EPISTEME_DATA_DIR?.trim()
  if (dataDir !== undefined && dataDir !== '') {
    return join(dataDir, 'learn.jsonl')
  }
  return join(homedir(), '.episteme', 'learn.jsonl')
}

/**
 * Resolves the HTTP server port.
 * Precedence:
 *   1. Explicit override passed as parameter (e.g. CLI --port flag)
 *   2. PORT environment variable
 *   3. Default port (4321)
 */
export function resolvePort(override?: number | string): number {
  if (override !== undefined) {
    const parsed = typeof override === 'number' ? override : Number.parseInt(override, 10)
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 65535) {
      return parsed
    }
  }
  const envPort = process.env.PORT
  if (envPort !== undefined) {
    const parsed = Number.parseInt(envPort, 10)
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 65535) {
      return parsed
    }
  }
  return DEFAULT_PORT
}

/**
 * Resolves the HTTP server bind host.
 * Precedence:
 *   1. Explicit override passed as parameter
 *   2. HOST environment variable
 *   3. 127.0.0.1 (loopback)
 */
export function resolveHost(override?: string): string {
  if (override !== undefined && override.trim() !== '') {
    return override
  }
  if (process.env.HOST !== undefined && process.env.HOST.trim() !== '') {
    return process.env.HOST
  }
  return DEFAULT_HOST
}

/**
 * Resolves the optional seed topic file.
 */
export function resolveTopicFilePath(override?: string): string | undefined {
  if (override !== undefined && override.trim() !== '') {
    return override
  }
  const envTopic = process.env.EPISTEME_TOPIC_FILE
  if (envTopic !== undefined && envTopic.trim() !== '') {
    return envTopic
  }
  return undefined
}
