/**
 * Module specification for Gidion capability modules.
 *
 * Every module in modules/ must export:
 *
 *   name        - string, unique module id
 *   description - string, what this module does
 *   version     - string, semver
 *   tools       - array of tool definitions (see below)
 *   init(ctx)   - async function, called once at startup
 *
 * Tool definition:
 *   {
 *     name: string,
 *     description: string,
 *     parameters: object (JSON Schema),
 *     execute: async function(params, ctx) => result
 *   }
 *
 * ctx object provides:
 *   config, memory, log, callTool, callAgent
 */

export const MODULE_SPEC_VERSION = '1.0';
