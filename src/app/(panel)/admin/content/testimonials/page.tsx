import { getTestimonials } from "@/lib/actions/testimonials";
import { TestimonialsClient } from "./TestimonialsClient";

interface MultiLang {
  id: string;
  en: string;
  ms: string;
}

export default async function TestimonialsPage() {
  const data = await getTestimonials();
  const serialized = data.map((t) => ({
    ...t,
    role: (t.role as unknown as MultiLang) || { id: "", en: "", ms: "" },
    text: (t.text as unknown as MultiLang) || { id: "", en: "", ms: "" },
  }));
  return <TestimonialsClient initialData={serialized} />;
}
