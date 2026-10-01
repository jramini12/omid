import { Carousel } from "@/components/Carousel";
import { Chrome } from "@/components/Chrome";
import { featured } from "@/content/work";

export default function Home() {
  return (
    <>
      <Chrome />
      <main id="main" className="relative h-dvh overflow-hidden">
        <h1 className="sr-only">Omid, hope. Featured work</h1>
        <Carousel items={featured} />
      </main>
    </>
  );
}
