import type { Metadata } from "next";
import QuestLogClient from './questLogClient';
 import TopNav from "@/components/main/topnav";

export const metadata: Metadata = {
  title: 'JV Estolas | Quest Log',
  description: "Interactive Kanban-style task tracker for organizing and managing tasks.",
};

export default function Page() {
  return (
    <>
      <TopNav hideAnchors linkToMain />
      <QuestLogClient />
    </>
  )
}
