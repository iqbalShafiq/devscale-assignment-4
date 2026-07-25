import { Hono } from "hono";
import { prisma } from "../../utils/prisma.js";
import { createPrismaMemoryStore } from "@anvia/memory-prisma";
import { createAgent, tracing } from "@assingment/agent";
import { createEventStream } from "@anvia/server";

const SESSION_ID = "example-session-id";

export const chatRouter = new Hono()
  .get("/", async (c) => {
    const prismaMemory = createPrismaMemoryStore(prisma);
    const messages = await prismaMemory.load({
      sessionId: SESSION_ID,
    });

    return c.json(messages);
  })
  .post("/", async (c) => {
    const body = await c.req.json();
    const messages = body.messages;
    const lastMessage = messages[messages.length - 1];

    const prismaMemory = createPrismaMemoryStore(prisma);

    const agent = createAgent({
      agentId: "my-agent",
      tracing: tracing,
      additionalInstructions: [],
      additionalTools: [],
      memory: prismaMemory,
    });

    const stream = agent
      .session(SESSION_ID)
      .prompt(lastMessage)
      .withTrace({ sessionId: SESSION_ID })
      .stream();

    return createEventStream(stream, {
      format: "jsonl",
    });
  });
