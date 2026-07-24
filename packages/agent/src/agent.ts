import { AgentBuilder, type AnyTool, type CompletionModel, type MemoryStore } from "@anvia/core";
import type { LangfuseTracing } from "@anvia/langfuse";
import { defaultModel } from "./providers/openai.js";

interface CreateAgentOptions {
  agentId: string;
  model?: CompletionModel;
  additionalTools?: AnyTool[];
  additionalInstructions?: string[];
  tracing: LangfuseTracing;
  memory?: MemoryStore;
}

export function createAgent(opts: CreateAgentOptions) {
    const agent = new AgentBuilder(opts.agentId, opts.model ?? defaultModel)
}
