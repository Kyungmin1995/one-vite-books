import { BookData } from "@/types";

export default async function fetchBooksId(
  id: number
): Promise<BookData | null> {
  const url = `http://localhost:12345/book/${id}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw Error();
    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
