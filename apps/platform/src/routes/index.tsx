import { initialMessagesFromMemory, useChat } from "@anvia/react";
import { ChatProvider, Composer, Message, Thread } from "@anvia/react-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const response = await fetch("http://localhost:3001/api/chat");
    const data = await response.json();
    return data;
  },
});

function Home() {
  const messages = Route.useLoaderData();

  const chat = useChat({
    endpoint: "http://localhost:3001/api/chat",
    initialMessages: initialMessagesFromMemory(messages),
  });

  return (
    <ChatProvider controller={chat}>
      <div className="flex min-h-[100dvh] flex-col bg-zinc-50 text-zinc-900">
        <header className="shrink-0 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between gap-4">
            <h1 className="text-sm font-semibold tracking-tight text-zinc-900">
              Chat
            </h1>
            <p className="text-xs text-zinc-500">
              {chat.status === "streaming" ? "Generating..." : "Ready"}
            </p>
          </div>
        </header>

        <Thread.Root className="mx-auto grid min-h-0 w-full max-w-3xl flex-1 grid-rows-[1fr_auto]">
          <Thread.Viewport
            className="min-h-0 overflow-y-auto px-4 py-6"
            autoScroll
          >
            <Thread.Empty className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col items-center justify-center gap-2 text-center">
              <p className="text-lg font-medium tracking-tight text-zinc-900">
                Ask your first question
              </p>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                Type a message below to start the conversation.
              </p>
            </Thread.Empty>

            <Thread.Suggestions className="mx-auto mb-4 flex w-full max-w-3xl flex-wrap gap-2" />

            <Thread.Messages className="mx-auto grid w-full max-w-3xl gap-4">
              {() => (
                <Message.Root className="group grid gap-2 data-[role=user]:justify-items-end data-[role=assistant]:justify-items-start">
                  <Message.Content className="max-w-[min(100%,42rem)] text-sm leading-relaxed group-data-[role=user]:rounded-2xl group-data-[role=user]:bg-zinc-900 group-data-[role=user]:px-4 group-data-[role=user]:py-3 group-data-[role=user]:text-zinc-50 group-data-[role=assistant]:text-zinc-800">
                    <Message.Parts>
                      {(part) => {
                        if (part.type === "text") {
                          return (
                            <Message.Part className="[&_a]:text-emerald-700 [&_a]:underline [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:text-zinc-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 group-data-[role=user]:[&_code]:bg-zinc-800 group-data-[role=user]:[&_a]:text-emerald-300">
                              <Message.Markdown />
                            </Message.Part>
                          );
                        }

                        if (part.type === "attachment") {
                          return (
                            <Message.Part className="mt-2">
                              <Message.Attachment className="block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm" />
                            </Message.Part>
                          );
                        }

                        if (part.type === "tool") {
                          return (
                            <Message.Part className="mt-2">
                              <Message.Tool
                                className="rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600 shadow-sm data-[state=output-available]:border-emerald-300 data-[state=output-error]:border-rose-300"
                                renderWhen="always"
                              />
                            </Message.Part>
                          );
                        }

                        return <Message.Part />;
                      }}
                    </Message.Parts>
                  </Message.Content>

                  <Message.Actions className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-data-[role=user]:justify-end">
                    <Message.Copy className="min-h-11 rounded-lg px-3 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 active:scale-[0.98]">
                      Copy
                    </Message.Copy>
                    <Message.Regenerate className="min-h-11 rounded-lg px-3 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 active:scale-[0.98]">
                      Retry
                    </Message.Regenerate>
                  </Message.Actions>
                </Message.Root>
              )}
            </Thread.Messages>

            <Thread.Loading className="mx-auto mt-4 w-full max-w-3xl text-sm text-zinc-500">
              Assistant is writing...
            </Thread.Loading>

            <Thread.Error className="mx-auto mt-4 w-full max-w-3xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" />

            <Thread.ViewportFooter className="sticky bottom-4 flex justify-center">
              <Thread.ScrollToBottom className="min-h-11 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98] data-[state=bottom]:invisible">
                Latest
              </Thread.ScrollToBottom>
            </Thread.ViewportFooter>
          </Thread.Viewport>

          <Composer.Root className="mx-auto mb-4 flex w-[min(760px,calc(100%-32px))] items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
            <Composer.Input
              className="min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400"
              minRows={1}
              maxRows={6}
              placeholder="Message Anvia..."
            />
            {chat.status === "streaming" ? (
              <Composer.Stop className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98]">
                Stop
              </Composer.Stop>
            ) : (
              <Composer.Submit className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
                Send
              </Composer.Submit>
            )}
          </Composer.Root>
        </Thread.Root>
      </div>
    </ChatProvider>
  );
}
