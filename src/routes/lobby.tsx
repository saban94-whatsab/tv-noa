import { createFileRoute } from "@tanstack/react-router";
import { DispatchProvider } from "@/context/DispatchContext";
import { LobbyMediaOrchestrator } from "@/components/lobby/LobbyMediaOrchestrator";

export const Route = createFileRoute("/lobby")({
  head: () => ({
    meta: [
      { title: "ח. סבן · מסך שילוט ושיווק מוצרים בלובי (Lobby Signage)" },
      {
        name: "description",
        content:
          "מסך שילוט דיגיטלי ושיווק מוצרי פרמיום ללובי החנות בח. סבן חומרי בניין (1994) בע״מ.",
      },
      { property: "og:title", content: "ח. סבן · מסך שילוט בלובי" },
      { property: "og:description", content: "הקרנה רציפה של מפרטי מוצרים, מבצעים וסרטוני הדרכה." },
    ],
  }),
  component: LobbyRouteComponent,
});

function LobbyRouteComponent() {
  return (
    <DispatchProvider>
      <main className="w-screen h-screen min-h-screen bg-black overflow-hidden m-0 p-0 select-none">
        <LobbyMediaOrchestrator />
      </main>
    </DispatchProvider>
  );
}
